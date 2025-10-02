import type {AnyPhaseId, PhaseId} from "../types";

// Configuration Types
export interface PhaseConfig {
  id: AnyPhaseId;
  title: string;
  template: string;
  description: string;
}

export interface ValidationRule {
  token: string;
  required: boolean;
  message?: string;
}

export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  token: string;
  message: string;
  type: "required" | "format" | "custom";
}

export interface ValidationWarning {
  field: string;
  token: string;
  message: string;
  type: "suggestion" | "deprecation";
}

// Token Analysis Types
export interface TokenAnalysis {
  tokens: string[];
  requiredTokens: string[];
  availableTokens: string[];
  missingTokens: string[];
  unusedTokens: string[];
}

// Token Replacement Types
export interface TokenReplacementResult {
  originalTemplate: string;
  renderedTemplate: string;
  replacedTokens: string[];
  unreplacedTokens: string[];
  isValid: boolean;
  errors: ValidationError[];
}

// Enhanced Validation Types
export interface EnhancedValidationState extends ValidationState {
  requirementsValid: boolean;
  tokenReplacementValid: boolean;
}

// Requirements Input Types
export interface RequirementsInputProps {
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  errorMessage?: string;
  helpText?: string;
  label?: string;
  id?: string;
  ariaDescribedBy?: string;
}

// Token Replacement Service
export interface TokenReplacementService {
  replaceTokens(
    // eslint-disable-next-line no-unused-vars
    template: string,
    // eslint-disable-next-line no-unused-vars
    inputs: Record<string, string>
  ): TokenReplacementResult;
  validateTokens(
    // eslint-disable-next-line no-unused-vars
    template: string,
    // eslint-disable-next-line no-unused-vars
    inputs: Record<string, string>
  ): ValidationError[];
  getAvailableTokens(
    // eslint-disable-next-line no-unused-vars
    inputs: Record<string, string>
  ): string[];
  getTokenType(
    // eslint-disable-next-line no-unused-vars
    token: string,
    // eslint-disable-next-line no-unused-vars
    inputs: Record<string, string>
  ): "global" | "phase" | "custom" | "unknown";
}

// Union Types
export type TokenType = "global" | "phase" | "custom" | "unknown";
export type ValidationSeverity = "error" | "warning" | "info";
export type InputFieldType =
  | "text"
  | "email"
  | "url"
  | "textarea"
  | "requirements";
export type TemplateValidationState =
  | "valid"
  | "invalid"
  | "warning"
  | "loading";

// Constants
export const ValidationErrorType = {
  REQUIRED: "required",
  FORMAT: "format",
  CUSTOM: "custom",
  TOKEN_MISSING: "token_missing",
  TOKEN_INVALID: "token_invalid",
} as const;

export const TokenReplacementStatus = {
  SUCCESS: "success",
  PARTIAL: "partial",
  FAILED: "failed",
  VALIDATING: "validating",
} as const;

export const InputValidationState = {
  VALID: "valid",
  INVALID: "invalid",
  WARNING: "warning",
  PENDING: "pending",
} as const;

export interface TokenParseResult {
  tokens: string[];
  positions: Array<{start: number; end: number; token: string}>;
  hasUnclosedTokens: boolean;
  hasInvalidTokens: boolean;
}

// Utility Types
export type ValidationStatus =
  | "idle"
  | "validating"
  | "valid"
  | "invalid"
  | "error";

export type ConfigLoadStatus = "idle" | "loading" | "loaded" | "error";

