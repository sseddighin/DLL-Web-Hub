# Maintainer coverage and validation record

This is a maintainer document, not website content. The build's explicit allowlist excludes `docs/`, uploaded documents, the internal PDF, test fixtures, and the prototype. “Private” here means excluded from the public site; repository readers can still read this file. No private account-owner address or personal support contact is reproduced here.

## Basis and scope

Reviewed all 18 pages of the supplied internal technical guide, all four drafted sections, the content blueprint, and the approved v13 HTML. The prototype takes precedence for visual and interaction choices. Guide keys below are maintainer identifiers only; visitors see descriptive titles and readable routes.

The site has four section overviews and 22 guides: 4 Get Started, 2 design-planning, 3 Build, 3 Publish, and 10 Manage guides. Neither design-planning path is a prerequisite. The retained first lifecycle visual, gold cautions, dark-blue exploration area, scenarios, and approved illustration distinguish iteration from publication authority. The rejected Option B graphic is not added.

## Original guide coverage

| Original section / pages | WebHub destinations and retained substance |
| --- | --- |
| Website identity and per-site ownership, p. 1 | GS-01, GS-03, MANAGE-04: separate repository and uniquely named project, documented branch and hostnames, owner/approver; WRITE AI values remain clearly marked examples. |
| Before working on any site, pp. 1–2 | GS-02: Codex and desktop-app access, personal GitHub/Cloudflare accounts, contributor/member permissions, registrar access when needed, owner approval, inventory of connected services, tool inspection and approval before installing/sign-in. |
| Rules for every website, p. 2 | GS-04 and contextual safety strips: authoritative GitHub source, reviewed branch/PR, preserve collaborators, no independent production copy, protected secrets, individual logins/MFA, DNS/email protection, preview/testing, complete live checks and human signoff, records and reviewed reverts. |
| Moving hosting versus moving DNS, p. 3 | PUBLISH-02 introduction and two-track diagram; MANAGE-08: full-domain DNS impact and non-web service protection. |
| Gather migration information, p. 3 | PUBLISH-02 step 1: host, registrar, every domain/subdomain, source, branch, DNS/nameservers, MX/SPF/DKIM/DMARC, forms, databases, analytics, redirects, scheduled jobs, secret names, authorized approver. Unknowns escalate to authorized DLL IT; keep old hosting. |
| Audit an existing website, pp. 3–4 | PUBLISH-02 step 2: complete read-only audit prompt, framework/runtime/build/server-side requirements, public hostnames, risk/access/DNS/rollback plan, owner review. |
| Repository preparation when none exists, p. 4 | PUBLISH-02 step 2: dedicated approved-organization repository, exclude sensitive files, proposal and approval before creation/upload. |
| Prepare website for Cloudflare, pp. 4–5 | PUBLISH-02 step 3: prefer compatible Workers without needless framework changes; preserve appearance, URLs, metadata, redirects, forms, accessibility and SEO; minimum config, secrets excluded, separate branch, local checks and comparison, no push/deploy/DNS changes. Both prompt templates retained. |
| Prepare Cloudflare access, p. 5 | GS-02 and PUBLISH-02 step 4: Super Administrator, Manage Account → Members, own account, least necessary permissions, accept invitation, MFA; never share owner password. |
| Add domain without nameserver changes, pp. 5–6 | PUBLISH-02 step 5: full DNS setup, record export/inventory, A/AAAA/CNAME/MX/TXT/SPF/DKIM/DMARC/verification/CAA/SRV and service subdomains, mail normally DNS-only, read-only exact comparison, responsible-person agreement before proceeding. |
| Temporary deployment before cutover, p. 6 | PUBLISH-02 step 6: propose resources/commands/settings/variable names and unique name; approval before creation; temporary-address comparison and direct human review, no public-domain change. Both preparation and approved-deployment prompts retained. |
| Change nameservers, pp. 6–7 | PUBLISH-02 step 7: DNSSEC disable/re-enable according to provider procedure, replace rather than append assigned nameservers, keep old host, wait for Active, verify authority/email/subdomains/HTTPS/external services while old site continues; no new deployment connection yet. |
| Connect public domain, pp. 7–8 | PUBLISH-02 step 8: active zone + passing temporary site, DNS/redirect/custom-domain/route conflicts, exact proposal, preserved rollback information, explicit approval, certificates, keep old host; Custom Domains require an active zone. Both prompts retained. |
| Migration verification and retirement, p. 8 | PUBLISH-02 step 9; MANAGE-03: root/www, HTTPS, every page, navigation, redirects, assets/downloads/forms, desktop/mobile, email delivery, subdomains, analytics/integrations; owner approval and agreed stability period before retiring host. |
| Open correct repository, p. 9 | GS-03, BUILD-02 step 1, MANAGE-02: complete read-only project verification prompt; per-site values override examples. |
| Prepare a safe working version, pp. 9–10 | BUILD-02 step 2: inspect unfinished work, safely obtain approved state, separate branch, preserve others; complete prompt, wait until safe. BUILD-03 shortcut opens this exact step. |
| Describe and approve a change, p. 10 | BUILD-02 step 3, BUILD-03: page, exact words, assets, links, placement/style, invariants; plan/files/accessibility/mobile/data/form/content risks and approval before editing. |
| Test and iterate, pp. 10–11 | BUILD-02 step 4, MANAGE-09: repository-specific build/test/lint/accessibility checks, all affected and related pages, desktop/mobile preview, changed-file report; example mobile-image correction prompt retained. WRITE AI commands are examples, not universal requirements. |
| Open GitHub review, p. 11 | BUILD-02 step 5: local approval before commit/push/PR; only related files, separate branch/PR, reviewer link, results and summary; no merge/publication yet. |
| Publish approved change, pp. 11–12 | PUBLISH-03 and BUILD-02 step 6: approved PR and passed checks, documented production branch, monitor configured Cloudflare deployment, compare deployed and merged commit, every official hostname, human live-site check. Automatic production and optional preview builds depend on settings. |
| Deployment failure, p. 12 | MANAGE-06: full stop/protect prompt; no deleting/overwriting/force-push/disconnect/domain change/separate production copy; inspect full error and propose correction for approval. |
| Faulty public change, p. 12 | MANAGE-07 and recovery diagram: exact causing merged change, targeted GitHub revert, preview/test/review, approval before merge/publication; preserve history and source/deployment consistency. |
| Plan a new site, p. 13 | BUILD-01 step 1, DESIGN-01/02: name/purpose/audience/domain/repository/unique project/pages/content ownership/publication authority/forms/email/auth/database/analytics; keep unrelated sites separate. |
| Start project with Codex, pp. 13–14 | BUILD-01 step 2: permanent project folder; complete eight-part proposal prompt and no create/upload/deploy/purchase/publish before approval; approved examples only, no copying private/brand/unnecessary material. |
| Build and review locally, pp. 14–15 | BUILD-01 steps 3–4: complete local-build and final-check prompts, setup/config/checks/sample variable names only, all desktop/mobile pages, approved text/assets/contacts/disclaimers/privacy/accessibility; identify unfinished content/integrations before review. |
| Create repository, p. 15 | BUILD-01 steps 5–6: approved organization, name/description/visibility/default branch/initial files, exclude generated/dependency/log/env/secret files, approval before creation/upload; complete source on separate branch and reviewed PR before production merge. |
| Connect repository to Cloudflare, pp. 15–16 | PUBLISH-01 steps 1–2: complete nine-part configuration proposal, correct product/commands/runtime/repository/branch/variables/temporary address/resources, explicit approval before creation; test temporary deployment before public domain. |
| Existing-domain subdomain, pp. 16–17 | PUBLISH-01 step 3A: owner control/approval, existing DNS/redirect/route/certificate/service conflicts, exact change and rollback; no root nameserver changes when already Cloudflare-managed. Complete prompt retained. |
| Entirely new root domain, p. 17 | PUBLISH-01 step 3B: ownership/expense approval before purchase, shared-account full DNS setup/import review, replace nameservers/wait Active/connect root and applicable www; use full migration safeguards for existing web/mail/services. |
| Publish and verify new site, pp. 17–18 | PUBLISH-01 step 4: complete explicit public-domain approval prompt, HTTPS, full navigation/link/asset/download/redirect/form/desktop/mobile checks, deployed version matches production commit, independent human review. |
| Record operations, pp. 17–18 | PUBLISH-01 step 5, GS-03, MANAGE-04: name/purpose/repository/production branch/project/temporary and public addresses/runtime/build/deploy/variable names/external services/owners/reviewers/registrar/first verified production date/editing and rollback procedures. |

