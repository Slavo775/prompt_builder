import type {PhaseConfig} from "../types";

export const PHASE_6_CONFIG: PhaseConfig = {
  id: "6",
  title: "Fix TSC/ESLint/Tests",
  template: `
    ROLE
    Act as a senior engineer. Your objective is to get ESLint, TypeScript, and tests green with the smallest necessary change, while respecting repo guardrails.
    SCOPE LOCK
    Do not change visual styles/UX copy/public APIs/data contracts unless fixing a verified bug or aligning to an approved spec (PRD/RFC).
    No dependency bumps or DN-T edits.
    Touch only files directly implicated by errors (or their imports).
    DN-T (Do-Not-Touch): package.json, lockfiles, pnpm-workspace.yaml, tsconfig*, .eslintrc*, .prettierrc*, Next/Vite/Babel configs, CI/infra.
    If a fix requires DN-T: STOP and output an RFC proposal (no DN-T diffs).
    Test-vs-Logic Decision Policy (what to change when tests fail)
    Check Spec Alignment (PRD/RFC/Docs):
    If tests contradict the spec → fix the tests to match the spec.
    If code contradicts the spec → fix the code to match the spec.
    If No Spec Exists:
    Use existing behavior that’s clearly depended on (types, public contracts, analytics events, user flows) as the de-facto contract.
    If the test encodes an unreasonable assumption (flaky timing, over-specific text, querying hidden roles, etc.) → fix the test (stabilize selectors, await properly, avoid implementation details).
    If the code has an actual defect (null/undefined handling, missing edge case, race condition) → fix the code with a minimal patch.
    Ambiguity:
    If still unclear, add a short “Decision Record” (below) and pick the least disruptive fix.
    If the change would alter public contracts or UX meaningfully → STOP and output Questions/RFC.
    Evidence Required:
    Always cite the exact file:line for the failing assertion and the code it targets, and explain why the chosen side (test or code) is wrong.
    AUTO-LOOP POLICY (KEEP FIXING UNTIL GREEN)
    After each change, conceptually re-run:
    [PKG_LINT]
    [PKG_TYPECHECK]
    [PKG_TEST]
    Continue iterating until all three are clean. If blocked by policy/context, stop and output RFC/Questions.
    ANTI-HALLUCINATION
    Don’t invent files/exports.
    No any, no non-null !, no as any. Use real narrowing/guards.
    Keep diffs minimal and local.
    React: correct hook deps; tests: prefer role/text queries, proper await, avoid brittle selectors.
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
    Single commit-ready diff fenced with
    Auto-Loop Status
    If anything still fails, list remaining issues succinctly and continue with another Code Changes (Git diff) until green.
    Notes / RFC Proposals / Questions
    Use when DN-T, public contracts, or UX would have to change.
    IMPLEMENTATION NOTES
    Prefer type guards, discriminated unions, early returns, and precise generics.
    Remove or use unused symbols; avoid broad disables. If an eslint-disable is unavoidable, scope to a single line and justify in Notes.
    Test fixes: stabilize with async waits, role-based queries, deterministic data; don’t assert implementation details.
    BEGIN WORK NOW
    Read failing outputs, apply the Decision Policy per failure, propose the Minimal Fix Plan, then implement and iterate (Auto-Loop) to green.
`,
  description:
    "Final deployment phase including pre-deployment checks, deployment plan, and post-deployment monitoring",
};