// Event Types
export interface ValidationEvent {
  type: "validation_start" | "validation_complete" | "validation_error";
  field?: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface ConfigLoadEvent {
  type: "config_load_start" | "config_load_success" | "config_load_error";
  phaseId?: PhaseId;
  timestamp: number;
  error?: Error;
}

// Error Handling Types
export interface ConfigLoadError extends Error {
  phaseId?: PhaseId;
  fileName?: string;
  cause?: Error;
}

export interface TokenParseError extends Error {
  template: string;
  position?: number;
  token?: string;
}

// Component Props
export interface ValidatedInputProps {
  modelValue: string;
  isValid: boolean;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  "aria-describedby"?: string;
}

export interface ValidationIndicatorProps {
  status: ValidationStatus;
  message?: string;
  compact?: boolean;
}

export interface ValidationSummaryProps {
  validationState: ValidationState;
  showWarnings?: boolean;
  compact?: boolean;
}

// Composable Return Types
/* eslint-disable no-unused-vars */
export interface UseValidationReturn {
  validationState: import("vue").ComputedRef<ValidationState>;
  validateInput: (field: string, value: string) => ValidationError[];
  validateAll: () => ValidationState;
  clearValidation: (field?: string) => void;
}

export interface UsePhaseConfigReturn {
  phaseConfigs: import("vue").ComputedRef<Record<PhaseId, PhaseConfig>>;
  getPhaseConfig: (id: PhaseId) => PhaseConfig;
  updatePhaseConfig: (id: PhaseId, config: Partial<PhaseConfig>) => void;
  loadConfigurations: () => Promise<void>;
  isLoading: import("vue").Ref<boolean>;
}
/* eslint-enable no-unused-vars */

// Phase 5 specific input types
export interface Phase5Inputs {
  // Bug Context
  bugTitle: string;
  commitSha: string;
  browserOs: string;
  urlRoute: string;
  severity: BugSeverity;

  // PRD Context
  prdFile: string;
  featureName: string;
  prdGoalsRelevant: string;
  prdNongoalsRelevant: string;
  prdFrIds: string;
  prdTypesStable: string;

  // RFC Context
  rfcFile: string;
  rfcAllowlistPaths: string;
  rfcZeroInfraSummary: string;
  rfcOptionalAdjustments: string;

