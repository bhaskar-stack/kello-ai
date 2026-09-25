# Kello design system

Everything a new page needs to look like the rest of kello.ai. It covers
the design tokens, the type scale, colour, spacing, icons and the shared
components.

- **Live reference:** open `design-system.html`. It renders every token,
  type style, icon and component from the real CSS, so it can't drift.
- **Starting a page:** copy `page-template.html`. It is already wired to
  the shared CSS and JS, and has the header, a section, the CTA card and
  the footer.

## Files

| File | What it holds | Who edits it |
|---|---|---|
| `styles/tokens.css` | Every value: colour, type, spacing, radius, shadow, motion, z-index | Changes here restyle every page |
| `styles/base.css` | Reset, page canvas (texture + glows), `.wrap`, section rhythm, type classes (`.t-*`), `.eyebrow`, `.section-head`, `.rule-dashed` | Rarely |
| `styles/components.css` | Buttons, chips, badges, avatar, point list, ruled frame, tabs, header, FAQ, ask field, CTA card, footer curtain, footer | When a block is reused |
| `styles/<page>.css` | Layout that only one page uses (`home.css` for the landing page) | Freely |
| `scripts/icons.js` | The icon sprite | To add icons |
| `scripts/site.js` | Behaviour for shared components: FAQ, ask field, CTA art, glow anchor, footer curtain | When a component needs JS |
| `scripts/<page>.js` | Behaviour for one page (`home.js`: sourcing scroll tabs, testimonial batches) | Freely |

Load order is always **tokens, then base, then components, then the page
CSS**. On the JS side, `icons.js` goes first in `<body>`. `site.js` and
the page script go last.

**Rule of thumb:** a page stylesheet only lays things out. If you're
about to type a hex colour, a font size or a shadow, there's a token
for it. If a block from one page shows up on a second, move it into
`components.css`.

## Tokens

Components and pages read **semantic** tokens (`--color-text-muted`,
`--text-body-size`). The **primitive** palette (`--olive-900`,
`--ink-400`, …) is only referenced from `tokens.css`, so a re-theme
touches one file.

### Colour

| Role | Token | Value | Use |
|---|---|---|---|
| Page | `--color-bg-page` | `#FAFAF8` | Canvas, testimonial and plan cells |
| Raised | `--color-bg-raised` | `#FFFFFF` | Cards, fields, the CTA card |
| Sunken | `--color-bg-sunken` | `#F4F4F2` | Tab bars, trays |
| Muted | `--color-bg-muted` | `#F1F0F0` | Image placeholders |
| Brand | `--color-bg-brand` | `#2B3200` | Primary buttons, logo tile |
| Brand tint | `--color-bg-brand-tint` | `#E5E6DF` | Pills |
| Text primary | `--color-text-primary` | `#18181B` | Headings, key copy |
| Text strong | `--color-text-strong` | `#212121` | Nav, lists, quotes |
| Text body | `--color-text-body` | `#333333` | Long paragraphs |
| Text secondary | `--color-text-secondary` | `#505050` | Supporting copy, footer |
| Text muted | `--color-text-muted` | `#6B6B6D` | Meta, placeholders, inactive tabs (4.8:1 or better on every surface) |
| Text brand | `--color-text-brand` | `#2B3200` | Eyebrows, links, hover |
| Text inverse | `--color-text-inverse` | `#FFFFFF` | On brand fills |
| Rule | `--color-border-rule` | `#DCDCDC` | Ruled frames, dashed rules |
| Border | `--color-border` | `#E2E2E3` | Controls |
| Border soft | `--color-border-soft` | `#E4E4E2` | Footer rules |
| Border subtle | `--color-border-subtle` | `#ECECEC` | Raised cards |
| Mark | `--color-mark` | `#18181B` | Ruled-frame corner crosses |
| Focus | `--color-focus` | `#2B3200` | Focus rings |

Green is the accent. It shows up in the soft page glows, the product
visuals (`--gradient-visual`) and the CTA art, never as text or UI
chrome.

### Typography

Inclusive Sans for everything. Dancing Script only for signatures, and
`--font-mono` (the system monospace) only for URLs and code. Two
weights: 400 regular, 500 medium. Running text is tracked
`--tracking-tight` (−0.02em), and every ALL-CAPS label is
`--tracking-caps` (+0.05em).