## Prompt and content preservation

All 35 prompt instances in the approved prototype are retained, including repeated templates at the relevant tasks. Test fixtures record SHA-256 digests from the approved input, normalized only for whitespace and curly apostrophes. Browser tests verify rendered text against those independent digests and verify every copy action. These include all migration, edit, new-site, domain, publication, failure, and revert templates in the PDF. No substantive workflow gap was identified in the 18-page comparison.

Editorial directions, page/source labels, source citations, and private account/contact details do not appear in visitor copy. The public explanatory content is rewritten in direct language. Additional troubleshooting guidance is organized by symptom with a safe action and an escalation route. Template placeholders inside copyable prompts are intentional inputs for visitors, not unfinished website features.

## Validation and remaining boundaries

The browser suite scans the home and all four section pages plus all 22 guides and guidance depths at 1440px and 390px, with disclosures open. It checks WCAG A/AA and applicable axe best practices, reflow, internal destination resolution, image alternatives/loading, runtime/network errors, and editorial-label leakage. Separate tests exercise 320px reflow, reduced motion, keyboard skip/tab/disclosure behavior, tab focus and history/deep links, search across every depth, clipboard actions, design-note retention and checklists. Screenshots cover home, build, workflow, design and migration at desktop/mobile sizes.

Manual visual review found a low-contrast heading in the dark-blue area after semantic heading normalization; its white styling was restored. The first lifecycle visual, yellow cautions and dark-blue exploration area remain intact. Font files and their licenses are local build assets, so runtime requires no external font service.

