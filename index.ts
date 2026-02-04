import type { Plugin, PluginInput } from "@opencode-ai/plugin";

import { agent as opencodeAgentDesigner } from "./agents/opencode-agent-designer";
import { agent as opencodeArchitect } from "./agents/opencode-architect";
import { agent as opencodeCommandCrafter } from "./agents/opencode-command-crafter";
import { agent as opencodeMdpluginEngineer } from "./agents/opencode-mdplugin-engineer";
import { agent as opencodeMcpIntegrator } from "./agents/opencode-mcp-integrator";
import { agent as opencodePluginEngineer } from "./agents/opencode-plugin-engineer";
import { agent as opencodeSkillCreator } from "./agents/opencode-skill-creator";
import { agent as opencodeToolBuilder } from "./agents/opencode-tool-builder";
import { command as syncDocsCommand } from "./commands/sync-docs";
import { OpenCodeDocsFetcher } from "./scripts/fetch-opencode-docs";
import { SilentLogger } from "./scripts/logger";
import { createSyncDocsTool } from "./tools/sync-docs";

const OpencodeArchitect: Plugin = async (input) => {
  const syncDocsTool = createSyncDocsTool();

  syncDocsOnStartup(input.client);

  return {
    config: async (config) => {
      config.agent = config.agent || {};
      config.command = config.command || {};
      config.agent["opencode-agent-designer"] = opencodeAgentDesigner;
      config.agent["opencode-architect"] = opencodeArchitect;
      config.agent["opencode-command-crafter"] = opencodeCommandCrafter;
      config.agent["opencode-mdplugin-engineer"] = opencodeMdpluginEngineer;
      config.agent["opencode-mcp-integrator"] = opencodeMcpIntegrator;
      config.agent["opencode-plugin-engineer"] = opencodePluginEngineer;
      config.agent["opencode-skill-creator"] = opencodeSkillCreator;
      config.agent["opencode-tool-builder"] = opencodeToolBuilder;
      config.command["sync-docs"] = syncDocsCommand;
    },
    tool: {
      "sync-docs": syncDocsTool,
    },
  };
};

export default OpencodeArchitect;

function syncDocsOnStartup(client: PluginInput["client"]): void {
  const fetcher = new OpenCodeDocsFetcher(new SilentLogger());
  fetcher.run().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    client.tui.showToast({
      body: {
        message: `Failed to sync OpenCode docs: ${message}`,
        variant: "error",
      },
    });
  });
}
