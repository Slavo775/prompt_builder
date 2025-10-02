import type {PhaseConfig} from "../types";

export const PHASE_1_CONFIG: PhaseConfig = {
  id: "1",
  title: "Repo exploration COMPREHENSIVE_ANALYSIS.md",
  template: `
ROLE
  You are an experienced Software Architect, Senior Frontend Developer, and Product Manager.

GOVERNING POLICY (RULESET.md)
  Follow all active rules in RULESET.md (status: active). If this prompt conflicts with RULESET.md, RULESET.md wins.
  Highlights:
    • R-001/R-031 DN-T & process (respect DN-T; infra/config only via RFC)
    • R-002 layering (UI vs domain/services/hooks; one-way imports)
    • R-004/R-022 public API (precise types; minimal exports; avoid enums)
    • R-005/R-006 strict TS (no any/unknown in exports; exhaustive unions)
    • R-007–R-011 React correctness (hooks, effects, state, keys, typed props/events)
    • R-012–R-013 a11y + a11y tests; R-014–R-016 testing + coverage + perf
    • R-017 boundaries/fallbacks; R-018 i18n; R-019 analytics; R-020 security
    • R-021 conventions (folders; one-way imports); R-023 immutability; R-024 eslint-disable needs RFC
    • R-025 PR hygiene; R-026–R-030 styling/forms/routing/loading/errors

NON-NEGOTIABLE CONSTRAINTS
  • This document is human-owned. AI must follow it in all phases.
  • Include an explicit Do-Not-Touch (DN-T) list covering infra/config files.
  • Keep it concise, normative, and easy to diff.
  • Obey REPO_CONSTRAINTS.md and RULESET.md; do NOT modify DN-T files (.gitignore and all other configs included).
  • Use precise language; prefer lists/tables; include Mermaid where helpful.

OBJECTIVE
  Explore the entire repository and produce COMPREHENSIVE_ANALYSIS.md at the repo root.

CONTENTS (required sections)
  1) System Overview
     - Apps/packages and how they interact
     - Key runtime flows (auth, data, UI state)
     - Mermaid diagram(s): system & high-level dependencies
     - Packages & Responsibilities (with ownership)

  2) Public Surfaces per Package (R-004/R-022)
     - Per-package summary
     - Public APIs & exported types (values + types at edges)
     - Patterns & anti-patterns (reference R-002, R-016, R-026–R-030)

  3) Developer View
     - Code style & module structure; one-way imports (R-021)
     - State management & hooks discipline (R-007–R-011)
     - i18n usage (R-018); routing/data boundaries (R-028)
     - Testing/a11y posture: frameworks, coverage, conventions (R-012–R-016)
     - Performance notes: render cost, memoization evidence, bundle size (R-016)

  4) Product View
     - Current features & primary user workflows
     - Domain entities + key business rules (Mermaid where clarifying)

  5) Risks & Tech Debt
     - Performance, DX, a11y, boundary leaks, flaky tests, coupling, dead code
     - Security & secrets posture (R-020)

  6) Constraints & Guardrails (Affirmed)  ← REQUIRED
     - Copy DN-T list verbatim from REPO_CONSTRAINTS.md (R-001/R-031)
     - Affirmation: “No DN-T file will be modified during implementation.”
     - Foreseeable blockers requiring infra/config changes
     - For each blocker: propose RFC item (proposal only; no code), linking to relevant RULESET items (e.g., R-024)

  7) Appendix
     - Important env vars (sanitized), key scripts
     - How to run: lint / typecheck / test / build / a11y smoke
     - Conventions quick-ref: folders, file naming, test colocation (R-021)

OUTPUT STYLE
  • Commit-ready markdown, easy to diff.
  • Use tables/checklists for inventories; add Mermaid for flows/ownership/dep graphs.
  • Reference RULESET items inline as (R-0xx) where relevant.

MERMAID SNIPPET STARTERS (edit as needed)
  \`\`\`mermaid
  flowchart LR
    App[App] --> API[API Client]
    API --> Domain[Domain Services]
    Domain --> UI[UI Components]
    subgraph Packages
      UI -->|one-way| containers
      containers --> hooks
      hooks --> services
      services --> domain
    end
  \`\`\`
  \`\`\`mermaid
  graph TD
    Login -->|token| Session
    Session --> DataFetch
    DataFetch --> StateStore
    StateStore --> UIRender
  \`\`\`

NOTES
  Keep it practical: what a new senior dev/PM needs to be productive quickly. Prefer concrete examples, explicit links/paths, and short rationales over prose.
`,
  description:
    "Detailed planning phase including requirements analysis, technical design, and risk assessment",
};
