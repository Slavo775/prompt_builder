import type {
  Phase5Inputs,
  Phase5ValidationState,
  Phase5ValidationError,
  Phase5ValidationWarning,
  Phase5ValidationRule,
  BugSeverity,
} from "../config/types";
import {PHASE_5_VALIDATION_RULES} from "../config/types";

/**
 * Validate a single Phase 5 input field
 */
export function validatePhase5Field(
  field: keyof Phase5Inputs,
  value: string,
  rules: Phase5ValidationRule[]
): Phase5ValidationError[] {
  const rule = rules.find((r) => r.field === field);
  if (!rule) return [];

  const errors: Phase5ValidationError[] = [];

  // Check required validation
  if (rule.required && (!value || value.trim() === "")) {
    errors.push({
      field,
      message: rule.message || `${field} is required`,
      type: "required",
    });
    return errors; // Don't check other validations if required field is empty
  }

  // Check pattern validation
  if (value && rule.pattern && !rule.pattern.test(value)) {
    errors.push({
      field,
      message: rule.message || `${field} format is invalid`,
      type: "format",
    });
  }

  // Check custom validation
  if (value && rule.customValidator) {
    const customErrors = rule.customValidator(value);
    errors.push(
      ...customErrors.map((error) => ({
        field: error.field as keyof Phase5Inputs,
        message: error.message,
        type: error.type as "required" | "format" | "custom",
      }))
    );
  }

  return errors;
}

/**
 * Validate all Phase 5 inputs
 */
export function validatePhase5Inputs(
  inputs: Phase5Inputs,
  rules: Phase5ValidationRule[] = PHASE_5_VALIDATION_RULES
): Phase5ValidationState {
  const errors: Phase5ValidationError[] = [];
  const warnings: Phase5ValidationWarning[] = [];

  // Validate each field
  for (const field of Object.keys(inputs) as Array<keyof Phase5Inputs>) {
    const fieldErrors = validatePhase5Field(field, inputs[field], rules);
    errors.push(...fieldErrors);
  }

  // Add specific validations for Phase 5
  validateSeverityField(inputs.severity, errors);
  validateUrlField(inputs.urlRoute, errors);
  validateFileFormat(inputs.prdFile, "PRD", errors);
  validateFileFormat(inputs.rfcFile, "RFC", errors);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate severity field specifically
 */
function validateSeverityField(
  severity: BugSeverity,
  errors: Phase5ValidationError[]
): void {
  const validSeverities: BugSeverity[] = [
    "blocker",
    "critical",
    "major",
    "minor",
    "trivial",
  ];

  if (severity && !validSeverities.includes(severity)) {
    errors.push({
      field: "severity",
      message:
        "Severity must be one of: blocker, critical, major, minor, trivial",
      type: "format",
    });
  }
}

/**
 * Validate URL field specifically
 */
function validateUrlField(url: string, errors: Phase5ValidationError[]): void {
  if (url && !isValidUrl(url)) {
    errors.push({
      field: "urlRoute",
      message: "URL must be a valid HTTP/HTTPS URL",
      type: "format",
    });
  }
}

/**
 * Validate file format (PRD/RFC)
 */
function validateFileFormat(
  filename: string,
  type: "PRD" | "RFC",
  errors: Phase5ValidationError[]
): void {
  console.log("filename", filename);
  if (filename) {
    const pattern =
      type === "PRD" ? /^PRD_[a-zA-Z0-9_]+\.md$/ : /^RFC_[a-zA-Z0-9_]+\.md$/;
    console.log("pattern", pattern.test(filename));
    if (!pattern.test(filename)) {
      errors.push({
        field: type === "PRD" ? "prdFile" : "rfcFile",
        message: `${type} file must follow format: ${type}_[feature_slug].md`,
        type: "format",
      });
    } else {
      errors = errors.filter((error) => {
        const fieldValue = type === "PRD" ? "prdFile" : "rfcFile";
        return fieldValue !== error.field;
      });
    }
    console.log("errors", errors);
  }
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Get error message for a specific field
 */
export function getPhase5FieldError(
  field: keyof Phase5Inputs,
  validationState: Phase5ValidationState
): string {
  const error = validationState.errors.find((err) => err.field === field);
  return error?.message || "";
}

/**
 * Check if a field has validation errors
 */
export function hasPhase5FieldError(
  field: keyof Phase5Inputs,
  validationState: Phase5ValidationState
): boolean {
  return validationState.errors.some((err) => err.field === field);
}

/**
 * Get all fields with errors
 */
export function getPhase5FieldsWithErrors(
  validationState: Phase5ValidationState
): Array<keyof Phase5Inputs> {
  return validationState.errors.map((err) => err.field);
}

/**
 * Create empty Phase 5 inputs
 */
export function createEmptyPhase5Inputs(): Phase5Inputs {
  return {
    bugTitle: "",
    commitSha: "",
    browserOs: "",
    urlRoute: "",
    severity: "minor",
    prdFile: "",
    featureName: "",
    prdGoalsRelevant: "",
    prdNongoalsRelevant: "",
    prdFrIds: "",
    prdTypesStable: "",
    rfcFile: "",
    rfcAllowlistPaths: "",
    rfcZeroInfraSummary: "",
    rfcOptionalAdjustments: "",
    reproSteps: "",
    expectedBehavior: "",
    actualBehavior: "",
    suspectedRootCause: "",
  };
}

/**
 * Convert Phase 5 inputs to token replacement map
 */
export function phase5InputsToTokenMap(
  inputs: Phase5Inputs
): Record<string, string> {
  return {
    BUG_TITLE: inputs.bugTitle,
    COMMIT_SHA: inputs.commitSha,
    BROWSER_OS: inputs.browserOs,
    URL_ROUTE: inputs.urlRoute,
    PRD_FILE: inputs.prdFile,
    FEATURE_NAME: inputs.featureName,
    PRD_GOALS_RELEVANT: inputs.prdGoalsRelevant,
    PRD_NONGOALS_RELEVANT: inputs.prdNongoalsRelevant,
    PRD_FR_IDS: inputs.prdFrIds,
    PRD_TYPES_STABLE: inputs.prdTypesStable,
    RFC_FILE: inputs.rfcFile,
    RFC_ALLOWLIST_PATHS: inputs.rfcAllowlistPaths,
    RFC_ZERO_INFRA_SUMMARY: inputs.rfcZeroInfraSummary,
    RFC_OPTIONAL_ADJUSTMENTS: inputs.rfcOptionalAdjustments,
    STEP_1: inputs.reproSteps.split("\n")[0] || "",
    STEP_2: inputs.reproSteps.split("\n")[1] || "",
    STEP_3: inputs.reproSteps.split("\n")[2] || "",
    EXPECTED_BEHAVIOR: inputs.expectedBehavior,
    ACTUAL_BEHAVIOR: inputs.actualBehavior,
  };
}
