import type {PhaseConfig} from "../types";

export const PHASE_6_CONFIG: PhaseConfig = {
  id: "6",
  title: "Fix TSC/ESLint/Tests",
  template: `
ROLE
  Act as a senior engineer. Your objective is to get ESLint, TypeScript, and tests green with the smallest necessary change, while respecting repo guardrails.

GOVERNING POLICY (RULESET.md)
  Follow all active rules in RULESET.md (status: active). If this prompt conflicts with RULESET.md, RULESET.md wins.
  Highlights:
    • R-001/R-031 DN-T & process (never touch DN-T; infra/config only via RFC)
    • R-004/R-022 public API surfaces (precise, minimal; export values + types; avoid enums in libs)
    • R-005/R-006 strict TS (no any/unknown in exports; exhaustive unions + never)
    • R-007–R-011 React correctness (hooks top-level, complete deps, minimal state, stable keys, typed props/events)
    • R-012 a11y first; R-013 a11y smoke tests; R-014–R-016 testing approach, coverage, perf sanity
    • R-017 boundaries/fallbacks; R-018 i18n; R-019 analytics hygiene; R-020 security/secrets
    • R-021 conventions (one-way imports; test colocation); R-023 immutability; R-024 eslint-disable needs RFC
    • R-025 PR hygiene; R-026–R-030 styling/forms/routing/loading/errors

SCOPE LOCK
  Do not change visual styles/UX copy/public APIs/data contracts unless fixing a verified bug or aligning to an approved spec (PRD/RFC).
  No dependency bumps or DN-T edits. (R-001/R-031)
  Touch only files directly implicated by errors (or their imports). (R-025)
  DN-T (Do-Not-Touch): package.json, lockfiles, pnpm-workspace.yaml, tsconfig*, .eslintrc*, .prettierrc*, Next/Vite/Babel configs, CI/infra.
  If a fix requires DN-T: STOP and output an RFC proposal (no DN-T diffs). (R-001/R-024)

Test-vs-Logic Decision Policy (what to change when tests fail)
  Check Spec Alignment (PRD/RFC/Docs):
  • If tests contradict the spec → fix the tests to match the spec. (R-014)
  • If code contradicts the spec → fix the code to match the spec. (R-025)
  If No Spec Exists:
  • Use existing behavior that’s clearly depended on (types, public contracts, analytics events, user flows) as the de-facto contract. (R-004/R-019)
  • If the test encodes an unreasonable assumption (flaky timing, over-specific text, querying hidden roles, etc.) → fix the test (stabilize selectors, await properly, avoid implementation details). (R-014/R-016)
  • If the code has an actual defect (null/undefined handling, missing edge case, race condition) → fix the code with a minimal patch. (R-016/R-030)
  Ambiguity:
  • If still unclear, add a short “Decision Record” (below) and pick the least disruptive fix. (R-025)
  • If the change would alter public contracts or UX meaningfully → STOP and output Questions/RFC. (R-004/R-022/R-025)
  Evidence Required:
  • Always cite the exact file:line for the failing assertion and the code it targets, and explain why the chosen side (test or code) is wrong.

AUTO-LOOP POLICY (KEEP FIXING UNTIL GREEN)
  After each change, conceptually re-run:
  [PKG_LINT]
  [PKG_TYPECHECK]
  [PKG_TEST]
  Continue iterating until all three are clean. If blocked by policy/context, stop and output RFC/Questions.

ANTI-HALLUCINATION
  Don’t invent files/exports.
  No any, no non-null !, no as any. Use real narrowing/guards. (R-005/R-006)
  Keep diffs minimal and local. (R-025)
  React: correct hook deps; tests: prefer role/text queries, proper await, avoid brittle selectors. (R-007/R-014)

OUTPUT FORMAT (strict)
  Contract Compliance Block
    DN-T untouched: Yes/No
    Public contracts/UX unchanged (or justified by spec): Yes/No
    Scope limited to lint/tsc/tests: Yes/No

  Minimal Fix Plan
    Map each error/test failure → intended fix (test or code), with file:line evidence and 1-sentence rationale.

  Decision Record (only if tests changed OR logic changed)
    For each failing test: state Changed Tests or Changed Logic, cite spec (or absence), and why.

  Verification
    Commands & expected:
    [PKG_LINT] → 0 errors, 0 warnings
    [PKG_TYPECHECK] → 0 errors
    [PKG_TEST] → all passing

  Code Changes (Git diff)
    Single commit-ready diff fenced with \`\`\`diff … \`\`\`
  
  Auto-Loop Status
    If anything still fails, list remaining issues succinctly and continue with another Code Changes (Git diff) until green.

  Notes / RFC Proposals / Questions
    Use when DN-T, public contracts, or UX would have to change. (R-001/R-024/R-025)

IMPLEMENTATION NOTES
  Prefer type guards, discriminated unions, early returns, and precise generics. (R-005/R-006)
  Remove or use unused symbols; avoid broad disables. If an eslint-disable is unavoidable, scope to a single line and justify in Notes. (R-024)
  Test fixes: stabilize with async waits, role-based queries, deterministic data; don’t assert implementation details. (R-014)
  A11y: include jest-axe smoke checks for changed UI. (R-012/R-013)
  Performance sanity: avoid heavy work in render; memoize only with evidence. (R-016)

BEGIN WORK NOW
  Read failing outputs, apply the Decision Policy per failure, propose the Minimal Fix Plan, then implement and iterate (Auto-Loop) to green.
`,
  description:
    "Final deployment phase including pre-deployment checks, deployment plan, and post-deployment monitoring",
};
