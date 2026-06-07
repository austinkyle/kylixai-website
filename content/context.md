# content/ — Copy Workspace

> **Session Protocol**: Read this context.md, then navigate to the specific copy file using the routing table.
> Do NOT load design/, build/, or deploy/ while writing copy.
> The frontend-design skill is NOT required here — this is pure copywriting.

---

## The Reader

**Who they are**: Small-business owners and founders. Started their business dreaming of freedom.
Instead became a slave to it. Calendar full. Repetitive work endless. Original dream faded.
Successful on paper, trapped in practice. Likely reading on a phone.

**What they need to feel within 3 seconds**: "This page gets me." Then: "Oh — there's a way out."

**Language rules**:
- Simple, human. Speak like a trusted friend who runs a business, not a consultant.
- Never explain AI technology. Explain the freedom.
- Zero jargon: no "workflow automation solutions", no "AI-powered ecosystem".
- Lead with the dream outcome. Follow with the pain. End with the invitation.
- Automation should feel like a natural answer to their pain — not a product being sold.

---

## Hormozi Narrative Arc (copy must follow this structure)

```
1. THE HOOK          → Dream outcome + the quiet pain. Make them feel seen immediately.
                        "What would your business look like if it ran itself?"

2. THE RECOGNITION   → Name specific pains in their language. "That's exactly me."
                        Examples: chasing invoices, re-explaining tasks, scheduling back-and-forth,
                        copy-pasting data, following up manually, doing the same thing for the 100th time.

3. THE REFRAME       → It doesn't have to be this way. The business CAN run without consuming them.
                        Hope enters. Shift from "this is just how it is" to "wait — that's fixable."

4. HOW IT WORKS      → The free audit. Three clear steps:
                        (1) We audit — find exactly what's costing the most time and money.
                        (2) We show you the numbers — exact hours/dollars reclaimed.
                        (3) We build it. You pay nothing until it's working and saving you money.

5. THE PROOF         → Placeholder for testimonials + case studies. For launch:
                        → Founder credibility: 20 years entrepreneurial experience, B2B local businesses.
                        → "Coming soon" that feels intentional, not empty.

6. THE INVITATION    → Warm, low-friction, singular CTA: Book a free audit.
                        Make reaching out feel like their own idea, not a sales pressure.
                        No "limited spots" urgency gimmicks. Just warmth and confidence.
```

---

## Content Pipeline

```
1. AUDIENCE BRIEF    → Re-read the reader description above before writing a single word
2. DRAFT             → Write section by section in drafts/ following the arc above
3. EDIT              → Simplify; remove jargon; read aloud; cut anything that doesn't earn its place
4. FINAL             → Copy approved copy to copy/ with -final- in the filename
```

---

## Local Routing Table

| Task Type | Files to READ | Files to SKIP | Tools / Skills to Load |
|-----------|--------------|--------------|----------------------|
| Write hero section (The Hook) | `drafts/copy-hero-draft-v*.md`, `CLAUDE.md` audience section | All `design/`, `build/`, `deploy/` | None — pure copywriting |
| Write recognition/pain section | `drafts/copy-recognition-draft-v*.md`, `CLAUDE.md` audience section | All `design/`, `build/`, `deploy/` | None |
| Write reframe section | `drafts/copy-reframe-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Write How It Works section | `drafts/copy-howitworks-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Write proof/trust section | `drafts/copy-proof-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Write CTA section | `drafts/copy-cta-draft-v*.md` | All `design/`, `build/`, `deploy/` | None |
| Approve + finalize a section | Read the specific draft only → write to `copy/copy-[section]-final-v*.md` | All other sections, all other workspaces | None |
| Edit all copy for voice consistency | `copy/` (all finals), `drafts/` (all in-progress) | All `design/`, `build/`, `deploy/` | None |
| Audience research / pain-point mining | `research/` (all), `CLAUDE.md` audience section | All `design/`, `build/`, `deploy/` | None |
