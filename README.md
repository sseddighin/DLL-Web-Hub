# DLL WebHub

Your guide to building, publishing, and managing websites. This implementation follows the approved v13 prototype: four main areas, optional design-planning paths, task guidance, and focused troubleshooting.

## Local development

Use Node.js 22 or newer (validated with Node 24) and npm:

```sh
npm ci
npm run dev
```

The preview binds only to `127.0.0.1`, port 4173 by default. Set `PORT` to use another local port. After editing source, run `npm run build` again and reload. `npm run preview` serves an existing build.

```sh
npm run lint
npm test
```

Tests use Playwright, axe-core, and Chromium. By default the runner uses `/usr/bin/chromium`; set `CHROMIUM_PATH` to an installed Chromium executable on another machine. Browser tests cover every guide and guidance view at desktop/mobile widths, accessibility scans, navigation, search, prompts, design controls, privacy boundaries, and 320px reflow. Screenshots are generated under ignored `test-results/`.

## Project structure

- `src/content/pages.json`: guide titles, content, and stable route slugs; HTML is trusted, reviewed author content. Never insert user content into these fields.
- `src/app.js`: routing, search, keyboard interactions, copy controls, and in-memory notes/checklists.
- `src/styles.css`: approved visual styles and responsive/accessibility refinements.
- `src/diagrams.js` and `src/assets/`: approved diagrams and illustration.
- `scripts/build.js`: creates `dist/` from an explicit public-file allowlist and copies locally installed fonts with their licenses.
- `docs/coverage-check.md`: maintainer-only coverage audit, excluded from the website build.

Routes use readable URL fragments, so a static host does not need server-side rewrites. Earlier prototype fragment IDs remain accepted as aliases. Tabs are linkable with `?view=do`, `?view=understand`, or `?view=deep` inside the fragment; task steps accept `&step=2`. Invalid routes show a recovery link.

The app uses no backend, analytics, external font requests, or secret configuration. Design notes and checked items live only in memory in the current browser tab; navigation preserves them and reload clears them. Copying explicitly writes to the local clipboard. The DLL text mark is a fallback, not a substitute logo asset; replace it only with an approved, locally hosted logo with appropriate alternative text.

## Publication boundary

Nothing in these commands deploys, modifies DNS, or connects Cloudflare. Only `dist/` is eligible for a future approved static-site publication. Do not serve the checkout root: it includes maintainer documents and development files. The uploaded source documents and internal PDF are not committed or included in `dist/`.

GitHub default branch is `main`. The actual production branch, Cloudflare project, domain, and publication configuration remain unconfirmed. Before a future handoff, verify repository write/PR access, confirm those production details, and check whether feature branches trigger hosted previews. Use reviewed GitHub changes; do not merge or publish without approval.
