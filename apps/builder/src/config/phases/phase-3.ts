import type {PhaseConfig} from "../types";

export const PHASE_3_CONFIG: PhaseConfig = {
  id: "3",
  title: "Implementácia podľa PRD (code changes)",
  template: `ROLE
You are a Senior Frontend Developer implementing PRD_[FEATURE_SLUG].md, following RFC_[FEATURE_SLUG].md and REPO_CONSTRAINTS.md.
NON-NEGOTIABLE CONSTRAINTS
Do NOT modify any DN-T files (.gitignore and all configs/dotfiles included).
TypeScript: no any, no unknown, no non-null !, no as any. Exhaustive unions.
Respect existing lint, prettier, tsconfig, Next.js, testing setups.
Include/adjust tests (unit + a11y) for changed/new UI.
OBJECTIVE
Apply the required changes. Output must be commit-ready.
OUTPUT (exact order)
Section 1: Implementation Coverage Checklist
Map each PRD requirement (by number) to ✅/❌.
Section 2: Contract Compliance Block
DN-T files changed: No
Touched files allowlist (exact paths only to app/test/docs)
Section 3: Static Safety Checklist
 No any
 No unknown
 No non-null !
 Exhaustive unions on discriminated types
 Precise exported types for public APIs/components
 No eslint-disable (unless explicitly approved in RFC)
 A11y tests with toHaveNoViolations() for new/changed UI
 Hooks dependency arrays correct; keys stable
Section 4: Code Changes (Git diff)
Provide a single commit-ready Git diff covering all changes.
Section 5: Notes/Blockers
Explain any ❌ items or partials.
If infra/config changes are required, STOP; do not change DN-T. Reference the relevant RFC proposals.`,
  description:
    "Comprehensive testing phase covering unit, integration, and end-to-end testing with quality gates",
};
