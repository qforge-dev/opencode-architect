import { tool } from "@opencode-ai/plugin";

import { OpenCodeDocsFetcher } from "../scripts/fetch-opencode-docs";

type ToolDefinition = ReturnType<typeof tool>;

function createSyncDocsTool(): ToolDefinition {
  return tool({
    description: "Sync OpenCode documentation by fetching the latest docs from opencode.ai",
    args: {},
    async execute(_args, _context) {
      try {
        const fetcher = new OpenCodeDocsFetcher();
        await fetcher.run();
        return "Successfully synced OpenCode documentation.";
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return `Failed to sync docs: ${message}`;
      }
    },
  });
}

export { createSyncDocsTool };
