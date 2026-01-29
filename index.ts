import type { Plugin } from "@opencode-ai/plugin";

const OpencodeArchitect: Plugin = async (input) => {
  return {
    config: async (config) => {
      config.agent = config.agent || {};
      config.agent["test"] = {
        description: "test",
        name: "test",
        model: undefined,
        temperature: undefined,
        prompt: "You are a test agent.",
      };
      return;
    },
  };
};

export default OpencodeArchitect;
