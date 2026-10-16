import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";

const require = createRequire(import.meta.url);
const pages = JSON.parse(fs.readFileSync("src/content/pages.json", "utf8"));
const guides = pages.filter((p) => !p.landing);
const problems = (p) => /^MANAGE-0[5-9]$|^MANAGE-10$/.test(p.id);
const route = (p, view = "do") => `/#/${p.slug}?view=${view}`;

test("GitHub Pages project path serves application assets and keeps navigation under the repository", async ({
  page,
  request,
}) => {
  const prefix = "/DLL-Web-Hub/";
  const assets = [];
  const failures = [];
  page.on("request", (r) => {
    if (["script", "stylesheet", "font", "image"].includes(r.resourceType()))
      assets.push(new URL(r.url()).pathname);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(`${prefix}#/how-dll-websites-work?view=understand`);
  await expect(page.locator("h1")).toHaveText("How DLL websites work");
  await expect(page.locator("base")).toHaveAttribute("href", prefix);
  await openDetails(page);
  await page.locator("img").evaluateAll(async (imgs) => {
    await Promise.all(
      imgs.map(async (img) => {
        img.loading = "eager";
        await img.decode();
      }),
    );
  });
  await page.evaluate(() => document.fonts.ready);
  expect(assets.length).toBeGreaterThan(5);
  expect(assets.every((p) => p.startsWith(prefix))).toBe(true);
  expect(failures).toEqual([]);
  await page
    .getByRole("link", { name: "Build Your Website", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: /Start Exploring/ }).click();
  await expect(page).toHaveURL(/\/DLL-Web-Hub\/#\/start-exploring/);
  await page.reload();
  await expect(
    page.getByLabel("Who is this for?", { exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("Build Your Website");
  for (const resource of [
    "app.js",
    "styles.css",
    "content.js",
    "diagrams.js",
    "assets/tool-workflow.png",
    "assets/fonts/montserrat-latin-700-normal.woff2",
  ]) {
    expect((await request.get(prefix + resource)).status(), resource).toBe(200);
  }
  for (const resource of [
    "README.md",
    "docs/coverage-check.md",
    ".git/config",
    "src/index.html",
  ]) {
    expect((await request.get(prefix + resource)).status(), resource).toBe(404);
  }
});

async function openDetails(page) {
  await page.locator("details").evaluateAll((nodes) =>
    nodes.forEach((n) => {
      n.open = true;
    }),
  );
}
async function audit(page) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  return page.evaluate(async () => {
    await document.fonts.ready;
    const results = await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
      },
    });
    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        html: n.html.slice(0, 200),
        failure: n.failureSummary,
      })),
    }));
  });
}

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`${viewport.name}: every guide, view, link, image, and accessibility scan`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const errors = [],
      failed = [],
      requests = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    page.on("request", (r) => {
      if (!r.url().startsWith("http://127.0.0.1:4173")) requests.push(r.url());
    });
    for (const target of [
      "/",
      "/#/get-started",
      "/#/build-your-website",
      "/#/publish-your-website",
      "/#/manage-troubleshoot",
    ]) {
      await page.goto(target);
      await expect(page.locator("h1")).toHaveCount(1);
      await openDetails(page);
      expect(await audit(page), target).toEqual([]);
    }
    for (const guide of guides) {
      for (const view of problems(guide)
        ? ["do"]
        : ["do", "understand", "deep"]) {
        await page.goto(route(guide, view));
        await expect(page.locator("h1")).toHaveText(guide.title);
        await openDetails(page);
        await page.locator("img").evaluateAll(async (imgs) => {
          await Promise.all(
            imgs.map(async (img) => {
              img.loading = "eager";
              try {
                await img.decode();
              } catch {
                /* Broken images fail the assertion below. */
              }
            }),
          );
        });
        const text = await page.locator("main").innerText();
        expect(text).not.toMatch(
          /\b(?:GS|BUILD|PUBLISH|MANAGE)-\d+\b|the manual|source.manual|source.added|Relevant source|Page introduction:|Interaction note:|side-by-side evaluation/i,
        );
        expect(
          await page
            .locator("main a")
            .evaluateAll((links) =>
              links
                .filter(
                  (a) =>
                    !a.getAttribute("href") ||
                    a.getAttribute("href") === "#" ||
                    (a.hash && !a.hash.startsWith("#/")),
                )
                .map((a) => a.outerHTML),
            ),
        ).toEqual([]);
        expect(
          await page
            .locator("img")
            .evaluateAll((imgs) =>
              imgs
                .filter((i) => !i.alt || !i.complete || !i.naturalWidth)
                .map((i) => i.outerHTML),
            ),
        ).toEqual([]);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${guide.id} ${view} overflow`,
        ).toBe(true);
        expect(await audit(page), `${guide.id} ${view}`).toEqual([]);
      }
    }
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
    expect(requests).toEqual([]);
  });
}

test("navigation history, direct links, specific steps, keyboard tabs and disclosures", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page
    .getByRole("link", { name: "Build Your Website", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: /Start Exploring/ }).click();
  await expect(page.locator("h1")).toHaveText(
    "Start Exploring: Shape Your Website Idea",
  );
  await page.getByRole("tab", { name: "Do It", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Understand", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("tab", { name: "Understand", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Go Deeper", exact: true }),
  ).toBeFocused();
  await page.reload();
  await expect(
    page.getByRole("tab", { name: "Go Deeper", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("link", { name: "Build Your Website", exact: true })
    .first()
    .click();
  await page.goBack();
  await expect(page.locator("h1")).toHaveText(
    "Start Exploring: Shape Your Website Idea",
  );
  await page.goForward();
  await expect(page.locator("h1")).toHaveText("Build Your Website");
  await page.goto("/#BUILD-03");
  await page
    .getByRole("link", {
      name: "Protect unfinished work and prepare a safe branch",
    })
    .click();
  await expect(page.locator("#step-2")).toHaveAttribute("open", "");
  await expect(page.locator("#step-2 summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#step-2")).not.toHaveAttribute("open", "");
  await page.goto("/#/%E0%A4%A");
  await expect(page.locator("h1")).toHaveText("Guide not found");
  await page.goto("/#/unknown-guide");
  await expect(page.getByRole("link", { name: /Return home/ })).toBeVisible();
});

test("search covers every depth, handles empty and hostile input, and opens matching guides", async ({
  page,
}) => {
  await page.goto("/");
  const input = page.getByRole("searchbox");
  await input.fill("authoritative versus cached");
  const result = page.locator("#searchResults a").first();
  await expect(result).toContainText("Move an Existing Website");
  await result.click();
  await expect(
    page.getByRole("tab", { name: "Go Deeper", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".reading")).toContainText(
    "authoritative versus cached DNS",
  );
  await page.goto("/");
  await input.fill("branch");
  await expect(page.locator("#searchResults a")).not.toHaveCount(0);
  await input.fill("zzzznevermatch");
  await expect(page.locator("#searchResults")).toContainText("No matches");
  await input.fill("<img src=x onerror=alert(1)>");
  await expect(page.locator("#searchResults img")).toHaveCount(0);
  await input.fill("");
  await expect(page.locator("#searchResults")).toBeEmpty();
  await input.fill("domain");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/$/);
});

test("all internal destinations resolve and all copied prompt templates remain available", async ({
  page,
}) => {
  const destinations = new Set();
  for (const section of [
    "/",
    "/#/get-started",
    "/#/build-your-website",
    "/#/publish-your-website",
    "/#/manage-troubleshoot",
  ]) {
    await page.goto(section);
    for (const href of await page
      .locator("main a")
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href"))
          .filter((h) => h.startsWith("#/")),
      ))
      destinations.add(href);
  }
  for (const guide of guides) {
    for (const view of problems(guide)
      ? ["do"]
      : ["do", "understand", "deep"]) {
      await page.goto(route(guide, view));
      await openDetails(page);
      for (const href of await page
        .locator("main a")
        .evaluateAll((links) =>
          links
            .map((a) => a.getAttribute("href"))
            .filter((h) => h.startsWith("#/")),
        ))
        destinations.add(href);
    }
  }
  for (const href of destinations) {
    await page.goto("/" + href);
    await expect(page.locator("h1")).not.toHaveText("Guide not found");
  }
  for (const guide of guides)
    expect(destinations.has(`#/${guide.slug}`), guide.id).toBe(true);
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#BUILD-02");
  await openDetails(page);
  const expected = await page.locator("pre").first().textContent();
  await page
    .getByRole("button", { name: "Copy prompt 1", exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    expected.trim(),
  );
});

test("both design paths, note retention, copy output, checklists and keyboard focus", async ({
  page,
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#DESIGN-01");
  await page
    .getByLabel("Who is this for?", { exact: true })
    .fill("New lab members");
  await page
    .getByLabel("What should visitors be able to do?", { exact: true })
    .fill("Find a project");
  await page
    .getByRole("button", { name: "Copy my design starting point" })
    .click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("New lab members");
  expect(copied).toContain("Do not build or publish anything yet.");
  await page.getByRole("tab", { name: "Understand", exact: true }).click();
  await page.getByRole("tab", { name: "Do It", exact: true }).click();
  await expect(
    page.getByLabel("Who is this for?", { exact: true }),
  ).toHaveValue("New lab members");
  await page
    .getByRole("link", { name: "Develop Your Design Further", exact: true })
    .first()
    .click();
  await expect(page.locator("h1")).toHaveText("Develop Your Design Further");
  await expect(
    page.getByRole("heading", { name: "8. Review your concept before coding" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Return to the idea starter →" })
    .click();
  await expect(
    page.getByLabel("Who is this for?", { exact: true }),
  ).toHaveValue("New lab members");
  await page.goto("/#GS-02");
  await page
    .getByRole("checkbox", { name: "ChatGPT account with access to Codex" })
    .check();
  await page.getByRole("tab", { name: "Go Deeper", exact: true }).click();
  await page.getByRole("tab", { name: "Do It", exact: true }).click();
  await expect(
    page.getByRole("checkbox", {
      name: "ChatGPT account with access to Codex",
    }),
  ).toBeChecked();
});

test("all 35 approved prompt instances retain their text and copy accurately", async ({
  page,
}) => {
  const expected = JSON.parse(
    fs.readFileSync("tests/fixtures/approved-prompt-hashes.json", "utf8"),
  );
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  let count = 0;
  for (const [id, hashes] of Object.entries(expected)) {
    await page.goto(route(pages.find((p) => p.id === id)));
    await openDetails(page);
    const prompts = page.locator("pre");
    await expect(prompts).toHaveCount(hashes.length);
    for (let index = 0; index < hashes.length; index++) {
      const text = (await prompts.nth(index).textContent()).trim();
      const normalized = text.replaceAll("’", "'").replace(/\s+/g, " ").trim();
      expect(
        createHash("sha256").update(normalized).digest("hex"),
        `${id} prompt ${index + 1}`,
      ).toBe(hashes[index]);
      await page
        .getByRole("button", { name: `Copy prompt ${index + 1}`, exact: true })
        .click();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        text,
      );
      count++;
    }
  }
  expect(count).toBe(35);
});

test("build output excludes internal material and local server rejects private paths", async ({
  request,
}) => {
  const walk = (dir) =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((e) =>
        e.isDirectory()
          ? walk(path.join(dir, e.name))
          : [path.join(dir, e.name)],
      );
  const files = walk("dist");
  expect(
    files.some((f) => /coverage|INTERNAL|\.pdf$|\.md$|prototype/i.test(f)),
  ).toBe(false);
  for (const resource of [
    "/docs/coverage-check.md",
    "/reference/original_technical_guide_INTERNAL.pdf",
    "/src/content/pages.json",
    "/.git/config",
  ])
    expect((await request.get(resource)).status()).toBe(404);
});

test("320px reflow, reduced motion, and visual review captures", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const target of ["/", "/#GS-01", "/#DESIGN-01", "/#PUBLISH-02"]) {
    await page.goto(target);
    await openDetails(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      target,
    ).toBe(true);
  }
  for (const size of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(size);
    for (const [name, target] of [
      ["home", "/"],
      ["build", "/#/build-your-website"],
      ["workflow", "/#GS-01"],
      ["design", "/#DESIGN-01"],
      ["migration", "/#PUBLISH-02"],
    ]) {
      await page.goto(target);
      await page.evaluate(() => document.fonts.ready);
      if (name === "workflow")
        await page
          .locator(".scenario-row details")
          .first()
          .evaluate((n) => {
            n.open = true;
          });
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${size.width}.png`),
        fullPage: true,
      });
    }
  }
});
