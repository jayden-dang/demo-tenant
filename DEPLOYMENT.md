# Deployment Guide

## Quick Start

1. **Add GitHub Secrets** to your repository:
   - `KLYNT_API_KEY` - Use: `klynt_user_f4c94bdd1dc5e0e6bc0008ce6b69ca925793a556047af2f8e849db023ea25453`
   - `KLYNT_TENANT_ID` - Jayden tenant: `55555555-5555-5555-5555-555555555555`
   - `KLYNT_API_URL` - For testing: `http://localhost:8080` (or production URL)

2. **Deploy:**
   ```bash
   git push origin main
   # or tag a release
   git tag v2.0.1 && git push origin v2.0.1
   ```

3. **Monitor:**
   - Check GitHub Actions tab for workflow status
   - Verify deployment in database:
     ```bash
     docker exec klynt-postgres-dev psql -U klynt_dev -d klynt_dev -c \
       "SELECT manifest_id, status, risk_score FROM miniapp_deployments ORDER BY created_at DESC LIMIT 5;"
     ```

## Miniapp Metadata

The GitHub Action reads miniapp metadata from **`package.json`** - no extra files needed!

### Option 1: Using package.json fields (simplest)

The action will use these standard fields:
```json
{
  "name": "@klynt/demo-tenant-miniapp",
  "version": "2.0.0",
  "description": "Demo miniapp",
  "author": "Klynt Labs",
  "license": "MIT",
  "repository": "...",
  "homepage": "..."
}
```

- **id** will be derived from `name`
- **version** must follow semver (e.g., `2.0.0`)

### Option 2: Custom klynt section (recommended)

For miniapp-specific metadata, add a `klynt` section:
```json
{
  "name": "@klynt/demo-tenant-miniapp",
  "version": "2.0.0",
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

The `klynt` section **overrides** standard package.json fields, giving you full control.

## Workflow

The `.github/workflows/deploy.yml` automatically:

1. Checks out code
2. Installs dependencies
3. Runs the Klynt Deploy Action which:
   - Validates `manifest.json`
   - Bundles `src/index.tsx` with esbuild
   - Runs security scanner
   - Uploads bundle to S3 (if approved)
   - Creates deployment record in database

## Security Tiers

| Tier | Risk Score | Action | Bundle Upload |
|------|------------|--------|---------------|
| 1 | 0 | Auto-approve | ✅ |
| 2 | 1-70 | Auto-approve with warnings | ✅ |
| 3 | 71-95 | Manual review | ❌ |
| 4 | 96-100 | Auto-reject | ❌ |

## Troubleshooting

**401 Unauthorized:**
- Verify `KLYNT_API_KEY` secret is correct
- Check API key exists in database

**Failed to upload bundle:**
- Verify S3/MinIO bucket exists
- Check S3 credentials

**Manifest validation failed:**
- Ensure `package.json` has required fields: `name`, `version`
- Verify `version` follows semver format (e.g., `2.0.0`)
- If using custom `klynt.id`, ensure it uses reverse domain notation
