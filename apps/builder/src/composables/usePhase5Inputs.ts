import {ref, computed, watch} from "vue";
import type {
  Phase5Inputs,
  Phase5ValidationState,
  Phase5ValidationError,
  UsePhase5InputsReturn,
} from "../config/types";
import {
  createEmptyPhase5Inputs,
  validatePhase5Inputs,
  getPhase5FieldError,
} from "../utils/phase5Validation";

/**
 * Composable for managing Phase 5 inputs and validation
 */
export function usePhase5Inputs(
  initialInputs?: Partial<Phase5Inputs>
): UsePhase5InputsReturn {
  // Initialize inputs with defaults
  const inputs = ref<Phase5Inputs>({
    ...createEmptyPhase5Inputs(),
    ...initialInputs,
  });

  // Validation state
  const validationState = ref<Phase5ValidationState>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  // Computed validation state that updates when inputs change
  const computedValidationState = computed(() => {
    return validatePhase5Inputs(inputs.value);
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
   * Update a specific input field
   */
  const updateInput = (field: keyof Phase5Inputs, value: string): void => {
    inputs.value = {
      ...inputs.value,
      [field]: value,
    };
  };

  /**
   * Validate a specific input field
   */
  const validateInput = (
    field: keyof Phase5Inputs
  ): Phase5ValidationError[] => {
    const validationState = validatePhase5Inputs(inputs.value);
    return validationState.errors.filter((error) => error.field === field);
  };

  /**
   * Validate all inputs
   */
  const validateAll = (): Phase5ValidationState => {
    const state = validatePhase5Inputs(inputs.value);
    validationState.value = state;
    return state;
  };

  /**
   * Reset all inputs to empty state
   */
  const resetInputs = (): void => {
    inputs.value = createEmptyPhase5Inputs();
  };

  /**
   * Get error message for a specific field
   */
  const getFieldError = (field: keyof Phase5Inputs): string => {
    return getPhase5FieldError(field, validationState.value);
  };

  return {
    inputs,
    validationState: computed(() => validationState.value),
    updateInput,
    validateInput,
    validateAll,
    resetInputs,
    getFieldError,
  };
}
