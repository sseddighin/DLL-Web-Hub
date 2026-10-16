const visualCard = (icon, title, desc, kind = "") =>
  `<div class="viz-node ${kind}"><span class="sym" aria-hidden="true">${icon}</span><strong>${title}</strong><small>${desc}</small></div>`;
const visualFlow = (title, desc, nodes, foot = "", guard = "", returnTo = "") =>
  `<div class="viz" aria-label="${title}"><h3>${title}</h3><p class="viz-desc">${desc}</p><div class="viz-lane">${nodes.map((n, i) => (i ? '<span class="viz-arrow" aria-hidden="true">→</span>' : "") + visualCard(...n)).join("")}</div>${returnTo ? `<div class="loopback"><span aria-hidden="true">↶</span><strong>${returnTo}</strong></div>` : ""}${foot ? `<p class="viz-foot">${foot}</p>` : ""}${guard ? `<div class="viz-guard">${guard}</div>` : ""}</div>`;
const lifecycle = `<div class="viz lifecycle" aria-label="Iterative website design, development, approval, publishing and improvement cycle"><h3>How a DLL website really comes to life</h3><p class="viz-desc">A website is shaped through repeated decisions, testing and improvements—not a one-time trip through three tools.</p>
<div class="cycle-grid">
  <div class="cycle-node design"><span class="cycle-kicker">1 · THINK & PLAN</span><strong>People + design brief</strong><small>Who is it for? What should visitors do? Plan the content and experience.</small></div>
  <div class="cycle-node code"><span class="cycle-kicker">2 · CREATE & REFINE</span><strong>Codex + your feedback</strong><small>Draft changes in a working branch. Inspect the result, test, revise and repeat.</small></div>
  <div class="cycle-node review"><span class="cycle-kicker">3 · REVIEW & APPROVE</span><strong>GitHub + human reviewer</strong><small>Commit, push and open a pull request. Review changes and checks before merging.</small></div>
  <div class="cycle-node live"><span class="cycle-kicker">4 · PUBLISH & VERIFY</span><strong>Cloudflare + live website</strong><small>Deploy the approved production branch; check the actual site and its features.</small></div>
</div>
<div class="cycle-actions"><div class="cycle-feedback"><span aria-hidden="true">↶</span><strong>Not ready?</strong> Return to Codex to revise, then preview and review again.</div><div class="cycle-feedback"><span aria-hidden="true">↻</span><strong>New need or issue?</strong> Feed what you learn back into planning and the next change.</div></div>
<div class="viz-guard"><strong>Important:</strong> Codex helps with code; it does not approve publication. GitHub stores the source and review history. Cloudflare deploys from the configured production branch when the project is set up for that workflow. Publication and verification still require people.</div></div>`;

