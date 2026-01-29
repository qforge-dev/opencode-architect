# Coding Best Practices

## What This Product Is

This package is an OpenCode plugin that bundles a set of specialized agents and utilities for building OpenCode projects. It registers expert agents for architecture, agent design, command crafting, MCP integration, plugin engineering, skill creation, and tool building. It also exposes a `sync-docs` command and tool to fetch OpenCode documentation, and it syncs docs automatically at startup with a toast error if the sync fails.

## How It Works

The plugin entry in `index.ts` registers the agents and commands with the OpenCode plugin system. It also initializes a docs fetcher on startup and wires up a tool so the same sync can be triggered on demand. The project builds with Bun into `dist/` and publishes the compiled output for use by OpenCode.

## Why It Works This Way

The plugin model lets OpenCode discover and load the agents and commands without extra wiring. Centralizing the registration in the entry file keeps the integration surface clear, while automatic doc sync keeps prompt and coding guidance current for the bundled agents. The build step ensures the package ships stable ESM output and type declarations for downstream consumers.

## Contributing

Use the README for install/build steps and follow the coding best practices in this file. Keep agents, tools, and commands focused and cohesive, add new classes in separate files, and prefer descriptive names over comments. When adding a new agent or command, wire it through the plugin entry so it is available at runtime, and ensure docs sync behavior stays intact.

## Function Declarations

Prefer `function` syntax over arrow functions assigned to variables:

```typescript
// Preferred
function processData(input: string): string {
  return input.trim();
}

// Avoid
const processData = (input: string): string => {
  return input.trim();
};
```

## Helper Function Placement

Place helper functions below their first usage and rely on hoisting. This keeps the main logic at the top of the file for better readability:

```typescript
// Main export or entry point first
export function main(): void {
  const result = helperFunction();
  console.log(result);
}

// Helper functions below
function helperFunction(): string {
  return "helper result";
}
```

## No Comments

Do not leave comments in code. Use descriptive method and variable names instead.

## Classes Over Helpers

Encapsulate related logic in classes with private methods instead of creating standalone helper functions.

## Nullable Over Optional

Avoid optional fields in types and interfaces. Use explicit nullable types:

```typescript
// Preferred
interface Config {
  value: string | null;
}

// Avoid
interface Config {
  value?: string;
}
```

## New Classes in Separate Files

When adding new classes, place each class in its own file instead of embedding new class declarations in large modules.
