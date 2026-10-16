# DLL WebHub

Your guide to building, publishing, and managing websites. This implementation follows the approved v13 prototype: four main areas, optional design-planning paths, task guidance, and focused troubleshooting.

## Local development

Use Node.js 22 or newer (validated with Node 24) and npm:

```sh
npm ci
npm run dev
```

The preview binds only to `127.0.0.1`, port 4173 by default, and serves the built site under `/DLL-Web-Hub/`. Visiting the local origin root redirects there. Set `PORT` to use another local port. After editing source, run `npm run build` again and reload. `npm run preview` serves an existing build and reads its base path from the generated HTML.

```sh
npm run lint
npm test
```

Tests use Playwright, axe-core, and Chromium. The runner uses `CHROMIUM_PATH` when supplied, then `/usr/bin/chromium` when available, otherwise Playwright's bundled browser. Install that browser with `npx playwright install --with-deps chromium` when needed (the Actions workflow does this). Browser tests cover every guide and guidance view at desktop/mobile widths, accessibility scans, navigation, search, prompts, design controls, privacy boundaries, 320px reflow, and project-path assets/navigation. Screenshots are generated under ignored `test-results/`.

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

Local npm commands do not deploy, modify DNS, or connect Cloudflare. `npm run build` creates the actual application in **`dist/`**; it never substitutes the README. Do not serve the checkout root: it includes maintainer documents and development files. The uploaded source documents and internal PDF are not committed or included in `dist/`.

## GitHub Pages

The target is `https://sseddighin.github.io/DLL-Web-Hub/`. The build defaults to `/DLL-Web-Hub/` via `scripts/site-config.js` and injects an HTML base URL before asset references. Modules, styles, images and local fonts resolve beneath that directory; hash-based routes and navigation stay on the same project URL. To build for a different mount, set an absolute directory path with a trailing slash, for example `BASE_PATH=/ npm run build` for the origin root.

`.github/workflows/pages.yml` runs on pull requests targeting `main`, pushes to `main`, and manual dispatch. It installs locked npm dependencies with Node 24, checks syntax, builds, and runs the browser tests. Only a successful build on `main` can upload **`dist/` alone** as a Pages artifact and deploy it through the `github-pages` environment using GitHub's official Pages actions. Pull requests and feature branches cannot deploy through this workflow. The deployment job alone receives Pages write and OIDC permissions. There is no Cloudflare configuration.

Before the first deployment, a repository administrator must select **Settings → Pages → Build and deployment → Source → GitHub Actions**, if it is not already selected. Review any approval requirements on the `github-pages` environment. Repository settings cannot be verified from this environment because the GitHub Pages API returns Forbidden. No personal token is required by the workflow: it uses GitHub's automatic job token and OIDC.

After approval and merge into `main`, the workflow will publish the built site to the Pages URL. An authorized maintainer can also run the workflow manually on `main`. Review the Actions run, deployment URL, and live site's navigation/assets before calling the deployment verified. Do not merge without approval. Cloudflare remains unconfigured.
