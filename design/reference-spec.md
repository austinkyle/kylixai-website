# KylixAI Reference Spec — Illustrated World Design Grammar

> **Every future session reads this before touching design or markup.**
> It supersedes any v1 design decisions documented elsewhere.
> Load this file immediately after CLAUDE.md. Do not begin design or build
> work without reading it in full.

---

## Reference

Source aesthetic: ensemblelapalatine.com (Summerthyme studio)
Directive: Adopt the design GRAMMAR — not the content, not the baroque theme.
Translate the grammar into KylixAI's subject matter and audience.

---

## The 5 Grammar Rules

### 1. ILLUSTRATED WORLD

The page is a single illustrated environment. Decorative hand-drawn-style
objects float between and behind content. Content lives INSIDE the world,
not in cards placed on top of it.

There is no "background layer" and "component foreground" — there is one
continuous space. Sections flow into each other without dividing lines,
rule-based spacing, or section backgrounds that differ from the ground.
The only visual separation between sections comes from typography scale
changes and the placement of illustration objects.

What this rules out: cards with shadow surfaces, section backgrounds that
toggle between white and light-gray, any container that makes content feel
"boxed in."

### 2. ORGANIC COMPOSITION

Elements overlap, rotate 1–4°, sit off-grid. No uniform card grids. No
symmetric section stacks. Everything feels placed by a person, not a layout
engine.

Specifics:
- Illustration objects are positioned absolutely with specific `top`, `left`,
  `right`, `bottom` values — NOT centered, NOT aligned to a grid column
- Section headings may carry a 1° rotation
- The stat callout in Reframe floats slightly outside the text column
- The How It Works steps stagger diagonally: left, right, left
- Step blocks overlap by ~20px vertically
- Pain list items are typographic, not cards — the only decoration is a
  wobbly SVG divider line between items

What this rules out: CSS Grid or Flexbox used to create symmetric layouts,
`justify-content: center` applied to illustration wrappers, equal margins
between all decoration elements.

### 3. MOTION VOCABULARY

All motion is gated behind `prefers-reduced-motion: reduce`. When reduced
motion is detected: all elements are visible, static, no transitions.
No exceptions.

Active motion types (in priority order for implementation):

1. **Hero Tidying Effect** — the page's signature motion.
   Chaos objects (alarm clock, invoice, phone cord, coffee cup, sticky note)
   drift AWAY from the headline content as the user scrolls into the hero.
   By the time the user reaches the Recognition section, the hero is cleared.
   Visual metaphor: the chaos was present when you arrived. It moved out of
   your way as you read. The value prop is encoded in the motion itself.
   See parallax section for exact GSAP vectors.

2. **Multi-speed scroll parallax** — the paper-diorama effect.
   Three layers (back/mid/front) scroll at different speeds, creating
   perceived depth. Back objects feel distant; front objects feel close.
   Maximum total travel: ~120px per viewport. Subtle, not theme-park.

3. **Page-load orchestration** — Playfair Display headline lines reveal
   via SplitText (line stagger, 0.05–0.1s between lines), then illustration
   objects fade/drift in with 0.05–0.1s staggers.

4. **Infinite marquee** — the AUTOMATE band scrolls left continuously.
   CSS `transform: translateX` animation. Duplicated content in markup for
   seamless loop. Pause on hover.

5. **Ambient float loops** — illustration objects get slow randomized
   y/rotation loops: `gsap.to` with `repeat: -1`, `yoyo: true`,
   randomized duration 4–8s, ±6px / ±2°.

6. **Scroll-reveal on recognition list** — each pain point line settles
   in with a tiny stagger as the section enters viewport.

7. **Quote mark reveal** — theatrical quote marks scale in with slight
   overshoot when proof section enters viewport.

8. **CTA hover** — the scribble-circle SVG draws itself around the CTA
   button text on hover (stroke-dashoffset animation).

### 4. THEATRICAL QUOTES

