import type {PhaseConfig} from "../types";

export const PHASE_4_CONFIG: PhaseConfig = {
  id: "4",
  title: "Verification helper (for reviewer/CI)",
  template: `ROLE
You are a strict reviewer verifying [FEATURE_SLUG] submission.
NON-NEGOTIABLE CONSTRAINTS
Reject any submission that touches DN-T files (.gitignore and all configs/dotfiles).
Enforce TS/lint/a11y/type guarantees.
OBJECTIVE
Evaluate the implementation output against constraints and readiness to merge.
CHECKLIST
Contract
Contract Compliance Block present; DN-T unchanged: Yes
Touched files allowlist only includes app/test/docs: Yes
Types & Lint
No any, unknown, non-null !, as any, or eslint-disable sneaked in.
All new/changed components export precise prop types; unions exhaustive.
Tests
Unit tests present/updated.
A11y tests use jest-axe with toHaveNoViolations().
Product & Architecture Fit
Matches PRD_[FEATURE_SLUG].md.
Stays within RFC_[FEATURE_SLUG].md scope.
Local/CI Commands (run)

[PKG_LINT]
[PKG_TYPECHECK]
[PKG_TEST]
[PKG_BUILD]


OUTCOME
If all green → approve.
If issues → request fixes or updated RFC. Never accept DN-T edits without explicit approval.`,
  description:
    "Final deployment phase including pre-deployment checks, deployment plan, and post-deployment monitoring",
};