| Role | Class | Size / line height | Weight | Tracking | Used for |
|---|---|---|---|---|---|
| Display | `.t-display` | 56 / 1.2 | 500 | −0.02em | The hero headline (one per page) |
| Heading | `.t-heading` or `.section-head h2` | 40 / 1.2 | 500 | −0.04em | Section headings, prices |
| Heading small | (`.footer-pitch h2`) | 36 / 1.2 | 500 | −0.02em | Footer pitch |
| Subhead | `.t-subhead` | 24 / 32 | 400 | −0.02em | Lead line under a heading |
| Title | `.t-title` | 24 / 1.2 | 500 | −0.02em | Panel titles |
| Card title | `.t-card-title` | 20 / 26 | 500 | −0.01em | Card titles; the footer sub-line uses this size at 400 |
| Lead | `.t-lead` | 18 / 28 | 400 | −0.02em | Paragraphs, point lists, quotes |
| UI large | `.t-ui-lg` | 18 / 24 | 400 | −0.02em | Tabs, FAQ questions, footer |
| Body | `.t-body` | 16 / 24 | 400 | −0.02em | Body copy, nav, 48px buttons |
| Control | (`.btn`, `.eyebrow`) | 16 / 20 | 400 | — | 40px buttons, eyebrows |
| Small | `.t-small` | 14 / 20 | 400 | −0.02em | Meta, plan features |
| Label | `.t-label` | 14 / 20 | 400 | +0.05em caps | Small caps labels |
| Tag | (`.chip`, `.pill`) | 14 / 16 | 400 | +0.05em caps | Chips, pills |

The type classes set size, line height, weight, tracking and a default
colour. `.t-medium` and `.t-muted` adjust weight and colour.

### Spacing

A 4px base: `--space-N` is N × 4px (`1 2 3 4 5 6 8 10 12 14 16 20 30`).
Page-level rhythm has its own tokens:

| Token | Value | Meaning |
|---|---|---|
| `--container` | 1280px | Content column (`.wrap`) |
| `--gutter` | 32px | Minimum side margin once the viewport is narrower |
| `--page-min-width` | 1120px | Desktop-only layout |
| `--header-height` | 72px | Sticky header |
| `--section-gap` | 180px | Content to content between sections (each `section` pads half) |
| `--section-head-gap` | 56px | Heading block to its content |
| `--footer-gap` | 200px | Last section to the footer content |
| `--footer-pin` | 200px | How much of the CTA card stays above the fold when the footer slides over |
| `--frame-overhang` | 32px | How far ruled-frame rules run past the box |

### Radius

`--radius-xs` 2 (badge tag), `--radius-sm` 4 (badges), `--radius-md` 8
(buttons, chips, fields), `--radius-lg` 12 (cards inside visuals),
`--radius-full` (pills, avatars).

**Section containers are square.** Ruled frames, testimonial cells, plan
cells and the CTA card have no radius.

### Elevation

| Token | Use |
|---|---|
| `--shadow-raised` + `--shadow-sheen` | Primary buttons, logo tile (dark fill with a glossy top edge) |
| `--shadow-control` | Secondary buttons |
| `--shadow-soft-drop` | The face of `.btn-soft` (applied as a `drop-shadow` filter) |
| `--shadow-card` | Cards inside product visuals |

Section containers carry no shadow. Depth on the page comes from the
rules, the texture and the glow.

### Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | .15s | Colour and border hovers |
| `--duration-press` | .16s | Button lift and press |
| `--duration-move` | .4s | Highlights, reels |
| `--duration-slide` | .6s | Whole-batch slides |
| `--stagger-line` | .08s | Line-by-line text reveal |
| `--ease-out` | power2.out | Reels, glider |
| `--ease-in-out` | | Batch slides |
| `--ease-reveal` | | Text reveals |

Everything that moves has a `prefers-reduced-motion` fallback. Keep
that true for new components.

## Icons

One sprite, `scripts/icons.js`, included first in `<body>`:

```html
<svg class="icon icon-sm" aria-hidden="true"><use href="#i-arrow-right"/></svg>
```

| Class | Size | Stroke | Use |
|---|---|---|---|
| `.icon-sm` | 16px | 2 | Inside 40px buttons, list bullets, FAQ +/− |
| `.icon-md` | 20px | 1.75 | Inside fields |
| `.icon` | 24px | 1.5 | Inside 48px buttons, footer, social |

The stroke thickens as the icon shrinks, so every size reads at the same
optical weight. Icons take `currentColor`.

