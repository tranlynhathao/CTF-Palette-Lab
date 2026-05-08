# Palette Workspace

A small browser-only tool for designing and stress-testing color palettes
against a real brand wordmark. No backend, no telemetry, everything stays in
the browser.

## Run

```bash
npm install
npm run dev
```

The dev server prints a URL (usually <http://localhost:5173>).

```bash
npm run build      # production build into dist/
npm run preview    # serve the build locally
npm run check      # format:check + lint + build
```

## What's in here

- A palette generator with seed color, mood presets, harmony modes, color
  locking, per-role regeneration, and contrast self-repair.
- Six preview surfaces (logo, poster, social, landing, terminal, cubic
  motifs) plus typography and palette comparison.
- A palette comparison view, contrast matrix, smart suggestions, and a
  color-blindness preview (protanopia / deuteranopia / tritanopia /
  grayscale).
- Image color extraction (drop in a PNG/JPG, get the dominant colors back),
  done locally via canvas — nothing is uploaded.
- Exports for CSS variables, Tailwind config, JSON, Figma tokens, an
  Illustrator-friendly SVG sheet, a vector PDF, and a ZIP package built for
  Adobe Illustrator handoff.
- Three "color modes" for the brand wordmark — Authentic / Palette-Aware /
  Experimental — so you can see what the palette does to a real brand mark
  without changing the locked brand color.

## Tech

Vite, React 18, TypeScript, Tailwind, Zustand (with persist), Culori for
color math, lucide-react for icons, framer-motion for transitions,
html-to-image for PNG snapshots, jspdf + svg2pdf.js for vector PDF, jszip
for the Illustrator package.

## The bundled wordmark

The "real" wordmark in the previews is a sample — a vector wordmark
extracted from a master `.ai` file via `pdf2svg`, with text already
converted to outlines. It ships at `src/assets/logo/logo-ctf26.svg` with
four named color slots:

| Hex       | Slot                   | Used for                              |
| --------- | ---------------------- | ------------------------------------- |
| `#E42175` | `--logo-pink` (locked) | brand pink fills                      |
| `#FFFFFF` | `--logo-light`         | back face of the extruded letterforms |
| `#232020` | `--logo-outline`       | dark stroke around the back face      |
| `#232020` | `--logo-shadow`        | solid dark fill of the cube glyph     |

`#E42175` is hard-coded as the locked brand color in Authentic and
Palette-Aware modes. Experimental mode swaps it for `palette.primary` and
the UI surfaces a warning so it can't be mistaken for canonical artwork.

To swap in a different wordmark, replace `logo-ctf26.svg` with one that
follows the same four-slot CSS-variable contract. To re-extract from a
fresh `.ai`:

```bash
brew install pdf2svg
pdf2svg /path/to/master.ai src/assets/logo/logo-ctf26.base.svg
sed -e 's|fill="rgb(89.411926%, 12.940979%, 45.881653%)"|fill="var(--logo-pink, #E42175)"|g' \
    -e 's|fill="rgb(100%, 100%, 100%)"|fill="var(--logo-light, #FFFFFF)"|g' \
    -e 's|stroke="rgb(13.725281%, 12.156677%, 12.548828%)"|stroke="var(--logo-outline, #232020)"|g' \
    -e 's|fill="rgb(13.725281%, 12.156677%, 12.548828%)"|fill="var(--logo-shadow, #232020)"|g' \
    src/assets/logo/logo-ctf26.base.svg > src/assets/logo/logo-ctf26.svg
```

The order of `sed` rules matters: the dark stroke pattern must run before
the dark fill pattern so paths with both attributes get the stroke renamed
first. If the new master uses different `rgb(...)` triplets, list them
with `grep -oE 'rgb\([^)]+\)' …base.svg | sort -u`.

The master `.ai` itself is never committed — `*.ai` is in `.gitignore`. The
"Download Original AI" button in the Illustrator export panel works only
on a private deployment that serves a master file at
`public/assets/logo/logo-ctf26.ai`; the public deployment shows a friendly
"held externally" notice instead.

## Deploying

GitHub Pages via GitHub Actions is wired up at
`.github/workflows/deploy.yml`. To enable:

1. Push to GitHub.
2. Settings → Pages → Source = GitHub Actions.
3. Push to `main`.

The workflow sets `VITE_BASE_PATH=/<repo-name>/` automatically. For a
user/org site or a custom domain, change that env var to `/`.

## Code style

Prettier handles formatting (Tailwind classes auto-sorted), ESLint v9
flat config handles code quality, and they're configured not to fight each
other. VS Code formats on save if you install the recommended extensions.
Husky runs `lint-staged` on commit if you set the project up locally.
