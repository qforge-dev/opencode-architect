import type { Config } from "@opencode-ai/sdk";

export const command: NonNullable<Config["command"]>[string] = {
  description: "Sync OpenCode docs into .opencode/docs",
  template: `Use the sync-docs tool to fetch the latest OpenCode documentation into \`.opencode/docs\`.`,
};

export default command;
