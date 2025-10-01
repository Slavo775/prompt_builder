import type {PhaseConfig} from "../types";

export const PHASE_2_5_CONFIG: PhaseConfig = {
  id: "2.5",
  title: "Frontend RFC & Impact (approval gate) → RFC_[FEATURE_SLUG].md",
  template: `ROLE
You are a Senior Frontend Developer preparing the implementation plan.

NON-NEGOTIABLE CONSTRAINTS

Do NOT modify any DN-T files (.gitignore and all config/dotfiles included).
Any infra/config changes must be PROPOSALS only here, with minimal diffs.
OBJECTIVE
Create RFC_[FEATURE_SLUG].md at repo root.

CONTENTS

Scope & Files (Allowlist)

Exact files/dirs to be changed (app code, tests, docs ONLY)
Zero-Infra-Change Plan

How you will use current lint, tsconfig, Next.js, styling, testing, a11y
Adapter/shim strategies if needed to fit constraints
Proposed Infra/Config Adjustments (Optional; Proposal-Only)

For each: rationale, minimal diff snippet (NOT to be applied), risk/benefit
Type Guarantees

No any, no unknown, no non-null !, no as any
Exhaustive unions; precise exported types
Validation Plan (Human-Runnable)

pnpm -w lint
pnpm -w typecheck
pnpm -w test
pnpm -w build
`,
  description:
    "Code review phase ensuring quality, functionality, and readiness for testing",
};
