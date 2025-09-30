import type {PhaseId} from "../types";

// Configuration Types
export interface PhaseConfig {
  id: PhaseId;
  title: string;
  template: string;
  description?: string;
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

export type TokenType = "global" | "phase" | "custom" | "unknown";

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

// Configuration Schema
export const PHASE_CONFIG_SCHEMA = {
  type: "object",
  required: ["id", "title", "template"],
  properties: {
    id: {type: "string", enum: ["0", "1", "2", "2.5", "3", "4"]},
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