  // Bug Reproduction
  reproSteps: string;
  expectedBehavior: string;
  actualBehavior: string;
  suspectedRootCause: string;
}

// Bug severity levels
export type BugSeverity =
  | "blocker"
  | "critical"
  | "major"
  | "minor"
  | "trivial";

// Phase 5 input field types
export type Phase5InputFieldType =
  | "text"
  | "textarea"
  | "select"
  | "url"
  | "commit-sha";

// Phase 5 input field configuration
export interface Phase5InputFieldConfig {
  key: keyof Phase5Inputs;
  label: string;
  type: Phase5InputFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule;
  options?: string[]; // For select fields
}

// Phase 5 validation rules
export interface Phase5ValidationRule {
  field: keyof Phase5Inputs;
  required: boolean;
  pattern?: RegExp;
  message?: string;
  // eslint-disable-next-line no-unused-vars
  customValidator?: (value: string) => ValidationError[];
}

// Phase 5 component props
export interface Phase5InputsProps {
  modelValue: Phase5Inputs;
  disabled?: boolean;
  showValidation?: boolean;
  compact?: boolean;
  "aria-label"?: string;
}

// Phase 5 input field props
export interface Phase5InputFieldProps {
  modelValue: string;
  fieldConfig: Phase5InputFieldConfig;
  disabled?: boolean;
  errorMessage?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

// Phase 5 validation state
export interface Phase5ValidationState {
  isValid: boolean;
  errors: Phase5ValidationError[];
  warnings: Phase5ValidationWarning[];
}

// Phase 5 specific validation error
export interface Phase5ValidationError {
  field: keyof Phase5Inputs;
  message: string;
  type: "required" | "format" | "custom";
}

// Phase 5 specific validation warning
export interface Phase5ValidationWarning {
  field: keyof Phase5Inputs;
  message: string;
  type: "suggestion" | "deprecation";
}

// Phase 5 composable return type
export interface UsePhase5InputsReturn {
  inputs: import("vue").Ref<Phase5Inputs>;
  validationState: import("vue").ComputedRef<Phase5ValidationState>;
  // eslint-disable-next-line no-unused-vars
  updateInput: (field: keyof Phase5Inputs, value: string) => void;
  // eslint-disable-next-line no-unused-vars
  validateInput: (field: keyof Phase5Inputs) => Phase5ValidationError[];
  validateAll: () => Phase5ValidationState;
  resetInputs: () => void;
  // eslint-disable-next-line no-unused-vars
  getFieldError: (field: keyof Phase5Inputs) => string;
}

// Phase 5 field configurations
export const PHASE_5_FIELD_CONFIGS: Phase5InputFieldConfig[] = [
  {
    key: "bugTitle",
    label: "Bug Title",
    type: "text",
    required: true,
    placeholder: "Brief description of the bug",
    helpText: "A concise title describing the issue",
  },
  {
    key: "commitSha",
    label: "Commit SHA or Branch",
    type: "commit-sha",
    required: false,
    placeholder: "abc1234 or feature-branch",
    helpText: "The commit or branch where the bug occurs",
  },
  {
    key: "browserOs",
    label: "Browser/OS Environment",
    type: "text",
    required: false,
    placeholder: "Chrome 120 on macOS 14",
    helpText: "Browser and operating system where bug was observed",
  },
  {
    key: "urlRoute",
    label: "URL/Route",
    type: "url",
    required: false,
    placeholder: "https://example.com/page",
    helpText: "The URL or route where the bug occurs",
  },
  {
    key: "severity",
    label: "Severity",
    type: "select",
    required: true,
    options: ["blocker", "critical", "major", "minor", "trivial"],
    helpText: "Impact level of the bug",
  },
  {
    key: "prdFile",
    label: "PRD File",
    type: "text",
    required: true,
    placeholder: "PRD_feature_slug.md (auto-generated from feature slug)",
    helpText: "Name of the PRD file (auto-generated from feature slug)",
  },
  {
    key: "featureName",
    label: "Feature Name",
    type: "text",
    required: true,
    placeholder: "User Authentication",
    helpText: "Name of the feature being worked on",
  },
  {
    key: "prdGoalsRelevant",
    label: "Relevant PRD Goals",
    type: "textarea",
    required: false,
    placeholder:
      "• Goal 1: Improve user experience\n• Goal 2: Increase security",
    helpText: "PRD goals relevant to this bug (bullet points)",
  },
  {
    key: "prdNongoalsRelevant",
    label: "Relevant PRD Non-Goals",
    type: "textarea",
    required: false,
    placeholder:
      "• Non-Goal 1: Complete redesign\n• Non-Goal 2: New infrastructure",
    helpText: "PRD non-goals to ensure no scope drift (bullet points)",
  },
  {
    key: "prdFrIds",
    label: "Impacted Functional Requirements",
    type: "text",
    required: false,
    placeholder: "FR-1, FR-3, FR-5",
    helpText: "Comma-separated list of functional requirement IDs",
  },
  {
    key: "prdTypesStable",
    label: "Stable Public Types",
    type: "text",
    required: false,
    placeholder: "User, AuthState, LoginForm",
    helpText:
      "Comma-separated list of public UI/API types that must remain stable",
  },
  {
    key: "rfcFile",
    label: "RFC File",
    type: "text",
    required: true,
    placeholder: "RFC_feature_slug.md (auto-generated from feature slug)",
    helpText: "Name of the RFC file (auto-generated from feature slug)",
  },
  {
    key: "rfcAllowlistPaths",
    label: "RFC Allowlist Paths",
    type: "textarea",
    required: false,
    placeholder: "src/components/\nsrc/utils/\ntests/",
    helpText: "File paths allowed for modification (one per line)",
  },
  {
    key: "rfcZeroInfraSummary",
    label: "Zero-Infra-Change Plan",
    type: "textarea",
    required: false,
    placeholder:
      "Summary of changes that require no infrastructure modifications",
    helpText: "Brief summary of the zero-infrastructure-change approach",
  },
  {
    key: "rfcOptionalAdjustments",
    label: "Proposed Infra Adjustments",
    type: "textarea",
    required: false,
    placeholder: "Optional infrastructure changes (proposal only)",
    helpText:
      "Proposed infrastructure adjustments (read-only, for reference only)",
  },
  {
    key: "reproSteps",
    label: "Reproduction Steps",
    type: "textarea",
    required: true,
    placeholder:
      "1) Navigate to login page\n2) Enter invalid credentials\n3) Click submit",
    helpText: "Numbered steps to reproduce the bug",
  },
  {
    key: "expectedBehavior",
    label: "Expected Behavior",
    type: "textarea",
    required: true,
    placeholder: "User should see error message and remain on login page",
    helpText: "What should happen when following the reproduction steps",
  },
  {
    key: "actualBehavior",
    label: "Actual Behavior",
    type: "textarea",
    required: true,
    placeholder: "User is redirected to dashboard without authentication",
    helpText: "What actually happens when following the reproduction steps",
  },
  {
    key: "suspectedRootCause",
    label: "Suspected Root Cause",
    type: "textarea",
    required: false,
    placeholder: "Authentication middleware not properly validating tokens",
    helpText: "Your hypothesis about what's causing the bug (optional)",
  },
] as const;

// Phase 5 validation rules
export const PHASE_5_VALIDATION_RULES: Phase5ValidationRule[] = [
  {
    field: "bugTitle",
    required: true,
    message: "Bug title is required",
  },
  {
    field: "commitSha",
    required: false,
    message: "Commit SHA or branch is required",
  },
  {
    field: "browserOs",
    required: false,
    message: "Browser/OS environment is required",
  },
  {
    field: "urlRoute",
    required: false,
    pattern: /^https?:\/\/.+/,
    message: "URL must be a valid HTTP/HTTPS URL",
  },
  {
    field: "severity",
    required: true,
    message: "Severity level is required",
  },
  {
    field: "prdFile",
    required: true,
    pattern: /^PRD_[a-zA-Z0-9_]+\.md$/,
    message: "PRD file must follow format: PRD_[feature_slug].md",
  },
  {
    field: "featureName",
    required: true,
    message: "Feature name is required",
  },
  {
    field: "prdGoalsRelevant",
    required: false,
    message: "Relevant PRD goals are required",
  },
  {
    field: "prdNongoalsRelevant",
    required: false,
    message: "Relevant PRD non-goals are required",
  },
  {
    field: "prdFrIds",
    required: false,
    message: "Impacted functional requirements are required",
  },
  {
    field: "prdTypesStable",
    required: false,
    message: "Stable public types are required",
  },
  {
    field: "rfcFile",
    required: true,
    pattern: /^RFC_[a-zA-Z0-9_]+\.md$/,
    message: "RFC file must follow format: RFC_[feature_slug].md",
  },
  {
    field: "rfcAllowlistPaths",
    required: false,
    message: "RFC allowlist paths are required",
  },
  {
    field: "rfcZeroInfraSummary",
    required: false,
    message: "Zero-infra-change plan is required",
  },
  {
    field: "reproSteps",
    required: true,
    message: "Reproduction steps are required",
  },
  {
    field: "expectedBehavior",
    required: true,
    message: "Expected behavior is required",
  },
  {
    field: "actualBehavior",
    required: true,
    message: "Actual behavior is required",
  },
] as const;

// Configuration Schema
export const PHASE_CONFIG_SCHEMA = {
  type: "object",
  required: ["id", "title", "template"],
  properties: {
    id: {type: "string", enum: ["0", "1", "2", "2.5", "3", "4", "5", "6"]},
    title: {type: "string", minLength: 1},
    template: {type: "string", minLength: 1},
    description: {type: "string"},
  },
} as const;

// Validation Rule Schema
export const VALIDATION_RULE_SCHEMA = {
  type: "object",
  required: ["token", "required"],
  properties: {
    token: {type: "string", pattern: "^[A-Z_]+$"},
    required: {type: "boolean"},
    message: {type: "string"},
  },
} as const;
