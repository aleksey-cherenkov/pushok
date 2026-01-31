# Deployment Guide - Azure Static Web Apps

## Overview

This guide covers deploying Pushok to Azure Static Web Apps with GitHub Actions CI/CD.

---

## Prerequisites

- Azure account (free tier available)
- GitHub repository with code pushed
- Domain: pushok.life (already owned ✓)

---

## Step 1: Create Azure Static Web App ✅ COMPLETED

### Option A: Azure Portal (Recommended for first-time setup) ✅

1. **Navigate to Azure Portal**
   - Go to https://portal.azure.com
   - Sign in with your Azure account

2. **Create Static Web App**
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

3. **Configure Basic Settings**
   - **Subscription**: Choose your subscription
   - **Resource Group**: Create new or use existing (e.g., `rg-pushok`) ✅
   - **Name**: `pushok-app` (or your preferred name) ✅
   - **Plan Type**: `Free` (sufficient for challenge/demo) ✅
   - **Region**: Choose closest to you (e.g., `West US 2`, `East US`) ✅
   - **Deployment Source**: `GitHub` ✅

4. **Authenticate with GitHub**
   - Click "Sign in with GitHub" ✅
   - Authorize Azure Static Web Apps ✅

5. **Configure Build Settings**
   - **Organization**: Your GitHub username ✅
   - **Repository**: `pushok` ✅
   - **Branch**: `main` (or your default branch) ✅
   - **Build Presets**: `Next.js` ✅
   - **App location**: `/` (root) ✅
   - **Api location**: Leave empty (no Azure Functions yet) ✅
   - **Output location**: `.next` (SSR mode - supports API routes) ✅

6. **Review + Create**
   - Review settings ✅
   - Click "Create" ✅
   - Wait for deployment (2-3 minutes) ✅

7. **Get Deployment Token (for manual workflow)**
   - After creation, go to your Static Web App resource
   - Navigate to "Settings" → "Configuration"
   - Copy the "Deployment token" (keep it secure)

### Option B: Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-pushok --location eastus

# Create Static Web App
az staticwebapp create \
  --name pushok-app \
  --resource-group rg-pushok \
  --source https://github.com/YOUR_USERNAME/pushok \
  --branch main \
  --app-location "/" \
  --output-location ".next" \
  --login-with-github
```

---

## Step 2: Verify Next.js Configuration (SSR Mode) ✅

**Current Configuration** - No changes needed for SSR mode:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

**Why SSR Mode?**
- ✅ API routes work (`/app/api/ai/refine-goal`)
- ✅ Azure OpenAI API keys stay secure on server
- ✅ Full Next.js features (Server Components, Image Optimization)
- ✅ Better for AI integration
- ✅ Default Next.js configuration (no changes needed)

---

## Step 3: Create GitHub Actions Workflow

Azure automatically creates a workflow file, but you can customize it.

**File**: `.github/workflows/azure-static-web-apps-deploy.yml`

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations ######
          app_location: "/" # App source code path
          api_location: "" # Api source code path - optional
          output_location: ".next" # SSR mode - supports API routes
          ###### End of Repository/Build Configurations ######
          
      - name: Build output
        run: echo "Deployment URL -> ${{ steps.builddeploy.outputs.static_web_app_url }}"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

---

## Step 3: GitHub Actions Workflow ✅ AUTO-CREATED

**Azure automatically created the workflow file when you set up the Static Web App!**

The workflow file is located at: `.github/workflows/azure-static-web-apps-<random-id>.yml`

**What it does:**
- Triggers on push to `main` branch
- Builds your Next.js app
- Deploys to Azure Static Web Apps
- Creates preview environments for pull requests

**No manual action needed** - Azure already configured this for you.

---

## Step 4: Configure Environment Variables

### Section 1-2: Deployment Token ✅ AUTO-CONFIGURED

**Azure automatically added the deployment token to GitHub Secrets!**

The secret `AZURE_STATIC_WEB_APPS_API_TOKEN` was created automatically when you connected GitHub.

**No manual action needed** - Azure handled this for you.

---

### Section 3: Add Azure OpenAI Environment Variables ✅ COMPLETED

**Option A: Server-Side (Recommended - Most Secure)** ✅

Environment variables configured in Azure Portal for secure server-side access.

**Add variables in Azure Portal:**

1. **Navigate to Azure Static Web App**
   - Go to https://portal.azure.com
   - Open your `pushok-app` resource
   - Click "Settings" → "Environment variables" in left menu

2. **Add Environment Variables**
   
   Click "+ Add" button and add each of these:

   **Setting 1 - Endpoint:**
   - **Name**: `AZURE_OPENAI_ENDPOINT`
   - **Value**: `https://<your-openai-resource>.openai.azure.com/`
     - Find this in your Azure OpenAI resource → "Keys and Endpoint" → "Endpoint"
     - Example: `https://my-openai-eastus.openai.azure.com/`
   - Click "OK"

   **Setting 2 - API Key:**
   - **Name**: `AZURE_OPENAI_API_KEY`
   - **Value**: Your Azure OpenAI API key
     - Find this in your Azure OpenAI resource → "Keys and Endpoint" → "KEY 1"
     - Example: `1234567890abcdef1234567890abcdef`
   - Click "OK"

   **Setting 3 - Deployment Name:**
   - **Name**: `AZURE_OPENAI_DEPLOYMENT`
   - **Value**: `gpt-5-nano` (or your deployment name)
     - Find this in your Azure OpenAI resource → "Deployments"
     - Use the exact deployment name you created
     - Common names: `gpt-5-nano`, `gpt-4.1-nano`, `gpt-4o-mini`
   - Click "OK"

