import type {
  ValidationState,
  ValidationError,
  ValidationWarning,
  ValidationRule,
} from "../config/types";
import type {GlobalInputs} from "../types";
import {analyzeTokens} from "./tokenParser";

/**
 * Create validation error
 */
export function createValidationError(
  field: string,
  token: string,
  message: string,
  type: "required" | "format" | "custom" = "required"
): ValidationError {
  return {
    field,
    token,
    message,
    type,
  };
}

/**
 * Create validation warning
 */
export function createValidationWarning(
  field: string,
  token: string,
  message: string,
  type: "suggestion" | "deprecation" = "suggestion"
): ValidationWarning {
  return {
    field,
    token,
    message,
    type,
  };
}

/**
 * Validate global inputs against template requirements
 */
export function validateGlobalInputs(
  globalInputs: GlobalInputs,
  template: string,
  phaseInputs: Record<string, string> = {}
): ValidationError[] {
  const errors: ValidationError[] = [];
  const globalInputsAsRecord = globalInputs as unknown as Record<
    string,
    string
  >;
  const tokenAnalysis = analyzeTokens(
    template,
    globalInputsAsRecord,
    phaseInputs
  );

  // Check for missing global inputs (tokens that appear in template but have no value)
  tokenAnalysis.missingTokens.forEach((token: string) => {
    // Check if this token should be handled by global inputs
    const globalValue = globalInputs[token as keyof GlobalInputs];
    if (!globalValue || globalValue.trim() === "") {
      const fieldName = getGlobalInputFieldName(token);
      errors.push(
        createValidationError(
          fieldName,
          token,
          `Missing required input: ${token}. Please provide a value for ${fieldName}.`
        )
      );
    }
  });

  return errors;
}

/**
 * Validate phase inputs against template requirements
 */
export function validatePhaseInputs(
  phaseInputs: Record<string, string>,
  template: string,
  globalInputs: GlobalInputs
): ValidationError[] {
  const errors: ValidationError[] = [];
  const globalInputsAsRecord = globalInputs as unknown as Record<
    string,
    string
  >;
  const tokenAnalysis = analyzeTokens(
    template,
    globalInputsAsRecord,
    phaseInputs
  );

  // Check for missing phase inputs (tokens that appear in template but have no value)
  tokenAnalysis.missingTokens.forEach((token: string) => {
    const globalValue = globalInputs[token as keyof GlobalInputs];
    const phaseValue = phaseInputs[token];

    // Only validate if it's not a global input and not a phase input
    if (
      (!globalValue || globalValue.trim() === "") &&
      (!phaseValue || phaseValue.trim() === "")
    ) {
      errors.push(
        createValidationError(
          `phase-input-${token}`,
          token,
          `Missing required input: ${token}. Please provide a value for this phase-specific input.`
        )
      );
    }
  });

  return errors;
}

/**
 * Get human-readable field name for global inputs
 */
function getGlobalInputFieldName(token: string): string {
  const fieldMap: Record<string, string> = {
    PROJECT_NAME: "project-name",
    FEATURE_NAME: "feature-name",
    FEATURE_SLUG: "feature-slug",
    OWNER: "owner",
    REPO_URL: "repo-url",
    STACK: "stack",
    DATE_ISO: "date",
  };

  return fieldMap[token] || token.toLowerCase().replace(/_/g, "-");
}

/**
 * Validate all inputs against template
 */
export function validateAllInputs(
  template: string,
  globalInputs: GlobalInputs,
  phaseInputs: Record<string, string>
): ValidationState {
  const globalErrors = validateGlobalInputs(
    globalInputs,
    template,
    phaseInputs
  );
  const phaseErrors = validatePhaseInputs(phaseInputs, template, globalInputs);

  const errors = [...globalErrors, ...phaseErrors];
  const warnings: ValidationWarning[] = [];

  // Add warnings for unused inputs
  const globalInputsAsRecord = globalInputs as unknown as Record<
    string,
    string
  >;
  const tokenAnalysis = analyzeTokens(
    template,
    globalInputsAsRecord,
    phaseInputs
  );
  tokenAnalysis.unusedTokens.forEach((token: string) => {
    warnings.push(
      createValidationWarning(
        `unused-input-${token}`,
        token,
        `Input "${token}" is defined but not used in the current template.`
      )
    );
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate single input field
 */
export function validateInputField(
  field: string,
  value: string,
  token: string,
  isRequired: boolean = false
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (isRequired && (!value || value.trim() === "")) {
    errors.push(
      createValidationError(
        field,
        token,
        `Required input cannot be empty: ${token}. Please provide a value.`
      )
    );
  }

  return errors;
}

/**
 * Get validation rules for a template
 */
export function getValidationRules(template: string): ValidationRule[] {
  const tokenAnalysis = analyzeTokens(template, {}, {});

  return tokenAnalysis.tokens.map((token: string) => ({
    token,
    required: true,
    message: `Input "${token}" is required for this template.`,
  }));
}