const ecosystemComparison = `<section class="eco" aria-label="Important distinctions and real-world examples for Codex, GitHub, and Cloudflare">
<div class="reality"><strong>Important distinction:</strong> You can go back to any part of your process, but the tools are not all directly synchronized. For the standard DLL workflow, publication requires an approved GitHub change merged into the configured production branch, a successful deployment, and a person verifying the live result.</div>
<h4 style="margin:22px 0 8px;color:#002244">See how it works in real situations</h4>
<div class="scenario-row">
<details><summary>✏️ Create a new page</summary><p>Plan the page → use Codex to create and test it → commit the work in GitHub → open a pull request → respond to review comments (often back in Codex) → merge after approval → Cloudflare deploys if configured → verify the public page.</p></details>
<details><summary>🪲 Fix a live-site problem</summary><p>Identify the problem on the live site → inspect Cloudflare deployment status and GitHub source as appropriate → diagnose and correct it in Codex → test → review and merge the correction in GitHub → deploy and verify again.</p></details>
<details><summary>💡 Try a design idea</summary><p>Explore an idea in Codex → test and preview it → revise the design, or ask for GitHub review → continue iterating. A draft or preview does not have to become a public release.</p></details>
<details><summary>↶ Undo an approved change</summary><p>Identify the faulty merged commit in GitHub → prepare a targeted revert → review and test it → obtain approval → merge the revert → Cloudflare redeploys the corrected production branch if configured → verify the website.</p></details>
</div>
<details class="original"><summary>Explore the illustrated workflow</summary><p style="font-size:13px;color:#4d6177">Explore each tool’s role in this illustration. Follow the review and approval checkpoints above; automatic deployment depends on the project’s settings. A rollback uses a reviewed GitHub revert, not a history reset.</p><img src="./assets/tool-workflow.png" alt="Expanded infographic comparing Codex, GitHub and Cloudflare: each tool's responsibilities, reasons to move between them and four practical website scenarios." loading="lazy"></details>
<p class="compare">These examples complement the website-creation visual above and show how the workflow changes in different real situations.</p>
</section>`;
const designCycle = `<div class="viz"><h3>Design and development inform each other</h3><p class="viz-desc">Flow A and Flow B are connected feedback loops, not two courses you must complete only once.</p><div class="viz-dual"><div><strong>Flow A · Design the experience</strong><p>Understand people and needs → define goals → plan content and journeys → sketch and evaluate → revise the design brief.</p><p class="loopmini">↻ Feedback may change the audience journey, structure or interaction design.</p></div><div><strong>Flow B · Build, review and publish</strong><p>Use the brief → create with Codex → test → review in GitHub → deploy approved work through Cloudflare → verify the live result.</p><p class="loopmini">↻ Testing may send you back to the code <em>or</em> to Flow A.</p></div></div><div class="viz-guard">A design brief guides building; real-world feedback can lead to a revised brief and a new development cycle.</div></div>`;
const migrationDiagram = `<div class="viz"><h3>Moving an existing site: two coordinated tracks</h3><p class="viz-desc">Moving hosting and transferring DNS authority are distinct steps. The existing live site must remain available during preparation.</p><div class="viz-dual"><div><strong>Track A · Site and hosting</strong><p>Audit existing site → prepare Cloudflare-compatible version → test at temporary address → compare with current site.</p><p class="loopmini">↻ Fix differences and retest before cutover.</p></div><div><strong>Track B · Domain and DNS</strong><p>Inventory all DNS, email and verification records → add domain in Cloudflare → compare records → approved nameserver change → verify services.</p><p class="loopmini">↻ Resolve missing/conflicting records before proceeding.</p></div></div><div class="cycle-check">Only after <strong>both tracks</strong> pass checks: approve custom-domain cutover → verify website, HTTPS, forms, email, subdomains and integrations.</div><div class="viz-guard">Keep the old host and rollback plan available until the owner approves the migration and the new site is stable. DNS changes can interrupt services beyond the website.</div></div>`;
const recoveryDiagram = `<div class="viz"><h3>Recovery stays inside the normal GitHub workflow</h3><div class="viz-lane">${[
  ["🔎", "Identify", "Find the faulty merged change"],
  ["↶", "Prepare revert", "Reverse only that change", "gold"],
  ["✅", "Test + approve", "Review before merging"],
  ["☁", "Redeploy", "Cloudflare publishes approved source", "green"],
]
  .map(
    (n, i) =>
      (i ? '<span class="viz-arrow" aria-hidden="true">→</span>' : "") +
      visualCard(...n),
  )
  .join(
    "",
  )}</div><div class="loopback"><span aria-hidden="true">↻</span><strong>If the revert is wrong or checks fail, correct it and test again before approval.</strong></div><div class="viz-guard">Never create an independent manual production copy; keep GitHub and the live deployment synchronized.</div></div>`;
