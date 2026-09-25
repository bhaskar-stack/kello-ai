# kello.ai

The Kello.ai marketing site. It's plain static HTML, CSS and JS, with no
build step. Open `index.html` in a browser, or serve the folder with any
static host (GitHub Pages works as is).

## Design system

Every page shares one design system. Start here before building or
changing a page:

| | |
|---|---|
| [`DESIGN.md`](DESIGN.md) | The guide: tokens, type scale, colour roles, spacing, icons, components with copy-paste markup, the new-page recipe and a pre-ship checklist |
| [`design-system.html`](design-system.html) | Live style guide. It renders every token, type style, icon and component from the real CSS, so it always matches the site |
| [`page-template.html`](page-template.html) | Blank page with the header, a section, the CTA card and the footer, already wired up. Copy it to start a new page |

The style guide and template are internal. They're marked `noindex`
and aren't linked from the site.

## Structure

```
index.html              landing page
design-system.html      live style guide (internal)
page-template.html      starting point for new pages (internal)
styles/
  tokens.css            every design value: colour, type, spacing, radius, shadow, motion
  base.css              reset, page canvas, layout, type classes
  components.css        shared components (buttons, frames, tabs, FAQ, header, footer…)
  home.css              landing-page-only layout
scripts/
  icons.js              icon sprite; load first in <body>
  site.js               shared behaviour (FAQ, ask field, glow, footer curtain)
  home.js               landing-page behaviour (sourcing tabs, testimonials)
assets/                 images, logos, SVG backgrounds
```

## Adding a page

1. Copy `page-template.html` to a new file and set its title and
   description. Remove its `noindex` tag.
2. Build the page from the components in `DESIGN.md`.
3. Put layout only this page needs in `styles/<page>.css`, using tokens
   only (no raw colours or pixel font sizes). Behaviour goes in
   `scripts/<page>.js`.
4. Check it against `design-system.html` at 1120px and 1440px wide.
