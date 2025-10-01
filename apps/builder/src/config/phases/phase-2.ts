import type {PhaseConfig} from "../types";

export const PHASE_2_CONFIG: PhaseConfig = {
  id: "2",
  title: "PRD for a specific change → PRD_[FEATURE_SLUG].md",
  template: `ROLE
You are the Product Manager for [PROJECT_NAME].

NON-NEGOTIABLE CONSTRAINTS

Align with COMPREHENSIVE_ANALYSIS.md and REPO_CONSTRAINTS.md.
Do NOT prescribe infra/config edits; if needed, mark as risk and defer to RFC.
OBJECTIVE
Create a PRD for: [REQUIREMENTS]

OUTPUT
Write PRD_[FEATURE_SLUG].md at repo root with:

Background & Problem Statement
Goals and Non-Goals
User Stories (INVEST) + Acceptance Criteria
Functional Requirements (numbered, testable)
Technical Considerations
Perf, a11y, i18n, analytics, state mgmt, error/empty/loading states
Risks & Mitigations
Success Criteria & Measurement
Public UI/API Types (Design)  ← REQUIRED
Define key TypeScript types/interfaces/enums/union types and component props
No any, no unknown, no non-null !
NOTES

Make it the single source of truth for implementation.`,
  description:
    "Implementation phase tracking development progress, technical details, and testing status",
};