3. **Save Configuration**
   - Click "Save" at the top of the Environment variables page
   - Click "Continue" to confirm restart
   - Wait ~30 seconds for changes to apply

4. **Verify Settings**
   - Settings should now appear in the environment variables list
   - Click the eye icon to verify values (be careful not to share your API key!)

#### Option B: GitHub Secrets (Alternative - For Build-Time Access)

If you need environment variables during the build process:

1. **Go to GitHub Repository Settings**
   - Navigate to `https://github.com/<your-username>/pushok/settings/secrets/actions`
   - Or: Repository → Settings → Secrets and variables → Actions

2. **Add New Secrets**
   
   Click "New repository secret" for each:
   
   - **Name**: `AZURE_OPENAI_ENDPOINT`
     - **Value**: `https://<your-openai-resource>.openai.azure.com/`
   
   - **Name**: `AZURE_OPENAI_API_KEY`
     - **Value**: Your API key
   
   - **Name**: `AZURE_OPENAI_DEPLOYMENT`
     - **Value**: `gpt-5-nano`

3. **Update GitHub Actions Workflow** (if using this option)
   
   Edit `.github/workflows/azure-static-web-apps-*.yml` and add env vars:
   
   ```yaml
   - name: Build And Deploy
     id: builddeploy
     uses: Azure/static-web-apps-deploy@v1
     with:
       azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
       repo_token: ${{ secrets.GITHUB_TOKEN }}
       action: "upload"
       app_location: "/"
       api_location: ""
       output_location: ".next"
     env:
       AZURE_OPENAI_ENDPOINT: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
       AZURE_OPENAI_API_KEY: ${{ secrets.AZURE_OPENAI_API_KEY }}
       AZURE_OPENAI_DEPLOYMENT: ${{ secrets.AZURE_OPENAI_DEPLOYMENT }}
   ```

#### How to Get Azure OpenAI Credentials

**If you don't have an Azure OpenAI resource yet:**

