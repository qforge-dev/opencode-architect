import { access, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { Logger } from "./logger";
import { ConsoleLogger } from "./logger";

interface ExternalDoc {
  url: string;
  filename: string;
}

export class OpenCodeDocsFetcher {
  private readonly sitemapUrl: string;
  private readonly docsDir: string;
  private readonly externalDocs: ExternalDoc[];
  private readonly logger: Logger;

  public constructor(logger: Logger | null = null) {
    this.sitemapUrl = "https://opencode.ai/sitemap.xml";
    this.docsDir = path.join(
      os.homedir(),
      ".cache",
      "opencode",
      "opencode-architect",
      "docs",
    );
    this.logger = logger ?? new ConsoleLogger();
    this.externalDocs = [
      {
        url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md",
        filename: "claude-skill-best-practices.md",
      },
      {
        url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices.md",
        filename: "claude-4-best-practices.md",
      },
    ];
  }

  public async run(): Promise<void> {
    try {
      await this.ensureDocsDir();
      const sitemap = await this.fetchText(this.sitemapUrl);
      const docUrls = this.extractDocUrls(sitemap);
      const markdownUrls = this.buildMarkdownUrls(docUrls);
      await this.downloadDocs(markdownUrls);
      await this.downloadExternalDocs();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to fetch OpenCode docs: ${message}`);
      process.exitCode = 1;
    }
  }

  private async ensureDocsDir(): Promise<void> {
    await mkdir(this.docsDir, { recursive: true });
  }

  private async fetchText(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "opencode-docs-fetcher",
      },
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${url}`);
    }
    return await response.text();
  }

  private extractDocUrls(sitemap: string): string[] {
    const urls: string[] = [];
    const regex = /<loc>([^<]+)<\/loc>/g;
    let match: RegExpExecArray | null = regex.exec(sitemap);
    while (match) {
      const url = match[1];
      if (url !== undefined) {
        try {
          const parsed = new URL(url);
          if (parsed.pathname.startsWith("/docs/")) {
            urls.push(url);
          }
        } catch {
          continue;
        }
      }
      match = regex.exec(sitemap);
    }
    return Array.from(new Set(urls));
  }

  private buildMarkdownUrls(urls: string[]): string[] {
    const markdownUrls: string[] = [];
    for (const url of urls) {
      const parsed = new URL(url);
      if (!parsed.pathname.startsWith("/docs/")) {
        continue;
      }
      const normalizedPath = this.normalizeDocPath(parsed.pathname);
      if (normalizedPath === "/docs") {
        continue;
      }
      const markdownUrl = `${parsed.origin}${normalizedPath}.md`;
      markdownUrls.push(markdownUrl);
    }
    return Array.from(new Set(markdownUrls));
  }

  private normalizeDocPath(pathname: string): string {
    if (pathname.endsWith("/")) {
      return pathname.slice(0, -1);
    }
    return pathname;
  }

  private async downloadDocs(urls: string[]): Promise<void> {
    let successCount = 0;
    let failureCount = 0;
    for (const url of urls) {
      try {
        const content = await this.fetchText(url);
        const filename = this.buildFilename(url);
        const filePath = path.join(this.docsDir, filename);
        await writeFile(filePath, content);
        successCount += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Failed to fetch ${url}: ${message}`);
        failureCount += 1;
      }
    }

    this.logger.info(
      `OpenCode docs fetch complete. Success: ${successCount}, Failed: ${failureCount}.`,
    );
  }

  private async downloadExternalDocs(): Promise<void> {
    let successCount = 0;
    let failureCount = 0;
    for (const doc of this.externalDocs) {
      try {
        const content = await this.fetchText(doc.url);
        const filePath = path.join(this.docsDir, doc.filename);
        await writeFile(filePath, content);
        successCount += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Failed to fetch ${doc.url}: ${message}`);
        failureCount += 1;
      }
    }

    this.logger.info(
      `External docs fetch complete. Success: ${successCount}, Failed: ${failureCount}.`,
    );
  }

  private buildFilename(url: string): string {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    if (pathname === "/docs.md" || pathname === "/docs/.md") {
      return "index.md";
    }

    let relative = pathname;
    if (relative.startsWith("/docs/")) {
      relative = relative.slice("/docs/".length);
    } else if (relative.startsWith("/docs")) {
      relative = relative.slice("/docs".length);
    }

    if (relative.startsWith("/")) {
      relative = relative.slice(1);
    }

    if (relative.length === 0) {
      return "index.md";
    }

    const normalized = relative.replace(/\//g, "-");
    if (normalized.endsWith(".md")) {
      return normalized;
    }
    return `${normalized}.md`;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

if (import.meta.main) {
  void new OpenCodeDocsFetcher().run();
}
