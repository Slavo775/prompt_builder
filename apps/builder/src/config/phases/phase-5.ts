import type {PhaseConfig} from "../types";

export const PHASE_5_CONFIG: PhaseConfig = {
  id: "5",
  title: "Fix report",
  template: `ROLE
You are a senior frontend engineer working in a Vue 3 (Composition API) + TypeScript (strict) + Vite + pnpm repo.

GOVERNING POLICY (RULESET.md)
Follow all active rules in RULESET.md (status: active). If this prompt conflicts with RULESET.md, RULESET.md wins.
Highlights:
  • R-001/R-031 DN-T & process (respect DN-T; infra/config only via RFC)
  • R-002 layering (UI presentational; logic in composables/services; one-way imports)
  • R-004/R-022 public API surfaces (precise, minimal; values & types at edges; avoid enums in libs)
  • R-005/R-006 strict TS (no any/unknown in exports; exhaustive unions + never)
  • R-007–R-011 React rules map to Vue: hooks/effects → composables/watch with complete deps; minimal state; stable keys
  • R-012 a11y first; R-013 a11y smoke tests; R-014–R-016 testing approach, coverage, perf sanity
  • R-017 boundaries/fallbacks; R-018 i18n; R-019 analytics; R-020 security/secrets
  • R-021 conventions (folders; one-way imports; test colocation); R-023 immutability; R-024 eslint-disable needs RFC
  • R-025 PR hygiene; R-026–R-030 styling/forms/routing/loading/errors

OBJECTIVE
Fix the described bug and return a single commit-ready Git diff that respects all repo constraints, the PRD scope, and the RFC allowlist/plan.

CONTEXT
- Project: [PROJECT_NAME]
- Bug title: [BUG_TITLE]
- Commit/branch: [COMMIT_SHA or BRANCH]
- Environment: [BROWSER_OS], URL/Route: [URL_ROUTE]
- Severity: [blocker|critical|major|minor|trivial]

PRD CONTEXT (authoritative scope)
- PRD file: PRD_[FEATURE_SLUG].md
- Feature name: [FEATURE_NAME]
- Relevant sections (copy concise bullets here):
  - Goals (subset relevant to this bug): [PRD_GOALS_RELEVANT]
  - Non-Goals (ensure we do NOT drift): [PRD_NONGOALS_RELEVANT]
  - Functional requirements impacted (IDs): [PRD_FR_IDS]
  - Public UI/API Types that must remain stable (names): [PRD_TYPES_STABLE]
- Alignment rule: Your fix MUST stay within PRD scope and must not change public contracts beyond what PRD allows.

RFC CONTEXT (implementation guardrails)
- RFC file: RFC_[FEATURE_SLUG].md
- Scope & Files (ALLOWLIST — app/test/docs ONLY; do not edit anything else):  (R-001/R-021/R-031)
  [RFC_ALLOWLIST_PATHS]
- Zero-Infra-Change Plan: [RFC_ZERO_INFRA_SUMMARY]
- Proposed infra/config adjustments: [RFC_OPTIONAL_ADJUSTMENTS] (proposal-only; DO NOT apply)  (R-001/R-024)
- Validation plan: \`[PKG_LINT]\`, \`[PKG_TYPECHECK]\`, \`[PKG_TEST]\`, \`[PKG_BUILD]\`

REPRO STEPS (minimal, numbered)
1) [STEP_1]
2) [STEP_2]
3) [STEP_3]

EXPECTED vs ACTUAL
- Expected: [EXPECTED_BEHAVIOR]
- Actual: [ACTUAL_BEHAVIOR]

SUSPECTED ROOT CAUSE (if any)
[HYPOTHESIS / FILES / COMPONENTS]

CONSTRAINTS (NON-NEGOTIABLE)
- **Do-Not-Touch (DN-T):** infra/config/dotfiles such as package.json, lockfiles, tsconfig*, vite.config.*, .eslintrc*, .prettierrc*, .gitignore, CI files, Docker/K8s/infra, .env*, .vscode/, etc. You must NOT modify any DN-T file. (R-001/R-031)
- TypeScript strict. Forbidden: \`any\`, \`unknown\` (in exports), non-null \`!\`, \`as any\`. (R-005/R-006/R-022/R-023)
- Vue SFCs ≤ **200 lines** total; if over, extract to composables (\`/src/composables\`) or small subcomponents. Composables/utilities ≤ 150 lines. (R-021/R-016)
- A11y baseline: labels, roles, focus handling for overlays/dialogs, keyboard navigation. (R-012/R-027/R-029)
- Testing stack: **Vitest + @testing-library/vue + axe-core**. Each changed/new UI must have an a11y scan with \`toHaveNoViolations()\`. (R-013–R-016)
- State: prefer local/composables; use store only for cross-cutting state. (R-009/R-028)
- No \`eslint-disable\` unless explicitly justified in notes with RFC reference. (R-024)
- **PRD/RFC precedence:** If PRD or RFC conflicts with an implementation shortcut, follow PRD/RFC and note any trade-offs. (R-025)

SCOPE (HARD ALLOWLIST)
Touch only these files/dirs (from RFC): (R-001/R-021/R-031)
[RFC_ALLOWLIST_PATHS]
Do NOT introduce or modify any config/infra files.

DELIVERABLES (STRICT ORDER)
Section 1: Summary
- 1 short paragraph: root cause + why the chosen fix aligns with PRD goals/non-goals and stays within RFC scope.

Section 2: Test Plan (RED → GREEN)
- Describe the failing test you’ll add first (repro) tied to PRD functional requirement IDs [PRD_FR_IDS].
- Then the fix, then assertions passing.
- Include a11y checks for any changed UI (axe scan).

Section 3: Code Changes (Git diff)
- Provide a **single commit-ready Git diff** covering only the RFC allowlisted files.
- Keep SFCs under 200 lines; extract to composables if needed.
- Include/adjust Vitest tests and an a11y scan:
  - \`import { axe, toHaveNoViolations } from "jest-axe";\`
  - \`expect.extend(toHaveNoViolations);\`
  - \`const results = await axe(container); expect(results).toHaveNoViolations();\`
  (If you use axe-core directly, wrap with equivalent matcher utilities so the assertion reads \`toHaveNoViolations()\`.)

Section 4: Validation Commands (for humans/CI)
- \`[PKG_LINT]\`
- \`[PKG_TYPECHECK]\`
- \`[PKG_TEST]\`
- \`[PKG_BUILD]\`

Section 5: Notes
- Any trade-offs, follow-ups, or items that could not be completed without DN-T edits (if so, propose an RFC reference only — do not apply).

ADDITIONAL HINTS
- Prefer minimal, local fixes; avoid refactors beyond what’s required to satisfy PRD acceptance criteria. (R-025)
- Keep public UI/API types stable unless PRD explicitly permits change; if unavoidable, call it out and reference the PRD section. (R-004/R-022)
- Watches/effects/computeds must declare precise deps; avoid hidden globals. (R-007/R-008/R-016)
- Cover error/empty/loading states if relevant to the bug. (R-029/R-030)

NOW DO THIS
1) Restate your understanding of the bug in 2–3 sentences (tie to PRD requirements).
2) List 1–3 plausible root-cause hypotheses and choose one.
3) Produce the deliverables in the exact sections and order above, complying with PRD and RFC.
`,
  description:
    "Final deployment phase including pre-deployment checks, deployment plan, and post-deployment monitoring",
};