1. **Create Azure OpenAI Resource**
   - Go to Azure Portal → Create a resource
   - Search for "Azure OpenAI"
   - Click "Create"
   
   **Basics tab:**
   - Subscription: Your subscription
   - Resource group: `rg-pushok` (same as Static Web App)
   - Region: Choose available region (e.g., East US, West Europe)
   - Name: `pushok-openai` (or your choice)
   - Pricing tier: Standard S0
   
   **Network tab:**
   - **For this project, select: "All networks" (Public access enabled)**
   
   **Why "All networks"?**
   - ✅ Simple setup - works immediately
   - ✅ Azure Static Web Apps can access directly
   - ✅ Perfect for demo/challenge project
   - ✅ No complex firewall/VNet configuration needed
   
   **Other options (not recommended for this project):**
   - ❌ "Selected networks" - Requires configuring Static Web App outbound IPs (complex, IPs can change)
   - ❌ "Disabled" - Requires Private Endpoint setup (expensive, overkill for demo)
   
   **Security Note:** API keys still protect access. Only those with your key can use the resource, even with public network access.
   
   Click "Next" through remaining tabs (defaults are fine)
   - Click "Review + create" → "Create"
   - Wait 2-3 minutes for deployment

2. **Deploy a Model**
   - Go to your Azure OpenAI resource
   - Click "Go to Foundry portal" (or "Go to Azure OpenAI Studio")
   - In the portal, navigate to "Deployments" in the left menu
   - Click "Create new deployment" or "+ Create deployment"
   - **Model selection:**
     - Select model family: `gpt-5`
     - Select model version: `gpt-5-nano` (recommended - lowest cost with caching!)
   - **Deployment details:**
     - Deployment name: `gpt-5-nano`
     - Deployment type: Standard (default)
   - Click "Create" or "Deploy"
   - Wait for deployment to complete (~1 minute)

3. **Get Keys and Endpoint**
   - In Azure Portal, go to your OpenAI resource
   - Click "Keys and Endpoint" in left menu
   - Copy "KEY 1" and "Endpoint"

**Security Best Practice:**
- ✅ **Use Azure Portal Configuration (Option A)** - Keys never exposed to browser
- ⚠️ Avoid GitHub Secrets if possible - only for build-time needs
- ❌ Never commit API keys to git or use `NEXT_PUBLIC_` prefix for secrets

---

## Step 5: Configure Custom Domain (pushok.life) ✅ COMPLETED

Custom domain `pushok.life` successfully added to Azure Static Web App and validated via Cloudflare DNS.

**Configuration Summary:**
- Domain added in Azure Portal
- DNS records configured at Cloudflare
- TXT validation record verified
- CNAME/A records pointing to Azure Static Web Apps

**SSL Certificate:**
- Azure will automatically provision a free SSL certificate
- May take 5-30 minutes to complete
- Site will be accessible at https://pushok.life once complete

---

## Step 6: Test Deployment ✅ SUCCESS

Deployment tested and verified working!

**Results:**
- ✅ GitHub Actions workflow completed successfully
- ✅ Code built and deployed to Azure Static Web Apps
- ✅ Site accessible at https://pushok.life
- ✅ SSL certificate active
- ✅ SSR mode working (Next.js running in production)

**First Deployment:** 2026-01-31

**Known Issue (Harmless):**
- "Post Run actions/checkout@v3" error - This is a cosmetic cleanup error that doesn't affect deployment

---

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Configure Azure deployment"
   git push origin main
   ```

2. **Monitor GitHub Actions**
   - Go to repository → "Actions" tab
   - Watch the workflow run
   - Check for errors

3. **Verify Deployment**
   - Visit your Azure URL: `https://<your-app>.azurestaticapps.net`
   - Once DNS is configured: `https://pushok.life`
   - Test all features work

4. **Check Build Logs**
   - In GitHub Actions, click on the workflow run
   - Expand "Build And Deploy" step
   - Check for warnings or errors

---

## Step 7: Set Up Build Configuration (Optional)

Create `staticwebapp.config.json` for advanced configuration:

```json
{
  "routes": [
    {
      "route": "/*",
      "rewrite": "/index.html"
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html"
    }
  },
  "globalHeaders": {
    "content-security-policy": "default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'"
  },
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

---

## Deployment Checklist

### Azure Setup
- [x] Azure account created
- [x] Static Web App resource created (pushok-app)
- [x] Resource Group created (rg-pushok)
- [x] Deployment token saved
- [ ] Environment variables configured (if needed)

### GitHub Setup
- [ ] Repository exists and is public
- [ ] Code pushed to main branch
- [ ] Workflow file created (`.github/workflows/azure-static-web-apps-deploy.yml`)
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` secret added
- [ ] AI API secrets added (if using)