Remaining limitations before a future PR/publication handoff:

- The prototype's remotely hosted DLL logo could not be fetched in this environment (HTTP 403). The header uses the documented DLL text fallback. An approved local logo asset would remove that limitation.
- Production branch, Cloudflare project, domain and build-trigger settings are unknown. GitHub default branch `main` is verified, but must not be represented as confirmed production configuration.
- Git read access is verified; push/PR access is unverified, and the earlier read-only GitHub API query returned Forbidden. No commit, push or PR was attempted during implementation.
- Automated accessibility checks and keyboard/visual review are not a formal conformance certification or a substitute for user testing with assistive technology. Safari/Firefox and real-device testing are not included in this Chromium pass.
- Notes/checklist state is intentionally memory-only, cleared on reload; the UI states this. There is no submission service, telemetry or authentication.
- The audit file is excluded from public output, but repository visibility must be considered before committing any maintainer documentation. The original PDF and ZIP remain outside this checkout.

No Cloudflare/DNS operation, merge, environment publication, or public deployment is part of this implementation.

Recorded local result: `npm run build` and `npm run lint` passed; all 9 Playwright tests passed, including 118 page/view accessibility scans across desktop and mobile and verification/copying of all 35 approved prompt instances. No axe violations were reported in the scanned states. The 320px reflow and reduced-motion checks also passed. Browser screenshots were inspected for the home, build, workflow, design and migration pages; remaining browser/device limitations are listed above.