The founder quote and any testimonials are framed by oversized illustrated
open/close quote marks. NOT testimonial cards. NOT quote blocks with a
colored left border. NOT quote text in italics inside a surface.

Quote mark specifications:
- Open-quote: Playfair Display 900, ~7rem (fixed px, not token), `--color-accent-1`
  (orange), rotated -6°, positioned top-left of blockquote, bleeds slightly
  LEFT of the text column
- Close-quote: Playfair Display 900, ~7rem, `--color-accent-2` (field green),
  rotated +6°, positioned bottom-right of blockquote, bleeds slightly RIGHT
  of the text column
- Implementation: CSS `::before` / `::after` pseudo-elements or absolutely
  positioned `<span>` elements with `aria-hidden="true"`
- No card background behind the quote. The quote floats on the parchment ground.
  The marks ARE the frame.

Color meaning: open-quote in orange (the problem, urgency, being trapped) /
close-quote in green (the resolution, freedom, the outside). The two accent
colors bookend the story in a single visual moment.

### 5. MINIMAL NAV

Two corner text links only: wordmark (top-left) and "Book free audit ↗"
(top-right). No nav bar chrome. No horizontal rule under the nav. No
background color on the nav. No sticky bar on desktop.

On mobile only: "Book free audit" link remains persistent as a small fixed
corner element at bottom-right. This is the one deliberate departure from
the reference site's full nav minimalism. Justification: the reference site
converts on wandering; KylixAI sells to tired owners reading on phones who
need a persistent exit to action. Keep the corner link, do not build a full
mobile CTA bar.

---

## Kylix Illustration Object Set

All objects are hand-drawn-style SVG sprites in `build/src/illustrations.svg`.
Pattern: `<symbol id="illus-[name]" viewBox="0 0 100 100">` per object.
Usage: `<use href="#illus-alarm-clock" width="80" height="80" aria-hidden="true">`.

### Style Constraints (enforced across ALL objects)

These constraints exist so every object reads as drawn by the same hand.
Deviation from any constraint breaks the consistency of the illustrated world.

1. **Stroke weight**: 2.5px on the 100×100 artboard. Scales proportionally.
   Do not use 1px strokes or 4px strokes. 2.5px is the single line weight.

2. **Wobbly paths**: Paths must have slightly irregular nodes. Add ~1–2% jitter
   to key anchor points. Curves should not be perfect bezier arcs. The goal is
   "drawn by a slightly unsteady hand," not shaky or broken.

