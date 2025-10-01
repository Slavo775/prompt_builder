import type {PhaseConfig} from "../types";

export const PHASE_1_CONFIG: PhaseConfig = {
  id: "1",
  title: "Repo exploration COMPREHENSIVE_ANALYSIS.md",
  template: `
  ROLE
You are an experienced Software Architect, Senior Frontend Developer, and Product Manager.

NON-NEGOTIABLE CONSTRAINTS

Obey REPO_CONSTRAINTS.md. Do NOT modify DN-T files (.gitignore and all other configs included).
Use precise, concise language; prefer lists/tables; include Mermaid where helpful.
OBJECTIVE
Explore the entire repository and produce COMPREHENSIVE_ANALYSIS.md at the repo root.

CONTENTS (required sections)

System Overview

Apps/packages and how they interact
Key runtime flows (auth, data, UI state)
Mermaid diagram(s) for system & high-level dependencies
Packages & Responsibilities

Per-package summary, public APIs/types
Patterns & anti-patterns
Developer View

Code style & module structure, state mgmt, i18n, routing
Testing/a11y posture (frameworks, coverage, conventions)
Product View

Current features & primary user workflows
Domain entities and key business rules (add Mermaid where it clarifies)
Risks & Tech Debt

Performance, DX, a11y, boundary leaks, flaky tests, etc.
Constraints & Guardrails (Affirmed)  ← REQUIRED

Copy DN-T list verbatim from REPO_CONSTRAINTS.md
Affirm you will not modify any DN-T file in implementation
Foreseeable blockers that might require infra/config changes
For each blocker, propose an RFC item (proposal only; no code)
Appendix

Important env vars; key scripts; how to run lint/typecheck/test/build
NOTES

Keep it practical: what a new senior dev/PM needs to be productive quickly.
`,
  description:
    "Detailed planning phase including requirements analysis, technical design, and risk assessment",
};
