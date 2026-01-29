# Coding Best Practices

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