3. **2-color fills maximum** per object. Colors must come from this set only:
   - `--color-ink-muted` (#6B5540) — dark warm brown for strokes and primary fills
   - `--color-ground-deep` (#E8DEC5) — light fill areas (paper, surfaces)
   - `--color-accent-1` (#FF4F1F) — orange accent detail (used sparingly: max 1 element per object)
   - `--color-accent-2` (#5C8C4E) — green accent detail (used sparingly: max 1 element per object)

4. **No gradients inside objects.** Flat fills + line work only.

5. **Must read at 40px AND 200px.** Test both. If detail is lost at 40px or
   looks too sparse at 200px, the paths need rework.

6. **NOT geometric/flat-design icons.** If an object could appear in the Noun
   Project or in a Figma icon set, it is wrong. The lines must be imperfect.

### Approved Object Set

| ID | Object | Narrative meaning | Default layer | First appears |
|---|---|---|---|---|
| alarm-clock | Alarm clock | Trapped by schedule, time owned by business | BACK | Hero |
| invoice-sheet | Crumpled/flying invoice | Chasing invoices, admin grind | MID | Hero |
| coffee-cup | Coffee cup with steam | Working too early/late, grind | FRONT | Hero |
| phone-cord | Tangled phone cord | Tethered, can't leave the office | BACK | Hero |
| sticky-note | Sticky note with scrawl | Endless to-do list | MID | Recognition |
| calendar-page | Torn calendar page | No days off, Sunday work | BACK | Recognition |
| gear | Single gear, rough | The machine that keeps breaking | FRONT | Recognition |
| envelope | Sealed envelope | Communication, leads going cold | MID | Reframe |
| dog-leash | Dog leash — tangled in Hero, straight in CTA | The Saturday walk, freedom, outside | MID | CTA (Hero too) |
| checkmark-stamp | Rubber stamp with checkmark | Resolution, system approved, done | MID | How It Works |

### Narrative Bookend: Dog Leash

The dog leash appears twice with different states:
- In Hero: tangled/kinked (the trapped state)
- In CTA section: straight/free (the resolved state)

This is the site's narrative bookend. The user's scroll from hero to CTA is
a journey from tangled leash to free leash. Do not use the same SVG path in
both locations — create two symbol variants: `illus-dog-leash-tangled` and
`illus-dog-leash-free`.

### Shared Sprite File Structure

```html
<!-- build/src/illustrations.svg — loaded once in <body>, hidden -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="illus-alarm-clock" viewBox="0 0 100 100">
    <!-- paths here -->
  </symbol>
  <symbol id="illus-invoice-sheet" viewBox="0 0 100 100">
    <!-- paths here -->
  </symbol>
  <!-- ... all objects ... -->

  <!-- UI elements (not illustration objects) -->
  <symbol id="ui-quote-open" viewBox="0 0 60 80">
    <!-- oversized open-quote mark -->
  </symbol>
  <symbol id="ui-quote-close" viewBox="0 0 60 80">
    <!-- oversized close-quote mark -->
  </symbol>
  <symbol id="ui-arrow-hand" viewBox="0 0 40 30">
    <!-- hand-drawn arrow for carousels -->
  </symbol>
  <symbol id="ui-scribble-circle" viewBox="0 0 120 50">
    <!-- wobbly closed loop, used on CTA hover -->
  </symbol>
  <symbol id="ui-wobbly-line" viewBox="0 0 400 8">
    <!-- organic divider line for recognition list -->
  </symbol>
  <symbol id="ui-hand-frame" viewBox="0 0 300 200">
    <!-- rough rectangle border for step blocks, stat callout -->
  </symbol>
</svg>
```

### Test File

Build a test page at `build/src/illustration-test.html` rendering every symbol
at three sizes (40px, 100px, 200px) on `--color-ground` background. Audit the
set before integrating into index.html. Reject any object that reads as a
flat/geometric icon rather than a hand-drawn illustration.

---

## Parallax Layer System

Three CSS classes assigned to absolutely-positioned illustration wrappers:

```css
.layer-back  { --parallax-speed: 0.3; }   /* travels 30% as fast as scroll */
.layer-mid   { --parallax-speed: 0.65; }  /* travels 65% as fast as scroll */
.layer-front { --parallax-speed: 0.9; }   /* nearly locked to scroll */
```

GSAP ScrollTrigger reads `--parallax-speed` (or `data-speed` attribute) and
drives `translateY` transforms. No `top`/`margin` changes — transforms only.
Background (slow) reads as distant. Front (fast) reads as near viewer.
This is the diorama depth illusion.

### Hero Chaos-Dispersal Vectors

These override standard parallax for hero illustration objects. Instead of
vertical-only parallax, objects drift outward on X and Y as the user enters
and scrolls through the hero.

```js
// GSAP ScrollTrigger — scrub: 1.2 for smooth, slightly lagged response
// trigger: hero section, start: "top top", end: "bottom top"

gsap.to('#hero-alarm-clock', {
  x: -90, y: -120, rotation: -22,
  scrollTrigger: { trigger: '.hero', scrub: 1.2, start: 'top top', end: 'bottom top' }
});

gsap.to('#hero-invoice', {
  x: 140, y: -80, rotation: 28,
  scrollTrigger: { trigger: '.hero', scrub: 1.2, start: 'top top', end: 'bottom top' }
});

gsap.to('#hero-phone-cord', {
  x: -120, y: 60,
  scrollTrigger: { trigger: '.hero', scrub: 1.2, start: 'top top', end: 'bottom top' }
});

gsap.to('#hero-coffee-cup', {
  x: 80, y: 100, rotation: -14,
  scrollTrigger: { trigger: '.hero', scrub: 1.2, start: 'top top', end: 'bottom top' }
});

gsap.to('#hero-sticky-note', {
  x: 100, autoAlpha: 0,
  scrollTrigger: { trigger: '.hero', scrub: 1.2, start: 'top top', end: 'bottom top' }
});
```

---

## ASCII Wireframes — All 6 Sections

Object placement notation:
- `[BACK]` / `[MID]` / `[FRONT]` = parallax layer
- `ROT+N°` / `ROT-N°` = CSS rotation from baseline
- Position descriptions are relative to the section container

---

### SECTION 1: HERO

```
  KylixAI                                  Book free audit ↗
  (corner, top-left)                       (corner, top-right)

        [BACK: alarm-clock, ROT-8°]
        ← exits upper-left as scroll happens

                                      [MID: invoice-sheet, ROT+12°]
                                      overlaps headline corner → exits upper-right

  ┌──────────────────────────────────────────────────────────────┐
  │  ▓▓ Free audit — zero risk ▓▓   [stamp, ROT-2°, shadow-stamp]│
  └──────────────────────────────────────────────────────────────┘

  Your business should
  run without you.
  (Playfair Display 900, --text-hero, --color-ink, --leading-tight)

  You built something real. But somewhere along the way,
  it started running you. The admin, the follow-ups, the
  tasks you've done a hundred times — it doesn't have to
  be this way.
  (Lora 400, --text-lg, --color-ink-muted, --leading-relaxed)

  ┌──────────────────────────────────────────────┐
  │    Book my free audit                        │
  │    (--color-accent-1 bg, Playfair 900)       │
  └──────────────────────────────────────────────┘

  No cost until it's working. No obligation, ever.
  (Lora 400, --text-xs, --color-ink-ghost)

  [BACK: phone-cord, ROT+5°]          [FRONT: coffee-cup, ROT-4°]
  lower-left, exits left              lower-right, exits right

  [MID: sticky-note, ROT-15°, 70% opacity]
  mid-right, fades as scroll approaches bottom of hero
```

**SIGNATURE MOMENT:** The alarm clock. Upper-left, first caught by peripheral
vision. Drifts off-screen upper-left as user scrolls. Anxiety visually leaves.
The value prop is encoded in the motion without a word.

---

### SECTION 2: RECOGNITION

```
  [BACK: calendar-page, ROT+6°]
  upper-right, bleeds off edge, drifts slowly

  Sound familiar?
  (Playfair Display 700, ROT-1° on h2 only)

  [MID: envelope, ROT-3°]
  floats LEFT of heading, slightly behind heading z-index

  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
  You've explained the same task to three different people this month.
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
  Chasing invoices is a part-time job you never signed up for.
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
  You spent your Sunday updating spreadsheets instead of resting.
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌       [FRONT: gear]
  New leads go cold because follow-up slipped through the cracks.          [ROT+18°]
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌       [right margin]
  You can't take a real day off — the moment you do, something breaks.     [intrudes]
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
  You started this business for freedom.
  You're now working harder than anyone on your team.
  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌

  [BACK: dog-leash-tangled, ROT-8°]   ← this is the TANGLED variant
  lower-left, partially visible

  This isn't bad luck. It's just how every business grows —
  until someone steps in to fix the system.
  (Lora italic 400, --color-ink-muted, max-width: 580px, ROT-1°)
```

Items 1–6 are a typographic list, NOT cards. The wobbly-line SVG (`ui-wobbly-line`)
is used as a divider between items — not CSS border or `<hr>`. The gear intrudes
from the right margin between items 3–4, rotated heavily. It reads as the machine
that keeps breaking, not as decoration.

---

### SECTION 3: REFRAME

```
  [MID: invoice-sheet, ROT-10°]
  upper-left, partially behind h2, z-index below heading

  What if your business
  actually ran itself?
  (Playfair Display 700, --text-4xl)

  Not some distant future — the version you had in mind when you started.
  Where you make the decisions that matter, and everything else just
  happens. The follow-ups, the scheduling, the data entry, the reminders.
  Handled. Without you lifting a finger.
  (Lora 400, --text-lg, --color-ink-muted, max-width: 680px)

  The repetitive work in your business isn't unique to you.
  It's a sequence of steps that never changes — and patterns can be
  automated. Most business owners are losing 10 to 20 hours a week to
  tasks that a well-built system would handle overnight.

                    ┌────────────────────────────────────┐
                    │  10–20 hrs                         │ [ROT-2°]
                    │  lost every week                   │
                    │  to tasks a system handles         │
                    │  [Playfair 900, --color-accent-2,  │
                    │   --color-ground-deep bg,          │
                    │   ui-hand-frame border,            │
                    │   --shadow-stamp]                  │
                    └────────────────────────────────────┘
                    Floats right of text column, slightly outside.
                    Position: absolute, right: -40px from column edge.

  We make it straightforward to find out exactly what that's worth
  to your business.
  (Lora 400, --text-xl, --color-ink-dark, slightly bolder transition line)

  [BACK: coffee-cup, ROT+4°, opacity: 0.6]
  lower-right, ambient presence, barely visible
```

Stat callout: this is a pinned-to-corkboard element. It must NOT look like
a CSS card. The hand-drawn frame border (`ui-hand-frame`), slight rotation,
and ink-stamp shadow are all required to achieve this.

---

### MARQUEE BAND (single instance)

Position: between Reframe section and How It Works section.

```
╔══════════════════════════════════════════════════════════════════════════╗
║  ← AUTOMATE: INVOICE REMINDERS · SCHEDULING · LEAD FOLLOW-UP ·          ║
║     APPOINTMENT BOOKING · TEAM ALERTS · DATA ENTRY · INVOICE REMINDERS  ║
╚══════════════════════════════════════════════════════════════════════════╝
```

Specifications:
- Full viewport width, overflow hidden
- Height: 44px
- Background: `--color-ground-deep` (#E8DEC5)
- Text: Playfair Display 700, ALL-CAPS, `--text-sm`, `letter-spacing: 0.12em`
- Text color: `--color-ink-muted`
- Animation: CSS `transform: translateX` only (no JS), infinite loop
- Markup: content duplicated twice in DOM for seamless loop
- `animation-play-state: paused` on `:hover`

This is a SINGLE instance. Do not repeat the marquee band elsewhere.
Rationale: placed here at the exact moment in the arc where the reader wants
to know "what exactly gets automated?" One instance = revelation.
Two instances = decoration.

---

### SECTION 4: HOW IT WORKS

```
  [BACK: sticky-note, ROT-5°]        [BACK: sticky-note, ROT+9°]
  upper-left of section              upper-right of section

  How it works
  (Playfair Display 700, --text-3xl)

  You pay nothing until it's working and saving you money.
  (Lora italic 400, --color-accent-1 orange — the guarantee must be
   unmissable; orange on parchment at this size passes AA)


  Step 1 — left-aligned
  ┌────────────────────────────────────────────────────────┐
  │  ① [ui-hand-circle, stroke: --color-accent-2 green]    │  [ROT-1°]
  │                                                        │
  │  We find the waste.                                    │
  │  (Playfair Display 700, --text-xl)                     │
  │                                                        │
  │  We spend time with you to map exactly where the       │
  │  hours are going — yours and your team's. No charge.   │
  │  No obligation. Just a clear picture.                  │
  │  (Lora 400, --text-base, --color-ink-muted)            │
  │                                                        │
  │  [ui-hand-frame border, --color-ground-deep bg]        │
  └────────────────────────────────────────────────────────┘

              Step 2 — offset right ~60px, lower than Step 1
              ┌──────────────────────────────────────────────┐
              │  ② [ui-hand-circle, stroke: --color-accent-1]│  [ROT+2°]
              │                                              │
              │  We show you the numbers.                    │
              │  (Playfair Display 700, --text-xl)           │
              │                                              │
              │  You see exactly what these inefficiencies   │
              │  cost — in hours per week and dollars per    │
              │  year. Most owners are surprised.            │
              │  (Lora 400, --text-base, --color-ink-muted)  │
              │                                              │
              │  [ui-hand-frame border]                      │
              └──────────────────────────────────────────────┘

              [MID: checkmark-stamp, ROT+8°]
              overlaps the Step 2 / Step 3 boundary, right margin

  Step 3 — back to left, lower than Step 2
  ┌────────────────────────────────────────────────────────┐
  │  ③ [ui-hand-circle, stroke: --color-accent-2 green]    │  [ROT-2°]
  │                                                        │
  │  We build it. You approve it.                          │
  │  (Playfair Display 700, --text-xl)                     │
  │                                                        │
  │  If you want to move forward, we build the system.     │
  │  You only pay when it's live, working, and             │
  │  demonstrably saving you time and money.               │
  │  (Lora 400, --text-base, --color-ink-muted)            │
  │                                                        │
  │  [ui-hand-frame border]                                │
  └────────────────────────────────────────────────────────┘

  If we can't find real savings, we'll tell you that too.
  (Lora italic 400, --text-sm, --color-ink-ghost, text-align: right)
```

Step blocks overlap by ~20px vertically (negative margin-top or absolute
offset). No connecting arrows between steps. The diagonal stagger (left/
right/left) communicates sequence without a numbered timeline component.

Step number circles: SVG `<circle>` with slightly imperfect stroke
(3px, slightly irregular opacity, path not perfectly closed). NOT CSS
`border-radius: 50%`. The circles feel stamped, not designed.

Step number color alternation: odd steps (01, 03) use accent-2 green;
even step (02) uses accent-1 orange.

---

### SECTION 5: PROOF

```
  Why trust us?
  (Playfair Display 700, --text-3xl)


  [ui-quote-open: --color-accent-1 orange, ~7rem, ROT-6°]
  Positioned top-left of blockquote. Bleeds ~30px LEFT of text column.
  aria-hidden="true"

       I've spent over 20 years building and running businesses —
       not advising on them from the outside. I know what it feels
       like to be the first one in and the last one out. To be
       indispensable in a way that feels more like a trap than
       a compliment.

       KylixAI exists because I built automation systems for my
       own businesses and then realised other owners needed the
       same thing. Not a software product. Not a subscription.
       Just someone who comes in, finds what's broken, and fixes
       it — with skin in the game.

       (Lora italic 400, --text-lg, --color-ink, max-width: 640px)

                                [ui-quote-close: --color-accent-2 green, ~7rem, ROT+6°]
                                Positioned bottom-right of blockquote.
                                Bleeds ~30px RIGHT of text column. aria-hidden="true"

       — Austin Kyle, Founder, KylixAI
         (Lora 500, --text-sm, --color-ink-muted)
         No avatar image. No byline photo.

  NO card background. NO quote block surface. The quote floats on parchment.
  The theatrical marks ARE the frame.

  [BACK: envelope, ROT+3°]
  lower-left, partially visible, ambient

  ┌──────────────────────────────────────────────────────┐
  │  We're working with our first clients right now.     │  [ROT-1°]
  │  If you'd like to be among them — and help shape     │
  │  what we build — this is your moment.                │
  │                                                      │
  │  (Lora italic 400, --text-base, --color-ink-muted,   │
  │   --color-ground-deep background,                    │
  │   ui-hand-frame border, ROT-1°)                      │
  │                                                      │
  │  Results coming soon.                                │
  │  (Lora 400, --text-xs, --color-ink-ghost,            │
  │   letter-spacing: 0.08em)                            │
  └──────────────────────────────────────────────────────┘
```

The testimonial-placeholder block (ground-deep bg, hand-drawn frame) sits
below the founder quote. It is not a stat card. No accent-color heading.
The frame and rotation are the only visual treatment.

---

### SECTION 6: CTA / FORM

```
  [BACK: alarm-clock, ROT+10°]
  Returns here, SMALLER than hero instance (~40% of hero size).
  Quieter, positioned upper-right. Reminder: time is still being lost.

  Let's find your time back.
  (Playfair Display 900, --text-4xl, --color-ink)

  The audit is one conversation. Tell us what your business does,
  and we'll identify where time is being lost.
  (Lora 400, --text-lg, --color-ink-muted, max-width: 520px)

  If we can help, we'll show you the numbers.
  If we can't, we'll tell you.


  [Form — no card container. Fields float on parchment ground.]

  Name
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  └────────────────────────────────────────────────────────────┘
  (border: 1.5px solid --color-rule, bg: --color-surface-lift,
   Lora 500 label above field, not inside placeholder)

  Email address / Business phone / What does your business do?
  [same field treatment]

  ┌───────────────────────────────────────────────────────────┐
  │    Book my free audit                                     │
  │    (--color-accent-1 bg, Playfair Display 900,            │
  │     full width, --shadow-stamp)                           │
  └───────────────────────────────────────────────────────────┘

  No cost. No commitment. No AI jargon.
  (Lora 400, --text-xs, --color-ink-ghost, text-align: center)

  Or email us at hello@kylixai.com
  (Lora 400, --text-sm, text-decoration: underline, --color-ink-muted)

  [MID: dog-leash-free, ROT-6°]     ← the FREE/STRAIGHT variant
  Right side of section, clearly visible.
  This is the closing image. Outside. Freedom. The walk.
  Bookend to the tangled leash in the Recognition section.

  ─────────────────────────────────────────────────────────────
  FOOTER
  KylixAI                     Your business was supposed to give
  (Playfair Display 700)       you freedom. Let's get that back.
  © 2026                      (Lora italic 400, --color-ink-muted)
```

Form fields have no containing card. They float directly on `--color-ground`.
Hairline borders (`--color-rule`), barely-there field tint
(`--color-surface-lift`), Lora 500 labels above each field.

**Narrative bookend — dog leash:**
The dog leash appears twice:
1. Recognition section, lower-left: tangled variant (trapped state)
2. CTA section, right: straight/free variant (resolved state)

The scroll journey from tangled to free encodes the entire value proposition
in a single recurring symbol. This is intentional and must be preserved in all
future versions of the build.

**Narrative bookend — alarm clock:**
The alarm clock appears twice:
1. Hero section: large, upper-left, drifts off-screen (anxiety leaves)
2. CTA section: smaller, quieter, returns (time is still being lost — urgency to act)

---

## Checklist: Does This Look Like Default AI Design?

Before shipping any section, audit against this list. If ANY item is true, fix it.

- [ ] Gradient blob backgrounds → WRONG. Ground is flat parchment + grain only.
- [ ] Symmetric card grid (e.g., 3 equal columns) → WRONG. Organic stagger.
- [ ] Generic cream (#F4F1EA or whiter) → WRONG. Ground is #F0EAD6.
- [ ] Electric cyan anywhere → WRONG. That color is eliminated.
- [ ] Glassmorphism / frosted containers → WRONG.
- [ ] Glow shadows (neon color at high blur) → WRONG.
- [ ] Testimonials in a card with an avatar photo → WRONG. Theatrical quote marks.
- [ ] Section heading centered, decorative objects centered → WRONG. Off-grid.
- [ ] Inter, Roboto, or Arial in any element → WRONG. Playfair + Lora only.
- [ ] Decoration objects at exactly 0° rotation → WRONG. 1–4° minimum.
- [ ] Two marquee band instances → WRONG. Single instance only.
- [ ] Nav bar with background → WRONG. Corner text links only.

---

## Version

This spec was written for the v2.0 redesign of KylixAI website.
Last updated: 2026-06-10
