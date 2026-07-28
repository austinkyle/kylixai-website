# deploy/ — Deployment & Infrastructure Workspace

> **Session Protocol**: Read this context.md, then navigate using the routing table.
> The frontend-design skill is NOT required for deployment tasks.
> Do NOT load design/ or content/ while working in deploy/.

---

## Stack Summary

| Component | Tool | Cost |
|-----------|------|------|
| Hosting | Cloudflare Pages | Free (unlimited bandwidth) |
| Domain | kylixai.com | Existing (bring your own registrar) |
| SSL | Auto-provisioned by Cloudflare | Free |
| Lead capture | Web3Forms free tier | Free (250 submissions/month) |
| Spam protection | hCaptcha | Free |
| Analytics | Cloudflare Pages built-in | Free |

---

## Deploy Pipeline

```
1. PRE-FLIGHT       → Run all quality bar checks from build/context.md
                       Confirm all copy is in final state (content/copy/, not drafts)
                       Confirm design tokens are in build/src/main.css
                       Confirm Web3Forms access key is documented

2. DEPLOY           → Connect Git repo to Cloudflare Pages
                       Set build output directory (root or /build/src/ depending on final structure)
                       Trigger first deployment; verify site loads at *.pages.dev URL

3. DNS              → In Cloudflare dashboard: add kylixai.com as custom domain
                       Update DNS records at registrar (CNAME or A record) per Cloudflare instructions
                       SSL certificate auto-provisions (can take 1-5 minutes)

4. FORMS            → Get Web3Forms access key (free at web3forms.com)
                       Add to form HTML: data-access-key="YOUR_KEY"
                       Add hCaptcha site key
                       Test: submit form -> confirm email arrives in founder's inbox

5. SEO / OG         → Verify Open Graph tags render correctly (use opengraph.xyz to preview)
                       Submit sitemap to Google Search Console
                       Verify robots.txt is accessible

6. MONITOR          → Cloudflare Pages dashboard: check analytics after first real traffic
                       Confirm form submissions arriving in inbox (not spam)
```

---

## Local Routing Table

| Task Type | Files to READ | Files to SKIP | Tools / Skills to Load |
|-----------|--------------|--------------|----------------------|
| First Cloudflare Pages deployment | `cloudflare/deploy-cloudflare-v*.md` (full doc) | All `design/`, all `content/`, all `build/` | None |
| Connect kylixai.com custom domain + DNS | `cloudflare/deploy-cloudflare-v*.md` (DNS section) | All `design/`, all `content/`, all `build/` | None |
| Configure Web3Forms lead capture | `forms/forms-web3forms-v*.md`, `.env.example` (for key name) | All `design/`, all `content/`, all `build/`, `deploy/cloudflare/` | None |
| Write / update SEO meta + Open Graph | `seo/seo-config-v*.md`, `build/src/*.html` (all 8 pages) | All `design/`, all `content/drafts/`, `deploy/cloudflare/`, `deploy/forms/` | None |
| Add/update structured data (schema.org) or `llms.txt` for AEO | `seo/seo-config-v1.1.md` "Structured Data & AEO" section, `build/src/*.html` (all 8 pages), `build/src/llms.txt` | All `design/`, all `content/drafts/`, `deploy/cloudflare/`, `deploy/forms/` | None |
| Run pre-launch quality checklist | `checklist/checklist-prelaunch-v*.md`, `build/context.md` (quality bar) | All `design/`, all `content/drafts/` | None |
| Debug form not delivering submissions | `forms/forms-web3forms-v*.md`, `build/src/index.html` (form HTML) | All `design/`, all `content/`, `deploy/seo/`, `deploy/cloudflare/` | None |
| Update deployment or re-deploy | `cloudflare/deploy-cloudflare-v*.md` | All `design/`, all `content/`, all `build/` | None |
