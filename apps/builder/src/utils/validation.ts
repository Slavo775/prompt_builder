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

  // Convert GlobalInputs to a record for token analysis
  const globalInputsRecord: Record<string, string> = {
    PROJECT_NAME: globalInputs.projectName,
    FEATURE_NAME: globalInputs.featureName,
    FEATURE_SLUG: globalInputs.featureSlug,
    OWNER: globalInputs.owner,
    REPO_URL: globalInputs.repoUrl || "",
    STACK: globalInputs.stack,
    DATE_ISO: globalInputs.dateIso,
    REQUIREMENTS: globalInputs.requirements,
  };

  const tokenAnalysis = analyzeTokens(
    template,
    globalInputsRecord,
    phaseInputs
  );

  // Check for missing global inputs (tokens that appear in template but have no value)
  tokenAnalysis.tokens.forEach((token: string) => {
    // Check if this token should be handled by global inputs
    if (Object.prototype.hasOwnProperty.call(globalInputsRecord, token)) {
      const globalValue = globalInputsRecord[token];
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
    } else {
      // Token is not a global input, report it so phase validation can handle it
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

  // Convert GlobalInputs to a record for token analysis
  const globalInputsRecord: Record<string, string> = {
    PROJECT_NAME: globalInputs.projectName,
    FEATURE_NAME: globalInputs.featureName,
    FEATURE_SLUG: globalInputs.featureSlug,
    OWNER: globalInputs.owner,
    REPO_URL: globalInputs.repoUrl || "",
    STACK: globalInputs.stack,
    DATE_ISO: globalInputs.dateIso,
    REQUIREMENTS: globalInputs.requirements,
  };

  const tokenAnalysis = analyzeTokens(
    template,
    globalInputsRecord,
    phaseInputs
  );

  // Check for missing phase inputs (tokens that appear in template but have no value)
  tokenAnalysis.missingTokens.forEach((token: string) => {
    // Only validate if it's not a global input
    if (!Object.prototype.hasOwnProperty.call(globalInputsRecord, token)) {
      const phaseValue = phaseInputs[token];
      if (!phaseValue || phaseValue.trim() === "") {
        errors.push(
          createValidationError(
            `phase-input-${token}`,
            token,
            `Missing required input: ${token}. Please provide a value for this phase-specific input.`
          )
        );
      }
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
    REQUIREMENTS: "requirements",
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

  // Filter out global errors for tokens that are handled by phase inputs
  const filteredGlobalErrors = globalErrors.filter((error) => {
    // If this token is in phase inputs and has a value, it's not a global error
    const phaseValue = phaseInputs[error.token];
    return !phaseValue || phaseValue.trim() === "";
  });

  const errors = [...filteredGlobalErrors, ...phaseErrors];
  const warnings: ValidationWarning[] = [];

  // Add warnings for unused inputs
  const globalInputsRecord: Record<string, string> = {
    PROJECT_NAME: globalInputs.projectName,
    FEATURE_NAME: globalInputs.featureName,
    FEATURE_SLUG: globalInputs.featureSlug,
    OWNER: globalInputs.owner,
    REPO_URL: globalInputs.repoUrl || "",
    STACK: globalInputs.stack,
    DATE_ISO: globalInputs.dateIso,
  };

  const tokenAnalysis = analyzeTokens(
    template,
    globalInputsRecord,
    phaseInputs
  );

  // Only generate warnings for unused phase inputs, not global inputs
  tokenAnalysis.unusedTokens.forEach((token: string) => {
    // Check if this is a phase input (not a global input)
    if (phaseInputs[token]) {
      warnings.push(
        createValidationWarning(
          `unused-input-${token}`,
          token,
          `Input "${token}" is defined but not used in the current template.`
        )
      );
    }
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
