import { cp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { basePath } from "./site-config.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const src = path.join(root, "src");
const out = path.join(root, "dist");
const pages = JSON.parse(
  await readFile(path.join(src, "content/pages.json"), "utf8"),
);
const ids = new Set();
const slugs = new Set();
for (const page of pages) {
  if (ids.has(page.id) || slugs.has(page.slug))
    throw new Error(`Duplicate guide: ${page.id}`);
  ids.add(page.id);
  slugs.add(page.slug);
  if (!page.title || !page.do.trim())
    throw new Error(`Incomplete guide: ${page.id}`);
  for (const mode of ["do", "understand", "deep"]) {
    if (/<script|\son\w+=/i.test(page[mode]))
      throw new Error(`Executable content: ${page.id}`);
  }
}
const sections = new Set(["home", "start", "build", "publish", "manage"]);
for (const page of pages) {
  for (const match of JSON.stringify(page).matchAll(
    /href=\\"#([^"?\\]+)(?:[^"\\]*)\\"/g,
  )) {
    if (!ids.has(match[1]) && !sections.has(match[1]))
      throw new Error(`Unknown destination ${match[1]} in ${page.id}`);
  }
}
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const html = await readFile(path.join(src, "index.html"), "utf8");
await writeFile(
  path.join(out, "index.html"),
  html.replace("<!-- SITE_BASE -->", `<base href="${basePath}">`),
);
// Explicit public allowlist: maintainer docs and source references never enter dist.
for (const name of ["styles.css", "app.js", "diagrams.js", "assets"]) {
  await cp(path.join(src, name), path.join(out, name), { recursive: true });
}
await cp(
  path.join(root, "Computing and AI for ALL.jpg"),
  path.join(out, "assets/Computing and AI for ALL.jpg"),
);
await writeFile(
  path.join(out, "content.js"),
  `// Generated from src/content/pages.json.\nexport const pages = ${JSON.stringify(pages)};\n`,
);
await mkdir(path.join(out, "assets/fonts"), { recursive: true });
for (const [family, weights] of [
  ["montserrat", [400, 700]],
  ["open-sans", [400, 600, 700]],
]) {
  for (const weight of weights) {
    const name = `${family}-latin-${weight}-normal.woff2`;
    await cp(
      path.join(root, "node_modules/@fontsource", family, "files", name),
      path.join(out, "assets/fonts", name),
    );
  }
  await cp(
    path.join(root, "node_modules/@fontsource", family, "LICENSE"),
    path.join(out, "assets/fonts", `${family}-LICENSE.txt`),
  );
}
console.log(
  `Built ${pages.filter((p) => !p.landing).length} guides and 4 section overviews in dist/ for ${basePath}. No deployment performed.`,
);
