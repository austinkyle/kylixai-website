# checklist-prelaunch-v1.0.md — Pre-Launch Quality Checklist

Run through every item before publishing to kylixai.com.
No exceptions — this is the full quality bar for v1 launch.

---

## Design & Visual Quality

- [ ] Site does NOT look like a SaaS template or generic AI output
- [ ] Color palette is bold, saturated, and distinctly KylixAI (not generic purple gradients)
- [ ] No Inter, Roboto, Arial, or system fonts anywhere on the page
- [ ] Display font is expressive and memorable; body font is refined and readable
- [ ] Soft-UI / neumorphic shadows applied to CTA and key cards — not everywhere
- [ ] Grain/noise overlay present on at least one background section
- [ ] Gradient mesh or layered radial gradients present — no flat solid-color backgrounds
- [ ] Code-generated decorative elements (blobs, shapes) add visual character

---

## Copywriting & Emotional Impact

- [ ] Tired business owner feels SEEN within 3 seconds
- [ ] Hero headline is 5-8 words, emotionally resonant, zero jargon
- [ ] Copy uses "you" language, not "our clients" language
- [ ] "Free audit — you only pay when it's working" is unmistakably clear
- [ ] No AI terminology anywhere: no "AI-powered", "workflow automation solutions", "ecosystem"
- [ ] All six Hormozi arc sections present and flow naturally

---

## Motion & Interaction

- [ ] Page-load timeline runs on first visit
- [ ] ScrollTrigger scrollytelling unfolds the trapped → discovered → freed arc
- [ ] CTA button hover state is satisfying and tactile (GSAP spring scale)
- [ ] Navigation approach is exploratory — no standard nav bar
- [ ] Motion tested at 380px on mid-range device (or 4x CPU throttle in DevTools)
- [ ] prefers-reduced-motion: all animations skip cleanly; content still visible

---

## Lead Capture

- [ ] Web3Forms form present in CTA section
- [ ] hCaptcha widget renders correctly
- [ ] Test submission received in founder's inbox
- [ ] Success state is friendly and animated
- [ ] Error state provides fallback contact method
- [ ] Calendar/email fallback documented and present

---

## Technical Quality

- [ ] HTML validates — no unclosed tags, proper heading hierarchy
- [ ] All CSS custom properties in :root — no hardcoded hex values in stylesheet
- [ ] GSAP loaded via CDN — no npm bundle
- [ ] All images have alt attributes
- [ ] All form inputs have associated label elements
- [ ] Tab order logical; focus states visible
- [ ] No console errors in browser DevTools
- [ ] No 404 errors for assets (Network tab)
- [ ] Lighthouse: Performance >= 90, Accessibility >= 90

---

## SEO & Metadata

- [ ] title set and meaningful
- [ ] meta description under 160 characters and compelling
- [ ] Open Graph image (1200x630) renders correctly at opengraph.xyz
- [ ] Favicon visible in browser tab
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Canonical URL set

---

## Deployment

- [ ] Site live at https://kylixai.com (not just *.pages.dev)
- [ ] HTTPS/SSL certificate active — no browser security warning
- [ ] www.kylixai.com redirects correctly
- [ ] Site loads under 3 seconds on mobile connection (Lighthouse)
- [ ] Cloudflare Pages auto-deploy from main branch working

---

## Final Human Check

- [ ] Read the full page aloud top to bottom — does it flow?
- [ ] Show the hero section to someone outside tech — do they immediately understand the offer?
- [ ] Would a tired small-business owner, on a phone, feel hopeful?

**If yes to all: launch. If no: fix first.**
