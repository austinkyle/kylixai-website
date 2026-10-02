# KylixAI Website

Business-first static marketing site for KylixAI. The position is simple: understand how the business works, engineer the process, then build and operate the appropriate mix of software, AI and human judgment.

## Site structure

The deployable files are in `build/src/`; the site uses hand-authored HTML, CSS and JavaScript with no framework or build step.

- `/` — business-first homepage
- `/services` — Diagnose, Build & Operate overview
- `/systems-opportunity-audit` — $199 launch-price diagnostic and Kylix Systems Roadmap
- `/build-and-implementation` — business systems implementation; starting around $2,500, scoped by project
- `/systems-management` — operation and improvement; starting around $500/month, scope agreed together
- `/about` — business understanding behind the work
- `/apps` — Our Work: inspectable project repositories and demos
- `/resources` — newsletter and social destinations

Legacy `/services-consulting`, `/services-development`, and `/services-automation` paths permanently redirect through `build/src/_redirects`.

## Local development

No install step is required. Serve the static files over HTTP:

```bash
cd build/src
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A simple Python server does not emulate Cloudflare Pages clean URLs or the `_redirects` file; use the `.html` filenames when checking routes locally.

## Site conventions

- Shared navigation and footer live in `build/src/_partials/`. After editing either partial, run `node build/sync-partials.mjs`.
- `main.css` contains the visual tokens and responsive styles.
- `main.js` handles navigation, motion and Web3Forms submission behavior.
- Each page has its own title, description, canonical/OG/Twitter metadata, and valid Organization JSON-LD. Service pages also describe the service and breadcrumb trail.
- `sitemap.xml` and `llms.txt` must stay synchronized with the eight canonical pages and current offers.

## Verification

There is no project test suite. Useful local checks include `node --check build/src/main.js`, parsing each JSON-LD block as JSON, checking one H1 per page, validating internal links and reviewing `_redirects`. Never submit real inquiries during testing. Production deployment is a separate release action.
