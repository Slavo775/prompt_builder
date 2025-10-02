- id: R-001
  title: Respect DN-T and repo policies
  text: Follow REPO_CONSTRAINTS.md; never modify DN-T files; propose infra/config only via RFC.
  tags: [process, safety]
  status: active

- id: R-002
  title: Separate UI from business logic
  text: UI components are presentational; logic lives in domain/services/hooks; one-way imports only.
  tags: [architecture, react, layering]
  status: active

- id: R-003
  title: Don’t DRY too early
  text: Prefer clarity; duplicate small code until a pattern is proven; then extract.
  tags: [refactoring]
  status: active

- id: R-004
  title: Values and types at public edges
  text: For every exported value in public API, export its precise type; no leakage of internals.
  tags: [typescript, api]
  status: active

- id: R-005
  title: Strict TypeScript
  text: No any, no unknown (in exports), no non-null !, no as any; enable strict exhaustiveness.
  tags: [typescript, safety]
  status: active

- id: R-006
  title: Exhaustive unions
  text: Discriminated unions must be handled with an exhaustive switch and a never guard.
  tags: [typescript, safety]
  status: active

- id: R-007
  title: Hooks correctness
  text: Call hooks only at top level; complete dependency arrays; no disabling hook rules.
  tags: [react, hooks]
  status: active

- id: R-008
  title: Effects discipline
  text: Prefer no Effect; use Effects only to sync with external systems; remove unnecessary Effects.
  tags: [react, performance]
  status: active

- id: R-009
  title: State minimalism
  text: Keep state minimal/serializable; derive when possible; avoid prop-to-state mirroring.
  tags: [react, state]
  status: active

- id: R-010
  title: Stable list keys
  text: Keys must be stable/unique and not array index when items reorder or filter.
  tags: [react, rendering]
  status: active

- id: R-011
  title: Typed props and events
  text: All component props/events precisely typed; prefer unions/objects over boolean prop explosions.
  tags: [react, api]
  status: active

- id: R-012
  title: A11y first
  text: Semantic HTML, keyboard operability, focus mgmt, alt text; meet WCAG 2.1 AA.
  tags: [a11y, quality]
  status: active

- id: R-013
  title: A11y tests required
  text: New/changed UI includes jest-axe toHaveNoViolations() smoke test.
  tags: [a11y, testing]
  status: active

- id: R-014
  title: Testing approach
  text: Use Testing Library; test behavior not internals; avoid snapshot-only tests for dynamic UI.
  tags: [testing]
  status: active

- id: R-015
  title: Coverage posture
  text: Lines ≥ 85%, Branches ≥ 80%; critical paths targeted to 100%.
  tags: [testing, quality]
  status: active

- id: R-016
  title: Performance sanity
  text: Avoid heavy work in render; memoize only with evidence; mind bundle size and hydration.
  tags: [performance]
  status: active

- id: R-017
  title: Error boundaries and fallbacks
  text: Provide ErrorBoundary for critical surfaces; define loading/empty/error states explicitly.
  tags: [reliability, ux]
  status: active

- id: R-018
  title: Internationalization
  text: Use existing i18n; no hardcoded copy; support plural/RTL/date/number formatting.
  tags: [i18n]
  status: active

- id: R-019
  title: Analytics hygiene
  text: Emit defined events with typed payloads; no PII; document event names and schemas.
  tags: [analytics, privacy]
  status: active

- id: R-020
  title: Security and secrets
  text: Never commit secrets; validate inputs; least-privilege for client APIs.
  tags: [security]
  status: active

- id: R-021
  title: File/folder conventions
  text: ui/, containers/, hooks/, domain/, services/, api/ with one-way imports; tests colocated.
  tags: [architecture, conventions]
  status: active

- id: R-022
  title: Public API surface
  text: Export minimal, precise API via index.ts; avoid enums in libs—prefer as const + unions.
  tags: [typescript, api]
  status: active

- id: R-023
  title: Immutability by default
  text: Don’t mutate params; prefer readonly where helpful; use pure functions in domain.
  tags: [typescript, style]
  status: active

- id: R-024
  title: No eslint-disable without RFC note
  text: eslint-disable lines require explicit RFC reference and rationale.
  tags: [quality, process]
  status: active

- id: R-025
  title: Commit hygiene
  text: Small, single-purpose PRs; clean diffs; no commented-out code; link tickets for TODOs.
  tags: [process, review]
  status: active

- id: R-026
  title: Styling discipline
  text: Use the repo’s design tokens/system; avoid ad-hoc globals; keep styles component-scoped.
  tags: [styling, design]
  status: active

- id: R-027
  title: Forms and labels
  text: Prefer controlled inputs for complex logic; ensure programmatic label association.
  tags: [a11y, forms]
  status: active

- id: R-028
  title: Routing/data boundaries
  text: Keep routing/data-fetch in containers/hooks; pass typed data/handlers into UI components.
  tags: [react, architecture]
  status: active

- id: R-029
  title: Loading skeletons vs spinners
  text: Prefer skeletons for content placeholders; avoid infinite spinners; provide retries/timeouts.
  tags: [ux, performance]
  status: active

- id: R-030
  title: Error messages and recovery
  text: Show actionable errors with retry; log with context; avoid leaking internals to users.
  tags: [ux, reliability]
  status: active

- id: R-031
  title: DN-T
  text: Do-Not-Touch (DN-T) Files & Folders
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
  tags: [DN-T]
  status: active

- id: R-032
  title: No inline style in html components
  text: Avoid adding inline styles in component if is not a variables like style="--test: testValue"
  tags: [styles]
  status: active

- id: R-033
  title: Vue components styling
  text: For Vue component use always scoped styled with scss
  tags: [styles]
  status: active

- id R-034
  title: BEM
  text: If you need declare html class use BEM
  tags: [styled]
  status: active

- id: R-035
  title: Lazy loading Components
  text: If components render conditionally always keep it lazy loading
  tags: [performance]
  status: active

- id: R-036
  title: Performance optimalization
  text: Always try to have best performance approach
  tags: [perforamnce]
  status: active

- id: R-037
  title: Translations
  text: If there are any static texts always translate them
  tags: [translation]
  status: active
