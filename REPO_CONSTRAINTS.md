# 1. Role & Scope

- Owner: Human maintainers
- Audience: Everyone (including AI)
- Goal: Keep changes safe, consistent, and easy to review.
- Source of truth: RULESET.md (active items). If this file conflicts with RULESET.md, RULESET.md wins.

# 2. Do-Not-Touch (DN-T)

Do-Not-Touch (DN-T) Files & Folders
Edits to anything below require an RFC + explicit human approval. AI MUST NOT modify these.
Package & Workspaces:
package.json, lockfiles (pnpm-lock.yaml, package-lock.json, yarn.lock), pnpm-workspace.yaml
TS/JS Project Config:
tsconfig*.json, jsconfig*.json
Build/Tooling Config:
next.config._ (and any framework build config), babel.config._, .babelrc, vite.config._, rollup.config._, tsup.config._, webpack.config._, postcss.config._, tailwind.config._, Emotion/Babel plugins config, Storybook config (.storybook/**)
Lint/Format/Editor:
.eslintrc*, .prettierrc*, .stylelint*, .lintstagedrc*, .commitlintrc\*, .editorconfig
VCS / CI / Hooks:
.gitignore, .gitattributes, .mailmap, .husky/, .github/** (workflows), .gitlab-ci.yml, .circleci/, turbo.json, nx.json
Infra / DevOps:
Dockerfile*, docker-compose*, kubernetes/, terraform/, infra/_
Testing Runners:
playwright.config._, vitest.config._, jest.config._, cypress.config._
Dependency Mgmt:
dependabot.yml, renovate.json, .npmrc, .nvmrc
IDE / Project Meta:
.vscode/, .idea/
Env & Secrets:
.env_, .env._.example, config/.env._
Other root-level dotfiles & configs:
any .\* at repo root not explicitly listed above
No exceptions: DN-T edits land only via an approved RFC PR authored/approved by a human.

# 3. Output & RFC Policy

- Output must be commit-ready and reviewable as a Git diff. No DN-T edits in normal PRs.
- Infra/config/tooling changes: **proposal-only** via /rfcs/\*, merged after explicit human approval (R-001, R-024).

# 4. TypeScript (strict)

- Strict on; TS errors are blockers. No `any`/`unknown` (in exports), no non-null `!`, no "as any".
- Exhaustive discriminated unions with `never` guards.
- Public API: minimal, precise; export values **and** types at boundaries; prefer unions over enums. (R-004–R-006, R-022, R-023)

# 5. React/UI Practices

- Layering: separate UI and business logic; one-way imports (containers/hooks → ui). (R-002, R-021, R-028)
- Hooks: top-level only; complete deps; prefer no Effects; side-effects only for external sync. (R-007–R-009)
- Rendering/state: minimal/derived/colocated state; stable unique keys; avoid heavy work in render. (R-009–R-011, R-016)
- A11y: semantic HTML; keyboard/focus; WCAG 2.1 AA; tests with jest-axe. (R-012–R-013)
- Styling: use design tokens; component-scoped styles. Error boundaries for critical areas; skeletons over spinners. (R-017, R-026, R-029)

# 6. Testing & Coverage

- Vitest + Testing Library; behavior over implementation; avoid snapshot-only for dynamic UI. (R-014)
- A11y smoke: `expect(await axe(container)).toHaveNoViolations()` for interactive UI. (R-013)
- Coverage: Lines ≥ 85%, Branches ≥ 80%; critical paths targeted to 100%. (R-015)

# 7. Security, i18n, Analytics

- Security: never commit secrets; validate inputs; least-privilege client APIs. (R-020)
- i18n: use existing system; no hardcoded copy; plural/RTL/date/number formatting. (R-018)
- Analytics: typed events; no PII; document names/schemas. (R-019)

# 8. Conventions & PR Hygiene

- Structure: `ui/`, `containers/`, `hooks/`, `domain/`, `services/`, `api/`; tests colocated; public API via `index.ts`. (R-021)
- PRs: small, single-purpose, with rationale; clean diffs; TODOs must link tickets. (R-025)

# 9. AI Participation

- Must comply with this file and RULESET.md; may draft RFCs and propose diffs; **must not** apply DN-T changes. (R-001, R-031)

# 10. Changelog

- 2025-10-02 — Initial creation of repository constraints file based on RULESET.md active rules.
