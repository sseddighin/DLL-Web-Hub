import { pages } from "./content.js";
import { diagrams } from "./diagrams.js";

const sections = {
  start: {
    slug: "get-started",
    name: "Get Started",
    caption: "Understand the tools and get ready.",
    symbol: "◈",
    accent: "#255799",
    soft: "#e7effa",
  },
  build: {
    slug: "build-your-website",
    name: "Build Your Website",
    caption: "Create a site or improve an existing one.",
    symbol: "⌘",
    accent: "#d6a000",
    soft: "#fff6d5",
  },
  publish: {
    slug: "publish-your-website",
    name: "Publish Your Website",
    caption: "Deploy and connect your website safely.",
    symbol: "◎",
    accent: "#3f9c35",
    soft: "#e9f6e8",
  },
  manage: {
    slug: "manage-troubleshoot",
    name: "Manage & Troubleshoot",
    caption: "Keep things working and find a safe way forward.",
    symbol: "⚒",
    accent: "#668f00",
    soft: "#f1f7e5",
  },
};
const app = document.getElementById("main-content");
const announcement = document.getElementById("announcement");
const pageById = new Map(pages.map((p) => [p.id, p]));
const bySlug = new Map(pages.map((p) => [p.slug, p.id]));
for (const [id, section] of Object.entries(sections))
  bySlug.set(section.slug, id);
const landingAliases = new Map(
  pages.filter((p) => p.landing).map((p) => [p.id, p.section]),
);
const modes = [
  ["do", "Do It"],
  ["understand", "Understand"],
  ["deep", "Go Deeper"],
];
const notes = new Map(); // Memory only: never sent, logged, or stored on disk.
const checks = new Map();
const openedSteps = new Map();
let state = { id: "home", view: "do", step: null };

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const plain = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent.replace(/\s+/g, " ").trim();
};

function route(id, view = "", step = "") {
  id = landingAliases.get(id) || id;
  const slug = sections[id]?.slug || pageById.get(id)?.slug || "";
  const params = new URLSearchParams();
  if (view && pageById.has(id)) params.set("view", view);
  if (step) params.set("step", step);
  return `#/${slug}${params.size ? "?" + params : ""}`;
}

