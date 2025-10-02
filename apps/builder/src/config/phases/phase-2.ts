import type {PhaseConfig} from "../types";

export const PHASE_2_CONFIG: PhaseConfig = {
  id: "2",
  title: "PRD for a specific change → PRD_[FEATURE_SLUG].md",
  template: `
ROLE
  You are the Product Manager for [PROJECT_NAME].

GOVERNING POLICY (RULESET.md)
  Follow all active rules in RULESET.md (status: active). If this prompt conflicts with RULESET.md, RULESET.md wins.
  Highlights:
    • R-001/R-031 DN-T & process (respect DN-T; infra/config only via RFC)
    • R-002 layering; R-021 one-way imports & test colocation
    • R-004/R-022 public API types (precise, minimal; avoid enums in libs)
    • R-005/R-006 strict TS (no any/unknown in exports; exhaustive unions)
    • R-007–R-011 React hooks/state/keys/typed props; R-012 a11y; R-013 a11y tests
    • R-014–R-016 testing approach, coverage, perf sanity; R-017 boundaries/fallbacks
    • R-018 i18n; R-019 analytics hygiene; R-020 security & secrets
    • R-023 immutability; R-024 eslint-disable needs RFC; R-025 PR hygiene
    • R-026–R-030 styling/forms/routing/loading/errors

NON-NEGOTIABLE CONSTRAINTS
  • Align with COMPREHENSIVE_ANALYSIS.md, REPO_CONSTRAINTS.md, and RULESET.md.
  • Do NOT prescribe infra/config edits. If suspected, mark as a risk and defer to a separate RFC (proposal-only) per R-001/R-024.
  • TypeScript rules for §8 Public UI/API Types (R-004/R-005/R-006/R-022/R-023):
    - no any; no unknown (in exports); no non-null !; no "as any"
    - prefer union literals + as const objects; enums only for external API interop (and justify)

OBJECTIVE
  Create a Product Requirements Document (PRD) for: [REQUIREMENTS].

OUTPUT
  Write AIDocuments/[FEATURE_NAME]/PRD_[FEATURE_SLUG].md as a single Markdown file (and nothing else).
  Be concise, normative, and easy to diff (short bullets, numbered requirements, code fences for types).

——— PRD Template (the AI must fill every section below) ———
PRD: [FEATURE_NAME]
Feature Slug: [FEATURE_SLUG]
Project: [PROJECT_NAME]
Owner: Product (PM)
Status: Draft
Links: Tickets / Design / Research

1) Background & Problem Statement
  • Context and user pain.
  • Why now; impact if we don’t ship.

2) Goals and Non-Goals
  • Goals: short, outcome-focused bullets.
  • Non-Goals: what we explicitly won’t do.

3) User Stories (INVEST) + Acceptance Criteria
US-1: As a [role], I want [capability] so that [benefit].
  Acceptance Criteria:
  Given … When … Then …
US-2: …
  Acceptance Criteria:
  …
(Keep each story independently valuable and testable.)

4) Functional Requirements (Numbered, Testable)
  FR-1: …
  FR-2: …
  FR-3: …
(Reference FR-# from tests later; see R-014–R-016.)

5) Technical Considerations (Informative; no infra prescriptions)
  • Implementation within current stack/config (R-001/R-021); adapters/shims in app code if needed.
  • Perf budgets (TTFB/TTI/hydration; bundle guardrails) (R-016).
  • Accessibility (WCAG 2.1 AA; keyboard; focus; labels/roles; contrast) (R-012/R-027/R-029).
  • Internationalization (copy keys; RTL/LTR; dates/numbers) (R-018).
  • Analytics/Telemetry (events, schemas, where fired; no PII) (R-019).
  • State Management (local vs global; loading/error/empty; caching/invalidation) (R-009/R-028/R-029).
  • Error/Empty/Loading UX with retries/timeouts; actionable messages (R-017/R-029/R-030).
  • Security/Privacy (authz boundaries; no secrets; input validation) (R-020).
  • Compatibility (browsers/devices; graceful degradation).
  • Testing Strategy (Testing Library; a11y smoke with jest-axe; happy/sad paths; coverage posture) (R-013–R-016).
  • No infra/config edits here—defer to RFC if needed (R-001/R-024).

6) Risks & Mitigations
  R-1: Description.
    • Mitigation: …
    • Defer to RFC: If infra/config, name the RFC placeholder (e.g., AIDocuments/Infra/RFC_xxx.md).

7) Success Criteria & Measurement
  • User outcomes (KPIs/OKRs tied to behavior: activation, completion, error rate).
  • Quality gates: no new a11y violations; perf budgets met; zero blocker defects (R-012/R-016).
  • Coverage posture: Lines ≥ 85%, Branches ≥ 80% for changed code; critical paths → 100% targeted (R-015).

8) Public UI/API Types (Design) — REQUIRED  (R-004/R-005/R-006/R-022/R-023)
  Define the public contract (component props, events, data models) using strict TypeScript.
  Rules: no any; no unknown; no non-null !; no "as any". Prefer union literals; if using enum for interop, justify in a comment.
  Export values and types for public surfaces.

  \`\`\`ts
  // Public status values + type (prefer union literals)
  export const Status = {
    Idle: 'idle',
    Loading: 'loading',
    Success: 'success',
    Error: 'error',
  } as const;
  export type Status = typeof Status[keyof typeof Status];

  // Discriminated union for results (exhaustive)
  export type Result<TData> =
    | { kind: 'ok'; data: Readonly<TData> }
    | { kind: 'err'; message: string; code?: string };

  // Component props (typed, precise; avoid boolean prop explosions)
  export type FeatureWidgetProps = Readonly<{
    status: Status;
    onSubmit?(input: SubmitPayload): void;
    footerSlot?: React.ReactNode;
  }>;

  // Example events/payloads
  export type SubmitPayload = Readonly<{
    id: string;
    value: string;
  }>;

  // Example external API enum (ONLY if required for interop)
  // enum ExternalMode { A = 'A', B = 'B' } // ← justify if used

  // Exhaustiveness helper
  export function assertNever(x: never): never {
    throw new Error(\`Unreachable case: \${String(x)}\`);
  }
  \`\`\`

9) Validation Plan (Human-Runnable)
  Concrete, repo-compatible commands/macros (replace placeholders).
  • Lint:       [PKG_LINT]
  • Typecheck:  [PKG_TYPECHECK]
  • Tests:      [PKG_TEST]
  • Build:      [PKG_BUILD]
  • Manual checklist to verify key acceptance criteria in a local build.

10) Out of Scope
  • Anything not in Goals or FRs.
  • Anything requiring infra/config change without an approved RFC (R-001/R-024).
`,
  description:
    "Implementation phase tracking development progress, technical details, and testing status",
};
