# deploy-cloudflare-v1.0.md — Cloudflare Pages Deployment Guide

## Prerequisites

- [ ] Git repository initialized with the project (or push to GitHub/GitLab)
- [ ] Cloudflare account (free at cloudflare.com)
- [ ] kylixai.com domain registered (at any registrar)
- [ ] Site code complete in `build/src/`

---

## Step 1: Push Project to Git

```bash
cd "/path/to/KYLIX AI WEBSITE"
git init
git add -A
git commit -m "Initial commit: KylixAI website v1"
# Push to GitHub: create a new repo at github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/kylixai-website.git
git push -u origin main
```

---

## Step 2: Connect to Cloudflare Pages

1. Log in to dash.cloudflare.com
2. Click **Workers & Pages** -> **Pages** -> **Connect to Git**
3. Authorize Cloudflare to access your GitHub account
4. Select the `kylixai-website` repository
5. Configure build settings:
   - **Framework preset**: None (static site)
   - **Build command**: _(leave blank — no build step)_
   - **Build output directory**: `build/src` (or `/` if index.html is at root)
6. Click **Save and Deploy**
7. Wait for the first deployment — Cloudflare provides a `*.pages.dev` URL to preview

---

## Step 3: Connect kylixai.com Custom Domain

### Option A: Domain registered at Cloudflare (easiest)
1. In Cloudflare Pages -> your project -> **Custom Domains** -> **Set up a custom domain**
2. Enter `kylixai.com` and click Continue
3. Cloudflare auto-adds the DNS record — done

### Option B: Domain at external registrar (GoDaddy, Namecheap, etc.)
1. In Cloudflare Pages -> **Custom Domains** -> **Set up a custom domain** -> enter `kylixai.com`
2. Cloudflare will show you the required DNS record (CNAME pointing to `kylixai-website.pages.dev`)
3. Log in to your domain registrar's DNS settings
4. Add the CNAME record:
   - **Name**: `@` (or `www` for www subdomain)
   - **Value**: `kylixai-website.pages.dev`
5. DNS propagation: 1-24 hours (usually under 10 minutes with Cloudflare nameservers)

### SSL Certificate
- Cloudflare auto-provisions a free SSL certificate within 1-5 minutes of custom domain setup
- No configuration required — HTTPS is automatic

---

## Step 4: Environment Variables (if needed)

1. In Cloudflare Pages -> your project -> **Settings** -> **Environment Variables**
2. Add any variables from `.env.example` that are needed at runtime
   - Note: For a static HTML site, variables are typically only used during build time
   - Web3Forms access key goes DIRECTLY in the HTML (it's a public key by design)

---

## Step 5: Verify Deployment

- [ ] `https://kylixai.com` loads over HTTPS
- [ ] `https://www.kylixai.com` redirects correctly
- [ ] All CSS, JS, and font assets load (no 404s in browser console)
- [ ] GSAP animations play on first load
- [ ] Form submits successfully (see forms guide)
- [ ] Mobile: test at 380px — layout intact, motion smooth

---

## Ongoing Deployments

Every `git push` to the `main` branch triggers an automatic redeployment on Cloudflare Pages.
Zero manual steps after initial setup. Build time for a static site: ~5 seconds.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 on all pages | Check build output directory setting in Cloudflare Pages |
| SSL not provisioning | Wait 5 min; if stuck, check DNS propagation at dnschecker.org |
| Custom domain not working | Verify CNAME record at registrar; flush DNS cache |
| Assets 404 | Check file paths in HTML are relative, not absolute |
