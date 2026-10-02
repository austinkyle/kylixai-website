# KylixAI SEO & Metadata — Current Site Contract

The public site is a static Cloudflare Pages site in `build/src/`. Keep metadata and sitemap URLs on clean paths without `.html` extensions. Do not deploy as part of local content or metadata work unless separately authorized.

## Page titles

- `/`: Business Systems & Process Engineering — KylixAI
- `/services`: Diagnose, Build & Operate — KylixAI
- `/systems-opportunity-audit`: Systems Opportunity Audit — KylixAI
- `/build-and-implementation`: Build & Implementation — KylixAI
- `/systems-management`: Systems Management — KylixAI
- `/about`: Business Understanding Behind the Build — KylixAI
- `/apps`: Business Systems We’ve Built — KylixAI
- `/resources`: Business Systems & AI Resources — KylixAI

The homepage description is: “KylixAI studies how your business works, identifies operational bottlenecks, and builds the right mix of software, AI and human workflows.” Keep descriptions concise and synchronized across standard, Open Graph and Twitter metadata.

## Structured data and routing

Each of the eight pages has one valid Organization JSON-LD block. Do not include unverified Person schema, fixed Offer prices for approximate Build or Management rates, unsupported service guarantees, or FAQPage data that differs from visible FAQ copy.

The static `_redirects` file maps legacy `/services-consulting`, `/services-development` and `/services-automation` routes (including `.html` and trailing-slash variants) to the current Systems Opportunity Audit, Build & Implementation and Systems Management paths. `sitemap.xml` lists only the eight canonical pages. `llms.txt` reflects the same positioning, offers and project evidence boundaries.

## Local checks

- Parse every `application/ld+json` block as JSON.
- Confirm one H1 per page, canonical/OG/Twitter consistency, and eight sitemap entries.
- Check internal links and legacy redirects.
- Confirm local work only; production deployment is a separate release decision.
