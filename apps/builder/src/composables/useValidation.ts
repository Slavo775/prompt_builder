import {computed, ref, watch, unref} from "vue";
import type {
  ValidationState,
  ValidationError,
  UseValidationReturn,
} from "../config/types";
import type {GlobalInputs} from "../types";
import {validateAllInputs, validateInputField} from "../utils/validation";

export function useValidation(
  template: string | import("vue").Ref<string>,
  globalInputs: GlobalInputs | import("vue").Ref<GlobalInputs>,
  phaseInputs:
    | Record<string, string>
    | import("vue").Ref<Record<string, string>>
): UseValidationReturn {
  const validationState = ref<ValidationState>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  // Computed validation state that updates when inputs or template change
  const computedValidationState = computed(() => {
    return validateAllInputs(
      unref(template),
      unref(globalInputs),
      unref(phaseInputs)
    );
  });

  // Watch for changes and update validation state
  watch(
    computedValidationState,
    (newState) => {
      validationState.value = newState;
    },
    {immediate: true}
  );

  /**
   * Validate a specific input field
   */
  const validateInput = (field: string, value: string): ValidationError[] => {
    // Extract token from field name (e.g., "project-name" -> "PROJECT_NAME")
    const token = field.replace(/-/g, "_").toUpperCase();

    // Check if this is a required token in the template
    const templateTokens = extractTokensFromTemplate(unref(template));
    const isRequired = templateTokens.includes(token);

    return validateInputField(field, value, token, isRequired);
  };

  /**
   * Validate all inputs
   */
  const validateAll = (): ValidationState => {
    const state = validateAllInputs(
      unref(template),
      unref(globalInputs),
      unref(phaseInputs)
    );
    validationState.value = state;
    return state;
  };

  /**
   * Clear validation for a specific field or all fields
   */
  const clearValidation = (field?: string): void => {
    if (field) {
      // Remove errors for specific field
      validationState.value = {
        ...validationState.value,
        errors: validationState.value.errors.filter(
          (error: ValidationError) => error.field !== field
        ),
        isValid: validationState.value.errors.length <= 1,
      };
    } else {
      // Clear all validation
      validationState.value = {
        isValid: true,
        errors: [],
        warnings: [],
      };
    }
  };

  /**
   * Extract tokens from template using regex
   */
  function extractTokensFromTemplate(template: string): string[] {
    const tokenRegex = /\[([A-Z_]+)\]/g;
    const tokens: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(template)) !== null) {
      if (match[1]) {
        tokens.push(match[1]);
      }
    }

    return [...new Set(tokens)]; // Remove duplicates
  }

  return {
    validationState: computed(() => validationState.value),
    validateInput,
    validateAll,
    clearValidation,
  };
}
