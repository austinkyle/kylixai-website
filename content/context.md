# content/ — Copy Workspace

> **Session Protocol**: Read this context.md, then navigate to the specific copy file using the routing table.
> Do NOT load design/, build/, or deploy/ while writing copy.
> The frontend-design skill is NOT required here — this is pure copywriting.

---

## The Reader

Business leaders who notice repetitive handoffs, missed follow-up, disconnected information, slow reporting, operational bottlenecks or constrained capacity. They need a credible diagnosis grounded in how their business actually works.

## Language rules

- Lead with business understanding; process engineering follows, then technology.
- Use concise plain English and respect the reader’s attention.
- Explain business problems before technology. Recommend software, AI/model support and human review according to the task and cost of error.
- Avoid AI hype, generic consulting language, unverified credentials, invented metrics, ROI, clients, testimonials or guarantees.

## Homepage hierarchy

1. Business-first hero.
2. Differentiation led by business understanding.
3. Observe → Route → Design for Failure → Verify → Measure.
4. Free Fit Call → Systems Opportunity Audit → Build & Implementation → Systems Management.
5. Business outcomes without invented numbers.
6. Concise founder rationale.
7. Inspectable repositories/demos with evidence status made clear.
8. FAQs and free fit-call invitation.

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