function parseRoute(hash = location.hash) {
  let decoded;
  try {
    decoded = decodeURIComponent(hash.replace(/^#\/?/, ""));
  } catch {
    return { id: "missing", view: "do" };
  }
  const [slug, query = ""] = decoded.split("?");
  const params = new URLSearchParams(query);
  let id = slug
    ? bySlug.get(slug) ||
      (pageById.has(slug) || sections[slug] ? slug : "missing")
    : "home";
  id = landingAliases.get(id) || id;
  const defaultView = id === "GS-01" ? "understand" : "do";
  const view = modes.some(([m]) => m === params.get("view"))
    ? params.get("view")
    : defaultView;
  const step = /^\d+$/.test(params.get("step") || "")
    ? Number(params.get("step"))
    : null;
  return { id, view, step };
}

function link(id, text, view = "", step = "") {
  return `<a href="${route(id, view, step)}">${text}</a>`;
}

function crumbs(section, title = "") {
  return `<nav class="crumbs" aria-label="Breadcrumb">${link("home", "Home")}<span aria-hidden="true">›</span>${title ? link(section, esc(sections[section].name)) + '<span aria-hidden="true">›</span>' : ""}<span aria-current="page">${esc(title || sections[section].name)}</span></nav>`;
}

function searchBox() {
  return `<form class="search-form" role="search"><label class="sr-only" for="search">Search all guides</label><div class="searchbar"><span aria-hidden="true">⌕</span><input id="search" type="search" autocomplete="off" placeholder="What would you like help with?" aria-describedby="search-help"><button type="submit">Search</button></div><p id="search-help" class="sr-only">Search titles and all guidance. Enter at least two characters.</p></form><div id="searchResults"></div>`;
}

function home() {
  return `<div class="welcome"><h1>Welcome to DLL WebHub</h1><p>Everything you need to create, publish, and manage your DLL website. Start simple, or explore further whenever you want.</p></div>${searchBox()}<div class="quick" aria-label="Quick tasks">${link("start", "I'm new here")}${link("DESIGN-01", "Plan a website")}${link("BUILD-01", "Create a website")}${link("BUILD-02", "Update my website")}${link("PUBLISH-01", "Publish my website")}${link("manage", "Fix a problem")}</div><div class="eyeline">Explore the guide</div><div class="area-grid">${Object.entries(
    sections,
  )
    .map(
      ([id, s]) =>
        `<a class="area-card" href="${route(id)}" style="--accent:${s.accent};--soft:${s.soft}"><span class="ico" aria-hidden="true">${s.symbol}</span><h2>${s.name}</h2><p>${s.caption}</p></a>`,
    )
    .join("")}</div>`;
}

function tile(p) {
  return `<a class="tile" href="${route(p.id)}"><strong>${esc(p.title)}</strong><span>${esc(p.intro || "Open this guide")} →</span></a>`;
}

function area(id) {
  const s = sections[id];
  const guides = pages.filter(
    (p) => p.section === id && !p.landing && !p.id.startsWith("DESIGN-"),
  );
  return `${crumbs(id)}<section class="sectionpanel"><h1>${s.name}</h1><p class="lead">${s.caption} Choose what you need—there's no required order.</p>${id === "manage" ? searchBox() + '<div class="safety"><strong>Protect existing work.</strong> If a website or email service may be disrupted, pause and consult the authorized approver before changing DNS, deleting resources, or replacing deployed files.</div>' : ""}${id === "build" ? `<div class="design-entry"><h2>Before you build: shape the experience</h2><p>Explore your first ideas or develop a fuller design brief. Both paths are optional, and you can return to either as you learn.</p><div class="pathcards"><a href="${route("DESIGN-01")}"><span class="path-tag">Quick start</span><strong>Start Exploring</strong><span>Get your ideas moving with a short, interactive set of questions.</span><em>Start here →</em></a><a href="${route("DESIGN-02")}"><span class="path-tag">Deeper planning</span><strong>Develop Your Design Further</strong><span>Explore audience needs, structure, accessibility, interactions, and evaluation.</span><em>Explore the guide →</em></a></div><p class="skipline">Already have a design plan? ${link("BUILD-01", "Create a new website →")} · ${link("BUILD-02", "Update an existing website →")}</p></div>` : ""}${id === "manage" ? `<h2>Manage my website</h2><div class="tilegrid">${guides.slice(0, 4).map(tile).join("")}</div><h2>Solve a problem</h2><div class="tilegrid">${guides.slice(4).map(tile).join("")}</div>` : `<div class="tilegrid">${guides.map(tile).join("")}</div>`}<details class="section-overview"><summary>Explore this section's overview</summary><div class="reading">${pages.find((p) => p.section === id && p.landing)?.do || ""}</div></details></section>`;
}

function guidance(p) {
  const problem = /^MANAGE-0[5-9]$|^MANAGE-10$/.test(p.id);
  const available = modes.filter(([m]) => p[m]?.trim());
  if (!available.some(([m]) => m === state.view)) state.view = available[0][0];
  const useDiagram =
    state.view === "understand" ||
    (state.view === "do" &&
      [
        "DESIGN-01",
        "DESIGN-02",
        "BUILD-01",
        "PUBLISH-02",
        "MANAGE-05",
      ].includes(p.id));
  const body = `<div class="reading">${useDiagram ? diagrams[p.id] || "" : ""}${p[state.view]}</div>`;
  const safety = `<div class="safety"><strong>Keep control of publication.</strong> Preserve existing work, keep secrets out of prompts and GitHub, and obtain approval before public changes. ${link("GS-04", "Review the safety checks →")}</div>`;
  // Problem pages lead with diagnosis and offer optional context through native disclosures.
  const content = problem
    ? `<div class="reading diagnostic">${diagrams[p.id] || ""}${p.do}<h2>Need more context?</h2><details ${state.view === "understand" ? "open" : ""}><summary>Why this happens</summary>${p.understand}</details><details ${state.view === "deep" ? "open" : ""}><summary>Technical details</summary>${p.deep}</details><p>Still unsure? ${link("MANAGE-10", "Collect the facts and ask for help →")}</p></div>`
    : `<div class="modebar" role="tablist" aria-label="Depth of guidance">${available.map(([m, label]) => `<button id="tab-${m}" role="tab" aria-selected="${m === state.view}" aria-controls="guidance-panel" tabindex="${m === state.view ? 0 : -1}" data-view="${m}">${label}</button>`).join("")}</div><div id="guidance-panel" role="tabpanel" aria-labelledby="tab-${state.view}" tabindex="0">${body}</div>`;
  return `${crumbs(p.section, p.title)}<section class="sectionpanel"><h1>${esc(p.title)}</h1><p class="lead">${esc(p.intro || (problem ? "Start with safe checks, then follow the relevant recovery steps." : "Choose the guidance you need. Return to any step whenever it helps."))}</p>${content}${safety}<nav class="smallnav" aria-label="Related navigation">${link(p.section, `← All ${sections[p.section].name} guides`)}${link("home", "Home")}</nav></section>`;
}

function convertLinks() {
  app.querySelectorAll('a[href^="#"]').forEach((a) => {
    const old = a.getAttribute("href");
    if (old.startsWith("#/")) return;
    const parsed = parseRoute(old);
    if (parsed.id !== "missing")
      a.href = route(
        parsed.id,
        old.includes("view=") ? parsed.view : "",
        parsed.step || "",
      );
  });
}

function makeSteps() {
  const reading = app.querySelector(".reading");
  if (!reading) return;
  const headers = [...reading.querySelectorAll("h3,h4")].filter((h) =>
    /^Step \d+[.\s—]/.test(h.textContent),
  );
  if (!headers.length) return;
  const progress = document.createElement("p");
  progress.className = "step-count";
  progress.textContent = `${headers.length} steps · Expand any step to read its instructions. Opening a step does not complete it.`;
  headers[0].before(progress);
  headers.forEach((header, index) => {
    const number = index + 1;
    const details = document.createElement("details");
    details.className = "guide-step";
    details.id = `step-${number}`;
    const summary = document.createElement("summary");
    summary.textContent = header.textContent;
    const panel = document.createElement("div");
    panel.className = "step-content";
    let next = header.nextSibling;
    const stop = headers[index + 1];
    while (next && next !== stop) {
      const node = next;
      next = next.nextSibling;
      panel.append(node);
    }
    details.append(summary, panel);
    header.replaceWith(details);
    const key = `${state.id}:${state.view}:${number}`;
    details.open = state.step
      ? state.step === number
      : (openedSteps.get(key) ?? number === 1);
    details.addEventListener("toggle", () =>
      openedSteps.set(key, details.open),
    );
  });
}

async function copyText(text, button) {
  const original = button.textContent;
  try {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.className = "clipboard-fallback";
      textarea.setAttribute("aria-label", "Text to copy");
      document.body.append(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      textarea.remove();
      button.focus();
      if (!success) throw new Error("Copy unavailable");
    }
    button.textContent = "Copied ✓";
    announcement.textContent = "Copied to clipboard.";
    setTimeout(() => {
      if (button.isConnected) button.textContent = original;
    }, 1800);
  } catch {
    announcement.textContent =
      "Copy is unavailable. Select the text and copy it using your browser.";
    const fallback = document.createElement("textarea");
    fallback.value = text;
    fallback.readOnly = true;
    fallback.className = "copy-manual";
    fallback.setAttribute("aria-label", "Select and copy this text");
    button.after(fallback);
    fallback.focus();
    fallback.select();
  }
}

function makeCopyButtons() {
  app.querySelectorAll(".reading pre").forEach((pre, index) => {
    pre.tabIndex = 0;
    pre.setAttribute("aria-label", `Prompt ${index + 1} text`);
    const wrapper = document.createElement("div");
    wrapper.className = "promptwrap";
    pre.before(wrapper);
    wrapper.append(pre);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = "Copy Codex prompt / code";
    button.setAttribute("aria-label", `Copy prompt ${index + 1}`);
    button.addEventListener("click", () =>
      copyText(pre.textContent.trim(), button),
    );
    wrapper.append(button);
  });
}

const questions = [
  ["audience", "Who is this for?", "E.g. lab members new to website tools"],
  [
    "purpose",
    "What should visitors be able to do?",
    "E.g. find projects and contact the team",
  ],
  [
    "journey",
    "What is their most important journey?",
    "E.g. arrive → understand → explore → contact",
  ],
  [
    "structure",
    "What pages or sections are needed?",
    "E.g. Home, Projects, Team, Contact",
  ],
  [
    "direction",
    "What should it look and feel like?",
    "Brand colors, type, tone, examples, accessibility",
  ],
  [
    "success",
    "How will you know it works?",
    "E.g. a new visitor finds a project in two clicks",
  ],
  [
    "requirements",
    "Any special requirements?",
    "Forms, privacy, integrations, domain, mobile, approvals",
  ],
];
function mountBrief() {
  const el = document.getElementById("brief-builder");
  if (!el) return;
  el.innerHTML = `<p class="briefnotice">Keep private information and credentials out of these notes. Notes remain in this tab while you browse; reloading or closing it clears them. Nothing is submitted.</p><div class="briefgrid">${questions.map(([id, label, placeholder]) => `<div class="brief-field"><label for="brief-${id}">${label}</label><textarea id="brief-${id}" data-brief="${id}" rows="2" placeholder="${placeholder}">${esc(notes.get(id) || "")}</textarea></div>`).join("")}</div><button class="briefcopy" type="button">Copy my design starting point</button>`;
  el.addEventListener("input", (event) => {
    if (event.target.dataset.brief)
      notes.set(event.target.dataset.brief, event.target.value);
  });
  el.querySelector("button").addEventListener("click", (event) => {
    const text =
      "DLL Website Design Starting Point (initial ideas, not a finished design brief)\n\n" +
      questions
        .map(
          ([id, label]) =>
            `${label}\n${notes.get(id)?.trim() || "Not decided yet"}`,
        )
        .join("\n\n") +
      "\n\nThese are initial ideas, not a complete design specification. Help me identify gaps and questions, and suggest what to explore before creating an implementation plan. Do not build or publish anything yet.";
    copyText(text, event.target);
  });
}

const searchIndex = pages
  .filter((p) => !p.landing)
  .map((p) => ({
    page: p,
    fields: modes.map(([view]) => ({
      view,
      text: plain(p[view] + (diagrams[p.id] || "")),
    })),
  }));
function matchingStep(page, view, words) {
  if (view !== "do") return "";
  const doc = new DOMParser().parseFromString(page.do, "text/html");
  const headings = [...doc.querySelectorAll("h3,h4")].filter((h) =>
    /^Step \d+[.\s—]/.test(h.textContent),
  );
  for (let index = 0; index < headings.length; index++) {
    let node = headings[index];
    let text = "";
    while (node && node !== headings[index + 1]) {
      text += " " + node.textContent;
      node = node.nextSibling;
    }
    if (words.every((w) => text.toLowerCase().includes(w)))
      return String(index + 1);
  }
  return "";
}
function search(query) {
  const target = document.getElementById("searchResults");
  if (!target) return;
  const q = query.trim().toLocaleLowerCase();
  if (q.length < 2) {
    target.replaceChildren();
    announcement.textContent = q
      ? "Enter at least two characters to search."
      : "";
    return;
  }
  const words = q.split(/\s+/);
  const hits = searchIndex
    .flatMap(({ page, fields }) => {
      const titleMatch = words.every((w) =>
        page.title.toLowerCase().includes(w),
      );
      const field = fields.find((f) =>
        words.every((w) => f.text.toLowerCase().includes(w)),
      );
      if (!titleMatch && !field) return [];
      const text = field?.text || plain(page.do);
      const at = text.toLowerCase().indexOf(words[0]);
      const start = Math.max(0, at - 50);
      const view = field?.view || "do";
      return [
        {
          page,
          view,
          step: matchingStep(page, view, words),
          score: titleMatch ? 1 : 0,
          snippet:
            (start ? "…" : "") +
            text.slice(start, start + 170) +
            (text.length > start + 170 ? "…" : ""),
        },
      ];
    })
    .sort((a, b) => b.score - a.score);
  announcement.textContent = `${hits.length} ${hits.length === 1 ? "guide matches" : "guides match"} your search.`;
  target.innerHTML = `<section class="search-results" aria-label="Search results"><p>${hits.length} ${hits.length === 1 ? "guide" : "guides"} found</p>${hits.length ? hits.map(({ page, view, step, snippet }) => `<a class="resultrow" href="${route(page.id, view, step)}"><strong>${esc(page.title)}</strong><small>${esc(sections[page.section].name)}</small><span>${esc(snippet)}</span></a>`).join("") : "<p>No matches. Try “branch”, “domain”, “deploy”, or “update”.</p>"}</section>`;
}

function enhance() {
  convertLinks();
  makeSteps();
  makeCopyButtons();
  mountBrief();
  // Keep the approved heading appearance while giving the document a valid outline.
  let level = 0;
  app.querySelectorAll("h1,h2,h3,h4").forEach((heading) => {
    const wanted = Number(heading.tagName.slice(1));
    const next = Math.min(wanted, level + 1);
    if (wanted !== next) {
      const replacement = document.createElement(`h${next}`);
      for (const attr of heading.attributes)
        replacement.setAttribute(attr.name, attr.value);
      replacement.classList.add(`heading-${wanted}`);
      replacement.innerHTML = heading.innerHTML;
      heading.replaceWith(replacement);
    }
    level = next;
  });
  app.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
    const key = `${state.id}:${state.view}:${index}`;
    checkbox.checked = checks.get(key) || false;
    checkbox.addEventListener("change", () =>
      checks.set(key, checkbox.checked),
    );
  });
  app.querySelectorAll('form[role="search"]').forEach((form) => {
    const input = form.querySelector("input");
    input.addEventListener("input", () => search(input.value));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      search(input.value);
    });
  });
}