const diagrams = {
  "GS-01": lifecycle + ecosystemComparison,
  "DESIGN-01": visualFlow(
    "Your initial ideas are meant to evolve",
    "Use these questions to get started; return to them as you discover new information.",
    [
      ["👥", "Audience", "Who needs this?"],
      ["🎯", "Purpose", "What should they accomplish?", "gold"],
      ["🧭", "Journey", "How will they get there?"],
      ["🗒", "Starting point", "Questions for deeper design", "green"],
    ],
    "Take the next step with a more complete design brief.",
    "",
    "Refine your answers after talking with users or testing your ideas.",
  ),
  "DESIGN-02": designCycle,
  "BUILD-01": visualFlow(
    "Create, review and improve before going live",
    "The design brief guides the build, but the draft can change as it is tested.",
    [
      ["🗒", "Design brief", "Purpose, visitors, content"],
      ["✦", "Codex", "Build and revise", "gold"],
      ["🔍", "Preview", "Test pages and features"],
      ["⑂", "GitHub", "Review and approve", "green"],
    ],
    "The approved branch can then be connected to Cloudflare in the publishing guide.",
    "Changes are not public merely because Codex created them.",
    "If testing or review finds a problem, return to Codex and test again.",
  ),
  "BUILD-02": visualFlow(
    "Updating a website is a repeatable cycle",
    "Start from the correct repository and preserve any unfinished work.",
    [
      ["⑂", "GitHub", "Confirm source and make branch"],
      ["✦", "Codex", "Edit and preview", "gold"],
      ["✅", "Review PR", "Test; approve and merge"],
      ["☁", "Cloudflare", "Deploy and verify live", "green"],
    ],
    "Each future update starts another cycle from the approved source.",
    "Production deploys from the configured approved branch; other branches may have preview builds.",
    "If review or testing fails, revise the working branch and recheck.",
  ),
  "PUBLISH-01": visualFlow(
    "Publishing a new website",
    "Cloudflare deployment and the public domain are separate approvals.",
    [
      ["⑂", "GitHub", "Approved production source"],
      ["☁", "Cloudflare", "Configure build and test", "gold"],
      ["🔎", "Temporary URL", "Verify before domain"],
      ["🌐", "Official domain", "Connect and verify", "green"],
    ],
    "After release, new revisions return through Codex, pull request and approved production branch.",
    "For a new root domain, domain approval, DNS setup and certificate readiness are additional requirements.",
    "If a test fails, fix and test before connecting the official domain.",
  ),
  "PUBLISH-02": migrationDiagram,
  "PUBLISH-03": visualFlow(
    "Publishing an approved change",
    "The live site must reflect the reviewed GitHub commit.",
    [
      ["✅", "PR approval", "Review and checks"],
      ["⑂", "Merge", "Into production branch", "gold"],
      ["☁", "Deploy", "Automatic if configured"],
      ["👀", "Verify", "Check domain and features", "green"],
    ],
    "New changes start the same review and release cycle again.",
    "A successful build is not the same as a completed human live-site check.",
    "If checks fail, stop and correct the change before publishing.",
  ),
  "MANAGE-05": visualFlow(
    "Find where an update stopped",
    "Diagnose the stage rather than guessing or republishing everything.",
    [
      ["✦", "Codex", "Were changes saved?"],
      ["⑂", "GitHub", "Was PR merged to production?", "gold"],
      ["☁", "Cloudflare", "Was production deployment successful?"],
      ["🌐", "Live site", "Right commit, domain and content?", "green"],
    ],
    "Once you find the failing stage, follow its focused guide, correct it and recheck.",
    "",
    "If a step fails, investigate that stage; do not bypass reviews or manually replace production files.",
  ),
  "MANAGE-06": visualFlow(
    "When deployment fails: stop, investigate, retry",
    "Use error evidence to determine the next safe action.",
    [
      ["🛑", "Stop", "Protect existing work"],
      ["📋", "Inspect", "Read error and logs", "gold"],
      ["🧠", "Plan fix", "Explain proposed changes"],
      ["✅", "Approve", "Fix, test, review", "green"],
    ],
    "Only then retry the approved publishing workflow.",
    "",
    "If the problem remains, repeat the diagnosis; do not force-push or disconnect the repository.",
  ),
  "MANAGE-07": recoveryDiagram,
};

export { diagrams };
