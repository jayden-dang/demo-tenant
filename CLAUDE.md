# CLAUDE.md - packages/demo-tenant-miniapp (@klynt/demo-tenant-miniapp)

## Purpose

Demo tenant mini-app for testing the sandbox infrastructure. Used to validate the mini-app SDK, runtime, and host-sandbox communication. Part of Story 7.9 development.

## When to Change

- Testing new mini-app SDK features
- Validating sandbox security
- Demonstrating mini-app capabilities

**Do NOT change here**: SDK or runtime implementation (that's in miniapp-sdk and miniapp-runtime).

## Public API / Entrypoints

This is an executable mini-app, not a library. No public exports.

## Internal Layout

```
packages/demo-tenant-miniapp/
├── src/
│   └── index.ts          # Demo mini-app implementation
├── package.json
└── tsconfig.json
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter @klynt/demo-tenant-miniapp build` | Build package |
| `pnpm --filter @klynt/demo-tenant-miniapp check-types` | Type check |

## Environment Variables

None.

## Integration Points

**Upstream Dependencies**:
- `@klynt/miniapp-sdk` - SDK APIs
- `@klynt/miniapp-sandbox-runtime` - Sandbox runtime

**Downstream Consumers**:
- None (demo/test package)

## Testing Notes

This package is itself a test fixture for mini-app infrastructure.

## Gotchas / Common Pitfalls

- This is for development/testing only
- Not deployed to production
- Used to validate SDK changes before releasing