function render({ focus = false, tabFocus = false } = {}) {
  const page = pageById.get(state.id);
  app.innerHTML =
    state.id === "home"
      ? home()
      : sections[state.id]
        ? area(state.id)
        : page
          ? guidance(page)
          : `<section class="sectionpanel"><h1>Guide not found</h1><p>This link does not match a guide. ${link("home", "Return home to browse or search.")}</p></section>`;
  enhance();
  document.title = `${page?.title || sections[state.id]?.name || (state.id === "home" ? "Interactive Guide" : "Guide not found")} | DLL WebHub`;
  const activeSection = page?.section || state.id;
  document.querySelectorAll(".primary-nav a").forEach((a) => {
    if (parseRoute(a.hash).id === activeSection)
      a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  if (tabFocus) app.querySelector(`[data-view="${state.view}"]`)?.focus();
  else if (focus) {
    const title = app.querySelector("h1");
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  if (state.step) {
    const step = document.getElementById(`step-${state.step}`);
    if (step) {
      step.open = true;
      step.querySelector("summary").focus();
      step.scrollIntoView({ block: "start" });
    }
  }
}

function changeView(view) {
  history.replaceState(null, "", route(state.id, view));
  state = { ...state, view, step: null };
  render({ tabFocus: true });
}
app.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-view]");
  if (tab) changeView(tab.dataset.view);
});
app.addEventListener("keydown", (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
    return;
  event.preventDefault();
  const tabs = [...app.querySelectorAll('[role="tab"]')];
  let index = tabs.indexOf(tab);
  if (event.key === "Home") index = 0;
  else if (event.key === "End") index = tabs.length - 1;
  else
    index =
      (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
      tabs.length;
  changeView(tabs[index].dataset.view);
});
document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#/"]');
  if (
    anchor &&
    anchor.hash === location.hash &&
    !event.ctrlKey &&
    !event.metaKey
  ) {
    event.preventDefault();
    render({ focus: true });
  }
});
window.addEventListener("hashchange", () => {
  if (location.hash === "#main-content") {
    app.focus();
    return;
  }
  state = parseRoute();
  render({ focus: true });
});
state = parseRoute();
render();