### Next.js Configuration
- [x] Deployment mode selected: SSR (`.next` output)
- [x] `next.config.ts` verified (no changes needed)
- [ ] Test build locally: `npm run build`
- [ ] Verify production build works

### Domain Configuration
- [x] Custom domain added in Azure Portal
- [x] DNS records configured at Cloudflare
- [x] TXT validation record verified
- [x] SSL certificate provisioned ✅
- [x] Domain accessible via HTTPS at https://pushok.life ✅

---

## Deployment Success Summary 🎉

**Status:** Successfully deployed and accessible!

**Live URLs:**
- 🌐 **Production**: https://pushok.life
- 🔧 **Azure**: [your-app].azurestaticapps.net

**What's Working:**
- ✅ Next.js 16 SSR mode
- ✅ Custom domain with SSL
- ✅ GitHub Actions CI/CD
- ✅ Azure OpenAI GPT-5-nano configured
- ✅ Environment variables set
- ✅ Auto-deployment on every push

**First Deployment:** 2026-01-31 🎊

**Ready for Phase 2:** Event Store Implementation

### Testing
- [ ] GitHub Actions workflow runs successfully
- [ ] Site loads at Azure URL
- [ ] Site loads at custom domain (if configured)
- [ ] All features work in production
- [ ] No console errors
- [ ] Lighthouse audit passed (>90)

---

## Troubleshooting

### Build Fails in GitHub Actions

**Check:**
- Node version compatibility (Azure uses Node 18+ by default)
- All dependencies in `package.json`
- Build command succeeds locally
- Output directory is correct

**Fix:**
- Add `engines` field to `package.json`:
  ```json
  "engines": {
    "node": ">=18.0.0"
  }
  ```

### 404 Errors After Deployment

**Issue**: Client-side routing not working

**Fix**: With SSR mode (`.next`), this should work automatically. If issues persist, add `staticwebapp.config.json` with navigation fallback (see Step 8)

### Environment Variables Not Working

**Check:**
- Variables added in Azure Portal under Configuration
- Variables named correctly (no typos)
- Rebuild/redeploy after adding variables

**Fix**: Remember Next.js public variables need `NEXT_PUBLIC_` prefix for client-side access

### Custom Domain Not Working

**Check:**
- DNS records configured correctly
- DNS propagation complete (use https://dnschecker.org)
- TXT validation record present
- CNAME points to correct Azure URL

**Fix**: Wait up to 48 hours for DNS propagation, or contact domain registrar

### API Routes Not Working

**Issue**: API routes not responding (should not occur with SSR mode)

**Solution:**
- Verify `output_location: ".next"` in GitHub Actions workflow
- Check Azure Static Web Apps adapter is working
- Ensure API routes are in `app/api/` directory
- Check function logs in Azure Portal

---

## Cost Estimate

**Azure Static Web Apps:**
- Free tier: $0/month
  - 100 GB bandwidth
  - 0.5 GB storage
  - Custom domains + SSL
  - Perfect for demo/challenge

**Azure OpenAI:**
- GPT-5-nano: ~$0.05 per 1M input tokens, ~$0.40 per 1M output tokens
- Cached input: ~$0.01 per 1M tokens (90% discount for repeated prompts!)
- Estimated: $1-5/month for moderate usage

**Total**: $1-5/month for challenge period

---

## Next Steps After Deployment

1. **Monitor Usage**
   - Check Azure Portal for bandwidth/storage
   - Monitor GitHub Actions minutes
   - Track OpenAI API costs

2. **Performance Optimization**
   - Run Lighthouse audit
   - Optimize images (use Next.js Image component if not static export)
   - Enable caching headers

3. **Demo Preparation**
   - Create demo data generator
   - Record demo video
   - Document GitHub Copilot CLI usage

4. **Post-Challenge**
   - Consider upgrading to Standard tier if needed
   - Set up staging environment
   - Implement monitoring/analytics

---

**Last Updated**: 2026-01-30