The sprite holds: `arrow-right`, `chevron-right`, `chevron-left`,
`check-circle`, `plus`, `minus`, `play`, `linkedin`, `x`, `instagram`,
`sparkle`, `kello-mark`, `copy`, `check`. `design-system.html` lists whatever is in the
file.

**Adding an icon.** Use Hugeicons (stroke-rounded, the free set is MIT)
or draw on a 24 × 24 grid with round caps and joins. Paste the inner
`<path>`s into `ICONS` in `icons.js` without `stroke`/`fill`/`stroke-width`
attributes, so CSS controls them. A filled glyph sets
`fill="currentColor" stroke="none"` on its paths. Buttons use
`arrow-right` for "go"; `chevron-right` is for "next" in compact
controls and plan buttons.

Decorative, one-off illustrations (the CTA art, the product-visual
marks) stay inline in the page. They're not icons.

## Components

Markup for each is below. `design-system.html` shows them rendered.

### Buttons

`.btn` + a size + a style.

```html
<a class="btn btn-primary" href="#">Book a demo
  <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg></a>
<a class="btn btn-secondary" href="#">Signup</a>
<a class="btn btn-primary btn-lg" href="#">Try Kello for free …</a>
<a class="btn btn-lg btn-soft btn-block" href="#"><span class="btn-face">Get started …</span></a>
<button class="btn btn-secondary btn-icon" aria-label="Next"><svg class="icon icon-sm">…</svg></button>
```

- **Sizes:** default 40px (16/20 text, 20px padding, 16px icon) and
  `.btn-lg` 48px (16/24 text, 24px padding, 24px icon).
- **Styles:** `.btn-primary` (olive; one per view where possible),
  `.btn-secondary` (light grey), `.btn-soft` (hairline ring and gradient
  face; needs the inner `.btn-face`).
- **Modifiers:** `.btn-block` (full width), `.btn-icon` (square; always
  give it an `aria-label`).
- All buttons lift 2px on hover, press to 0.98, and show a 2px olive
  focus ring.

### Chips, pills, badges

```html
<span class="chip">PAY PER JOB</span>
<span class="pill">SAVE 30%</span>
<span class="badge"><span class="badge-tag">NEW</span> 100M+ profiles reviewed</span>
```

### Section heading

```html
<div class="section-head">
  <div class="eyebrow">Pricing</div>
  <h2>Find the plan<br>that suits your hiring needs</h2>
</div>
```

Add `.has-actions` and a second child to put controls (carousel arrows)
on the right.

### Ruled frame

The signature container: rules run 32px past the box, with a `#18181B`
cross on each corner. It suits any grid of cells: testimonials, plans,
the CTA.

```html
<div class="ruled-frame">
  …cells (square, divided by 1px var(--color-border-rule))…
  <span class="ruled-corner tl" aria-hidden="true"></span>
  <span class="ruled-corner tr" aria-hidden="true"></span>
  <span class="ruled-corner bl" aria-hidden="true"></span>
  <span class="ruled-corner br" aria-hidden="true"></span>
</div>
```

### Point list and dashed rule

```html
<ul class="point-list"><li><span class="point-dot"></span>Reads the JD like a recruiter</li></ul>
<div class="rule-dashed"></div>
```

Dashes are always 8px on and 8px off, 1px, with round caps. Use
`--texture-dash-rule`, never `border-style:dashed`.

### Tabs

```html
<div class="tabs" role="tablist" style="--tab-count:3">
  <span class="tab-glider" aria-hidden="true"></span>
  <button class="tab-btn active" role="tab" aria-selected="true">One</button>
  <button class="tab-btn" role="tab" aria-selected="false">Two</button>
  <button class="tab-btn" role="tab" aria-selected="false">Three</button>
</div>
```

Set `--tab-pos` (the active index) on `.tabs` and the highlight glides
there. The home page drives it from scroll (`home.js`). A plain page
can set it on click.

### FAQ and ask field

```html
<div class="faq-item open">
  <button class="faq-q-btn" aria-expanded="true" aria-controls="faq-a-1">
    <span class="faq-q" id="faq-q-1">Question</span>
    <span class="faq-icon" aria-hidden="true">
      <svg class="icon icon-sm i-plus" aria-hidden="true"><use href="#i-plus"/></svg>
      <svg class="icon icon-sm i-minus" aria-hidden="true"><use href="#i-minus"/></svg>
    </span>
  </button>
  <div class="faq-a" id="faq-a-1" role="region" aria-labelledby="faq-q-1">Answer</div>
</div>

<form class="ask-field" action="#" novalidate data-note="Thanks! This is a design concept, so questions aren't sent anywhere.">
  <label class="sr-only" for="ask-input">Ask Kello a question</label>
  <input id="ask-input" name="question" type="text" autocomplete="off" placeholder="Anything else you'd like to ask? Type it here…">
  <button type="submit" aria-label="Send your question">
    <svg class="icon icon-md" aria-hidden="true"><use href="#i-arrow-right"/></svg>
  </button>
</form>
```

