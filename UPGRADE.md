# 🎉 Action Upgraded - No More manifest.json!

## What Changed

The Klynt Deploy Action now reads metadata from **`package.json`** instead of requiring a separate `manifest.json` file.

### Before (Old Way)
```
demo-tenant/
├── src/index.tsx
├── package.json
└── manifest.json     ❌ Extra file, unfamiliar to React devs
```

### After (New Way)
```
demo-tenant/
├── src/index.tsx
└── package.json      ✅ Everything in one place!
```

## How It Works

The action now supports **two options**:

### Option 1: Use Standard package.json Fields

Just use normal package.json fields:
```json
{
  "name": "@klynt/demo-tenant-miniapp",
  "version": "2.0.0",
  "description": "My awesome miniapp",
  "author": "Your Name",
  "license": "MIT"
}
```

The action will automatically:
- Use `name` as the miniapp ID
- Use `version` for versioning
- Extract all other metadata

### Option 2: Add a `klynt` Section (Recommended)

For full control, add a `klynt` section to `package.json`:
```json
{
  "name": "@klynt/demo-tenant-miniapp",
  "version": "2.0.0",
  "description": "Demo miniapp",
  "author": "Klynt Labs",
  "license": "MIT",
  "klynt": {
    "id": "com.klynt.demo-tenant",
    "name": "Hello Tenant Demo",
    "description": "Context-aware miniapp",
    "permissions": [
      "editor:read",
      "editor:onChange"
    ]
  }
}
```

**Priority:** `klynt` section fields **override** standard package.json fields.

## GitHub Action Changes

### Before
```yaml
- uses: KlyntLabs/klynt/packages/miniapp-action@main
  with:
    manifest-path: './manifest.json'  # ❌ Required
    entry-point: './src/index.tsx'
```

### After
```yaml
- uses: KlyntLabs/klynt/packages/miniapp-action@main
  with:
    # manifest-path defaults to ./package.json ✅
    # entry-point defaults to ./src/index.tsx ✅
    api-key: ${{ secrets.KLYNT_API_KEY }}
    tenant-id: ${{ secrets.KLYNT_TENANT_ID }}
```

Even cleaner! The action now has smart defaults.

## Migration Guide

If you have an existing miniapp with `manifest.json`:

1. **Copy metadata to package.json:**
   ```json
   {
     "name": "@scope/miniapp",
     "version": "1.0.0",
     "klynt": {
       "id": "com.your-domain.miniapp",
       "name": "Your Miniapp",
       "description": "..."
     }
   }
   ```

2. **Delete manifest.json:**
   ```bash
   rm manifest.json
   ```

3. **Update workflow (optional):**
   ```yaml
   # Remove these lines - they're now defaults!
   manifest-path: './manifest.json'
   entry-point: './src/index.tsx'
   ```

4. **Done!** Deploy as usual.

## Benefits

✅ **Familiar** - React developers already know package.json
✅ **Less Files** - One less file to maintain
✅ **Type Safe** - npm validates package.json schema
✅ **Version Sync** - Version is already in package.json
✅ **Conventional** - Follows npm ecosystem patterns
✅ **Backwards Compatible** - Still supports manifest.json for legacy projects

## Examples

See the updated [demo-tenant](.) for a working example.

## Questions?

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for full metadata options
- See [QUICKSTART.md](./QUICKSTART.md) for React developer guide
