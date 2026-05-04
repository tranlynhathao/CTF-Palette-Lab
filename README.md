# CTF Palette Lab

> Generate, preview, validate, and export serious CTF color systems.

CTF Palette Lab is a polished, production-quality static design tool built to
help craft the visual identity for **HCMUS CTF 2026**. It is not a generic
palette generator — it is a focused workflow for choosing colors that work
across logos, posters, social posts, landing pages, terminals, and event
graphics.

Local-first. No backend. No telemetry. No accounts.

---

## Features

- **14 preloaded, hand-tuned palettes** including _Cubic Cyber Noir_, _HCMUS Legacy Modern_, _Classic Hacker_, _Multi-Color CTF_, _Dark Academic Security_, _Red Team Ops_, _Blue Team Grid_, _Vault Gold_, _Cubic Glass_, _Puzzle Cube_, _Retro CRT_, _Terminal War Room_, _Neon Minimal_, and a serious _Finalist Candidate_ for HCMUS CTF 2026.
- **Role-based palette model** — `bgPrimary`, `bgSecondary`, `surface`, `surfaceElevated`, `primary`, `secondary`, `accent`, `highlight`, `textMain`, `textMuted`, `border`, `danger`.
- **Smart palette generator** with seed color, mood preset, harmony mode, and generation options (dark optimized, muted, high-contrast, neon accent, classic tone). Locked colors are preserved.
- **Per-color regeneration** without touching the rest of the palette.
- **Color Inspector** — HEX / RGB / HSL / OKLCH, hue/saturation/lightness sliders, opacity overlay preview, suggested usage.
- **WCAG Contrast Matrix** — AA, AA-large, AAA passes for the 11 most important brand pairs, with Excellent / Good / Risky / Fail verdicts.
- **Visual Preview Tabs** — Logo, Poster, Social (1:1), Landing Page, Terminal, and Cubic Motifs. Export the current preview as PNG.
- **Smart Suggestions** — rule-based design and accessibility insights tuned for CTF branding.
- **Design System Starter** — guidance on how to apply each role to logo / poster / social / website surfaces.
- **Palette Comparison** — pick 2–4 saved palettes side-by-side and get summary recommendations (best for logo, poster, website, classic, modern, accessibility risk).
- **Color Blindness Simulation** — protanopia, deuteranopia, tritanopia, grayscale.
- **CTF Motif Builder** — wireframe cube, flat cube, 3×3 grid cube, cluster, translucent cube, keyhole cube, flag cube, terminal prompt, circuit, lock core, and bracket mark — all SVG, copy or download with current palette applied.
- **Image Color Extraction** — drop in a poster or screenshot, extract dominant colors locally with a canvas, convert into a role-based palette.
- **Exports**:
  - CSS variables (`--ctf-*`)
  - Tailwind config snippet
  - Palette JSON (and JSON import)
  - Figma tokens JSON
  - Adobe Illustrator HEX list
  - SVG palette sheet
  - PNG snapshot of the current preview
- **Typography Preview** — logo, poster heading, UI heading, body, muted metadata, terminal mono, button, badge — all driven by the current palette.
- **Local Storage** via Zustand `persist` — saved palettes, current palette, mood, harmony, options, comparison list, CVD mode.
- **Keyboard Shortcuts** — `G` generate · `S` save · `E` export · `R` randomize seed · `C` copy selected color · `?` shortcuts modal.

---