`site.js` opens one answer at a time. For the question field, add
`data-mailto` (plus an optional `data-subject`) to turn a question into a
prefilled email. Without it, the field clears and shows `data-note` below.

### Copy field and prompt card

A value people paste somewhere else (a connector URL, a key), with a copy
button. `site.js` copies the target's text and briefly swaps the label to
"Copied" with a tick. The value uses `--font-mono`.

```html
<div class="copy-field">
  <code id="mcp-url">https://kello.ai/mcp</code>
  <button class="btn btn-secondary" type="button" data-copy="#mcp-url">
    <svg class="icon icon-sm" aria-hidden="true"><use href="#i-copy"/></svg><span>Copy</span>
  </button>
</div>
```

Example prompts ("Try asking") sit in square cards with a green accent bar:

```html
<ul class="prompt-list"><li class="prompt-card">“Who are the eng leaders at CRED?”</li></ul>
```

### Concept bar and sample tag

This site is an unofficial redesign concept, so every page opens with the
concept bar, above the header. It scrolls away and the header then sticks.

```html
<div class="concept-bar dot-list">
  <span>Redesign concept by <strong>Bhaskar Tiwari</strong></span><span class="dot" aria-hidden="true"></span><span>Not affiliated with Kello</span><span class="dot" aria-hidden="true"></span><a href="design-system.html">See the design system …</a>
</div>
```

Put `<span class="sample-tag">Sample</span>` on illustrative or placeholder
content until real content replaces it. It's an inline tag. Inside a
testimonial card it pins to the top-right corner, and under the logo-row
label it reads "Placeholder". Everything on the landing page except the
Sourcing and MCP sections is illustrative, and the concept bar says so.

### Page chrome: header, CTA card, footer curtain

These are in `page-template.html`; copy them as they are. The structure
the curtain needs:

```
header.site-header
div.page-stack            <- everything between header and footer
  section …
  div.cta-band-wrap > div.cta-band.ruled-frame
div.page-blur
footer.site-footer
```

`site.js` pins `.page-stack` once the CTA card sits `--footer-pin` above
the fold. The footer then slides over it, and `.page-blur` blurs the
page once half the footer is on screen. The CTA's animated depth art
(`.cta-depth-svg`) is optional; copy it from `index.html` if you want
it.

### Footer wordmark

The footer ends with an oversized "kello.ai" (`.footer-giant`). It is sized
from its container, so its ink spans the content column exactly, and the
bottom 20% of the letters is cropped by the page edge. A sage gradient
runs from `--sage-500` at the top of the letters to `--sage-100` at the
crop. It's in `page-template.html` already. The metrics in the CSS
comment are for Inclusive Sans 500, so recheck them if the font changes.

### Page glow

`.page-glows` holds soft green light behind the page. Put
`data-glow-anchor` on the one calm, box-free section where the second
glow should sit, and `site.js` positions it.

## Page recipe

1. Copy `page-template.html` to `your-page.html` and set the `<title>`
   and description.
2. Build sections from `.wrap` and `.section-head`, plus components.
   Section spacing comes for free (`section` pads `--section-gap / 2`).
3. Layout that only this page needs goes in `styles/your-page.css`,
   using tokens only. Behaviour goes in `scripts/your-page.js`, loaded
   after `site.js`.
4. Open `design-system.html` next to it and check type, colour and
   spacing against the reference.

## Checklist before shipping a page

- [ ] No raw hex, px font sizes, or shadows in the page CSS; tokens only.
- [ ] One `.t-display` or hero `h1`, then `h2` section heads in order.
- [ ] Icons come from the sprite at one of the three sizes.
- [ ] Section containers are square with no shadow; controls use `--radius-md`.
- [ ] Every icon-only control has an `aria-label`. Decorative SVGs are `aria-hidden`.
- [ ] Anything animated has a reduced-motion fallback.
- [ ] Checked at 1120px and 1440px wide.
