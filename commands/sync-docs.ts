import type { Config } from "@opencode-ai/sdk";

export const command: NonNullable<Config["command"]>[string] = {
  description: "Sync OpenCode docs into ~/.cache/opencode/opencode-architect/docs",
  template:
    "Use the sync-docs tool to fetch the latest OpenCode documentation into `~/.cache/opencode/opencode-architect/docs`.",
};

export default command;
