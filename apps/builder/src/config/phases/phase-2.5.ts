import type {PhaseConfig} from "../types";

export const PHASE_2_5_CONFIG: PhaseConfig = {
  id: "2.5",
  title: "Frontend RFC & Impact (approval gate) → RFC_[FEATURE_SLUG].md",
  template: `
ROLE
  You are a Senior Frontend Developer preparing the implementation plan.

GOVERNING POLICY (RULESET.md)
  Follow all active rules in RULESET.md (status: active). If this prompt conflicts with RULESET.md, RULESET.md wins.
  Highlights:
    • R-001/R-031 DN-T & process (respect DN-T; infra/config only via RFC)
    • R-002 layering (UI vs domain/services/hooks; one-way imports)
    • R-004/R-022 public API (precise types; minimal exports; avoid enums)
    • R-005/R-006 strict TS (no any/unknown in exports; exhaustive unions)
    • R-007–R-011 React/hook/state/keys/typed props
    • R-012–R-016 a11y + testing + coverage + perf sanity
    • R-017 boundaries/fallbacks; R-018 i18n; R-019 analytics; R-020 security
    • R-021 conventions (folders; test colocation); R-023 immutability; R-024 eslint-disable needs RFC
    • R-025 PR hygiene; R-026–R-030 styling/forms/routing/loading/errors

NON-NEGOTIABLE CONSTRAINTS
  • Do NOT modify any DN-T files (all dotfiles/configs/infra listed in REPO_CONSTRAINTS.md).
  • Infra/config changes are PROPOSALS only in this doc, with minimal diffs (not to be applied).
  • All code examples must follow strict TypeScript (R-005/R-006/R-022/R-023):
    - no any; no unknown (in exported surfaces); no non-null !; no "as any"
    - exhaustive discriminated unions with never guards
    - export precise types for every exported value at public edges
  • Obey REPO_CONSTRAINTS.md and RULESET.md at all times.

OBJECTIVE
  Create AIDocuments/[FEATURE_NAME]/RFC_[FEATURE_SLUG].md (single Markdown file).

OUTPUT FORMAT (MANDATORY)
  • Use these exact top-level headings in order.
  • Keep it concise, normative, and easy to diff (short bullets, code fences, checklists).
  • All paths are repo-relative.

1) Title & Metadata
  Title: RFC: [FEATURE_NAME]
  Feature Slug: [FEATURE_SLUG]
  Owner: Human maintainers
  Status: Draft

2) Summary
  • One paragraph describing the problem and the intended outcome.
  • Non-goals (bullets).

3) Scope & Files (Allowlist)  (R-001/R-021/R-025)
  • Only these files/dirs may change. No DN-T or infra files.
  • App code: apps/web/... (list concrete files)
  • Tests: apps/web/.../*.test.ts(x) (colocated)
  • Docs: AIDocuments/[FEATURE_NAME]/...
  • Out of scope: DN-T files and any infra/config/tooling.

4) Zero-Infra-Change Plan  (R-002, R-007–R-011, R-016–R-018, R-026–R-030)
  • Describe implementation strictly within current configs (no edits).
  • TypeScript (R-005/R-006/R-022/R-023): strict; explicit public interfaces; exhaustive unions; immutability.
  • Next.js: page/route/components touched; data-fetching mode; Suspense/ErrorBoundary if applicable (R-017).
  • Layering (R-002/R-028/R-021): routing/data-fetch in containers/hooks; pass typed data/handlers into UI.
  • Styling (R-026): use existing design tokens/themes; no ad-hoc globals.
  • Testing (R-014–R-016/R-015): vitest + Testing Library; behavior-first; coverage posture.
  • A11y (R-012–R-013/R-027): semantic HTML, keyboard/focus mgmt, WCAG 2.1 AA; jest-axe smoke tests.
  • i18n (R-018): no hardcoded copy; plurals/RTL/dates/numbers.
  • Analytics (R-019): emit typed events; no PII.
  • Adapters/Shims (if needed): conform to current contracts without config changes.

5) Proposed Infra/Config Adjustments (Optional; Proposal-Only)  (R-001/R-024)
  • Do not apply. Humans review/approve separately. Keep diffs minimal.
  For each proposal:
    Rationale: why it’s needed (or nice-to-have).
    Minimal diff (do not apply):
    # DO NOT APPLY — PROPOSAL ONLY
    --- a/path/to/config.ext
    +++ b/path/to/config.ext
    @@
    - old
    + new
    Risk/Benefit: short bullets.
    Rollback: how to revert.

6) API & Type Guarantees  (R-004/R-005/R-006/R-022/R-023)
  • Public types: exported union/object types; avoid enums in libs (use as const + union literals).
  • No: any; unknown (in exports); non-null !; "as any".
  • Exhaustiveness: switch on discriminants with never check.
  • Values & Types: export precise corresponding types for every exported value at public edges.
  • Immutability: avoid parameter mutation; use readonly where useful.
  Example pattern:
  \`\`\`ts
  export const Status = { Idle: 'idle', Loading: 'loading', Error: 'error', Success: 'success' } as const;
  export type Status = typeof Status[keyof typeof Status];
  export type Result =
    | { kind: 'ok'; data: ReadonlyArray<Item> }
    | { kind: 'err'; message: string };
  export function parse(input: string): Result { /* … precise return … */ }
  \`\`\`

7) Implementation Plan (Step-by-Step)  (R-025)
  • Bullet list of PR-sized steps (≤ ~300 LOC each).
  For each step:
    - Files touched (subset of allowlist)
    - Acceptance checks (tests/a11y/typecheck/build)
    - Fallback/rollback note

8) Validation Plan (Human-Runnable)  (R-014–R-016/R-013/R-015)
  Replace brackets with repo-specific commands/macros.
  • Lint:    [PKG_LINT]
  • Typecheck: [PKG_TYPECHECK]
  • Tests:   [PKG_TEST]
  • Build:   [PKG_BUILD]
  • A11y smoke (example):
    \`\`\`ts
    import { axe } from 'jest-axe';
    test('a11y', async () => {
      const { container } = render(<Feature />);
      expect(await axe(container)).toHaveNoViolations();
    });
    \`\`\`

9) Risks & Mitigations
  • Technical, product, rollout risks with brief mitigations (perf, a11y, DX, boundary leaks, flaky tests).

10) Success Criteria  (R-015/R-016/R-012)
  • User-visible outcomes; perf targets (if any).
  • Coverage posture: Lines ≥ 85%, Branches ≥ 80%; zero new a11y violations.

11) Open Questions
  • Short list requiring human decisions.

12) Appendix (Optional)
  • Diagrams, examples, or links.

Guardrails Checklist (must pass before completion)
  □ No DN-T or infra files changed outside this RFC doc path. (R-001/R-031)
  □ Public APIs expose both values and precise types. (R-004/R-022)
  □ No any/unknown (in exports)/non-null !/"as any". (R-005/R-006)
  □ Exhaustive unions with never guards. (R-006)
  □ Tests added/updated; a11y smoke included. (R-013–R-015)
  □ Validation commands succeed: [PKG_LINT] [PKG_TYPECHECK] [PKG_TEST] [PKG_BUILD].
  □ Any infra/config ideas live only in §5 with minimal diffs and “DO NOT APPLY” banner. (R-001/R-024)
`,
  description:
    "Code review phase ensuring quality, functionality, and readiness for testing",
};
