# Testing the Demo Tenant Deployment

## Setup GitHub Repository Secrets

Go to your repository **Settings → Secrets and variables → Actions** and add:

| Secret Name | Value |
|-------------|-------|
| `KLYNT_API_KEY` | `klynt_user_f4c94bdd1dc5e0e6bc0008ce6b69ca925793a556047af2f8e849db023ea25453` |
| `KLYNT_TENANT_ID` | `55555555-5555-5555-5555-555555555555` |
| `KLYNT_API_URL` | Your API URL (e.g., `https://api.yourdomain.com` or use ngrok for local) |

## Testing with Local API (Using ngrok)

If you want to test with your local development API:

1. **Start ngrok:**
   ```bash
   ngrok http 8080
   ```

   You'll get a URL like: `https://abc123.ngrok.io`

2. **Set GitHub Secret:**
   - `KLYNT_API_URL` = `https://abc123.ngrok.io`

3. **Update CORS in business-api** to allow ngrok domain

## Trigger Deployment

### Option 1: Push to Main
```bash
git add .
git commit -m "test: Trigger deployment"
git push origin main
```

### Option 2: Create a Tag
```bash
git tag v0.0.1
git push origin v0.0.1
```

### Option 3: Manual Workflow Dispatch
1. Go to **Actions** tab
2. Select **Deploy Demo Tenant Miniapp**
3. Click **Run workflow**

## Monitor Deployment

1. **GitHub Actions UI:**
   - Check workflow progress
   - View logs for each step

2. **Expected Output:**
   ```
   🚀 Starting Klynt Miniapp deployment
   ✓ Parsed manifest from package.json: com.klynt.demo-tenant@2.0.0
   Built bundle: X KB
   Bundle SHA-256: sha256:...
   ✓ Deployment successful!
   ```

3. **Verify in Database:**
   ```bash
   docker exec klynt-postgres-dev psql -U klynt_dev -d klynt_dev -c \
     "SELECT manifest_id, status, risk_score, risk_tier
      FROM miniapp_deployments
      WHERE tenant_id = '55555555-5555-5555-5555-555555555555'
      ORDER BY created_at DESC LIMIT 1;"
   ```

4. **Verify in S3:**
   ```bash
   docker exec klynt-minio-dev mc ls -r local/klynt-dev/tenants/55555555-5555-5555-5555-555555555555/miniapps/
   ```

## Expected Results

- ✅ Status: `deployed`
- ✅ Risk Score: 0-10 (Low risk)
- ✅ Risk Tier: 1-2
- ✅ Bundle uploaded to S3
- ✅ Exit code: 0

## Troubleshooting

**401 Unauthorized:**
- Verify API key is correct in GitHub secrets
- Check API key exists in database

**Action not found:**
- Verify you're using `KlyntLabs/action@v0.0.1`
- Check the action is published: https://github.com/KlyntLabs/action

**Cannot reach API:**
- If using ngrok, verify URL is correct
- Check firewall/network settings
- Verify business-api is running

**Manifest parsing failed:**
- Verify `package.json` has valid `name` and `version`
- Check `klynt` section is properly formatted

## Action Configuration

The workflow uses:
```yaml
- uses: KlyntLabs/action@v0.0.1  # Published action
  with:
    api-key: ${{ secrets.KLYNT_API_KEY }}
    tenant-id: ${{ secrets.KLYNT_TENANT_ID }}
    api-url: ${{ secrets.KLYNT_API_URL }}
```

Defaults:
- `manifest`: `./package.json`
- `entry`: `./src/index.tsx`
- `skip-attestation`: `true` (for testing)