## Tech Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (custom dark design tokens)
- [Zustand](https://github.com/pmndrs/zustand) with `persist` for state + localStorage
- [Culori](https://culorijs.org/) for color conversion (HEX, RGB, HSL, OKLCH) and harmony math
- [lucide-react](https://lucide.dev/) for icons
- [Framer Motion](https://www.framer.com/motion/) for subtle UI transitions
- [html-to-image](https://github.com/bubkoo/html-to-image) for PNG export of preview surfaces

No backend. No external API. No authentication.

---

## Getting Started

```bash
npm install
npm run dev
```

Open the printed URL (typically <http://localhost:5173/>).

### Production build

```bash
npm run build
npm run preview
```

The build output lives in `dist/`.

---

## Code Formatting

This project uses **Prettier** for formatting and **ESLint** for code quality. The two are configured to never fight each other (`eslint-config-prettier` disables every ESLint rule that would conflict with Prettier).

### Commands

```bash
npm run format         # Format the entire repo
npm run format:check   # Check formatting (used in CI)
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix lint issues
npm run check          # format:check + lint + build (full pre-push check)
npm run typecheck      # tsc --noEmit only
```

### What gets formatted

`npm run format` covers every file Prettier understands in the repo: `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.json`, `.md`, `.yml`, `.yaml`, `.html`, and config files. Generated and dependency folders (`node_modules`, `dist`, `build`, `coverage`, `.vite`, `.cache`, lockfile) are listed in `.prettierignore`.

### Tailwind class sorting

`prettier-plugin-tailwindcss` is enabled, so any time you save or run `npm run format`, Tailwind classes are sorted into the recommended order automatically.

### VS Code format-on-save

`.vscode/settings.json` sets Prettier as the default formatter for every supported language and enables format-on-save plus `source.fixAll.eslint` on save. `.vscode/extensions.json` recommends:

- `esbenp.prettier-vscode`
- `dbaeumer.vscode-eslint`
- `bradlc.vscode-tailwindcss`
- `editorconfig.editorconfig`

Open the project in VS Code and click **Install** when prompted. From then on every saved file is auto-formatted and Tailwind classes are auto-sorted.

### Pre-commit hook (optional)

`husky` and `lint-staged` are wired up. After cloning, run `npm install` once to register the Husky hook (`prepare` script). Each commit will:

```jsonc
"*.{ts,tsx,js,jsx}":         ["eslint --fix", "prettier --write"]
"*.{css,json,md,yml,yaml,html}": ["prettier --write"]
```

If you do not want pre-commit hooks, simply skip `husky install` — Prettier will still work as a standalone command.

### CI

The GitHub Actions workflow runs `npm run format:check && npm run lint && npm run build` before deploying, so any unformatted commit will fail CI rather than silently shipping.

---

## Deployment to GitHub Pages

This project is configured for GitHub Pages deployment using GitHub Actions.

### Enable GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings**.
4. Go to **Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Push to the `main` branch.
7. GitHub Actions will build and deploy the app automatically.

The workflow lives at `.github/workflows/deploy.yml`. It also supports manual runs via the **Actions → Deploy to GitHub Pages → Run workflow** button (`workflow_dispatch`).

### Base path

This project uses the `VITE_BASE_PATH` environment variable to support GitHub Pages project-site deployment.

For a project site deployed at:

    https://<username>.github.io/<repo-name>/

the workflow sets:

    VITE_BASE_PATH=/<repo-name>/

For a user/organization site deployed at:

    https://<username>.github.io/

change the workflow build environment variable to:

    VITE_BASE_PATH=/

For a custom domain, also use:

    VITE_BASE_PATH=/

### Local development

    npm install
    npm run dev

### Production build

    npm run build
    npm run preview

### Troubleshooting: blank screen on GitHub Pages

If the deployed GitHub Pages site shows a blank screen or the browser console reports 404 errors for `/assets/*.js` or `/assets/*.css`, the Vite `base` path is almost certainly wrong. Make sure `VITE_BASE_PATH` matches the deployed path:

- Project site → `/<repo-name>/`
- User/organization site or custom domain → `/`

---

## The HCMUS CTF 2026 logo preview

The Logo preview tab and the palette comparison cards render a **source-faithful** version of the real HCMUS CTF 2026 wordmark, not a redesign or approximation.

### How it was extracted

1. The master file is `logo-ctf26.ai` (in the repo root). Modern Illustrator saves it as a PDF-compatible stream, so it can be parsed by any PDF tool.
2. We ran `pdf2svg logo-ctf26.ai src/assets/logo/logo-ctf26.base.svg` once. This emits the exact vector geometry — every path is the original Illustrator path. Text was already converted to outlines in the source, so the preview reproduces the typography exactly with **zero font dependencies**.
3. A scripted color substitution produced `src/assets/logo/logo-ctf26.svg` — the same geometry, but with three named color slots:

   | Source RGB                    | Hex       | Slot in the recolorable SVG       |
   | ----------------------------- | --------- | --------------------------------- |
   | `rgb(89.41%, 12.94%, 45.88%)` | `#E42175` | hard-coded — **fixed brand pink** |
   | `rgb(13.73%, 12.16%, 12.55%)` | `#232020` | `var(--logo-ink, #232020)`        |
   | `rgb(100%, 100%, 100%)`       | `#FFFFFF` | `var(--logo-back, #FFFFFF)`       |

4. `src/components/preview/ExactCompetitionLogo.tsx` inlines that SVG and binds `--logo-ink` and `--logo-back` to props driven by the active palette. The brand pink is **never** swapped.

### Recoloring rules

- **Brand pink `#E42175` is locked.** It is hard-coded in the SVG and re-exported as the constant `HCMUS_CTF_BRAND_PINK`. Do not parameterise it. This is the single fixed color of the HCMUS CTF 2026 visual identity.
- **Ink** (the dark outline + cube front) is bound to `palette.textMain` so it always has high contrast against the canvas.
- **Back face** of the 3D-extruded letterforms is bound to `palette.surface` (or `surfaceElevated` / `textMuted` depending on the preview card) so the extrusion remains visible against any background.

### What you must NOT do

- Do not redraw, restyle, or "modernise" the geometry. If the master logo changes, update `logo-ctf26.ai`, re-run `pdf2svg`, and re-apply the three colour substitutions.
- Do not replace the outlined text with a near-match font — the outlines guarantee exactness. There is no font fallback because none is needed.
- Do not introduce additional palette tokens into the logo. Two slots (ink + back) plus the locked pink is the complete contract.
- Do not crop or rotate the logo in previews. The viewBox `0 0 210 70` and the locked aspect ratio (`210 / 70`) must be preserved.

### Re-extracting after a logo update

```bash
brew install pdf2svg          # one-time, if missing
pdf2svg logo-ctf26.ai src/assets/logo/logo-ctf26.base.svg
sed -e 's|rgb(89.411926%, 12.940979%, 45.881653%)|#E42175|g' \
    -e 's|rgb(13.725281%, 12.156677%, 12.548828%)|var(--logo-ink, #232020)|g' \
    -e 's|rgb(100%, 100%, 100%)|var(--logo-back, #FFFFFF)|g' \
    src/assets/logo/logo-ctf26.base.svg > src/assets/logo/logo-ctf26.svg
```

If a future master file uses different `rgb(...)` triplets for ink/back, inspect with `grep -oE 'rgb\([^)]+\)' src/assets/logo/logo-ctf26.base.svg | sort -u` and update the substitutions accordingly.

---

## Notes on local-only image processing

Image extraction happens **entirely on your device** via a `<canvas>`:

1. The image is decoded with `<img>` (no upload).
2. Resized to ≤220px on the long edge.
3. Pixels are bucketed into a 4096-bin (`>>4` per channel) histogram.
4. The top buckets are merged using a small min-distance filter to remove near-duplicates.
5. The resulting 6–10 dominant colors are mapped onto the role-based palette by lightness and chromaticity.

Nothing leaves the browser. There is no server upload at any point.

---

## Using the exports

### Adobe Illustrator

1. Open the **Export** panel and select **Illustrator**.
2. Copy the list (or use the SVG palette sheet for visual reference).
3. In Illustrator: **Window → Swatches**, then **New Swatch** for each HEX, or paste the SVG sheet onto an artboard and use the eyedropper.

### Figma

1. Select **Figma** in the Export panel.
2. Copy the JSON.
3. In Figma: install the **Tokens Studio** plugin, paste under _Color_ tokens, then sync to your library.

### Tailwind / CSS

The CSS variables and the Tailwind snippet are ready to drop into a project. The Tailwind snippet exposes `bg-ctf-primary`, `text-ctf-text-main`, `border-ctf-border`, etc.

---

## Project structure

```
src/
  main.tsx            React entrypoint
  App.tsx             Mounts AppShell
  index.css           Tailwind base + design tokens + scrollbars + CVD filter classes
  types.ts            ColorRole / Palette / GenerationOptions / Mood / HarmonyMode
  data/palettes.ts    14 preloaded palettes
  lib/
    color.ts          Culori-based conversion, OKLCH adjustment, CVD simulation
    contrast.ts       WCAG ratios, verdicts, contrast pair report
    generator.ts      Role-based palette generator + contrast repair
    suggestions.ts    Rule-based design suggestions
    export.ts         CSS / Tailwind / Figma / Illustrator / SVG sheet
    imageExtract.ts   Local canvas color extraction
    storage.ts        localStorage helpers
  store/paletteStore.ts   Zustand store (with persist)
  components/
    layout/           AppShell · TopNav · Sidebar · RightPanel
    palette/          Swatches · CenterWorkspace · Comparison · CvdSelector
    inspector/        ColorInspector · ContrastMatrix · SmartSuggestions · DesignSystemStarter
    preview/          PreviewTabs · LogoPreview · PosterPreview · SocialPreview · LandingPreview · TerminalPreview · CubicMotifPreview · TypographyPreview
    export/           ExportPanel · ExportModal
    image/            ImageColorExtractor
    motifs/           SvgMotifs · MotifBuilder
    ui/               Toast · Tabs · CvdFilters · ShortcutsModal
```

---

## Acknowledgements

Built for the HCMUS CTF 2026 organising team. The cube, vault, and terminal motifs are inspired by classic CTF iconography but designed as palette previews, not final brand artwork.
