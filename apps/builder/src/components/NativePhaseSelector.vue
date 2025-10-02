<template>
  <div class="native-phase-selector">
    <label :for="fieldConfig.id" class="native-phase-selector__label">
      {{ label || "Current Phase" }}
    </label>
    <select
      :id="fieldConfig.id"
      :name="fieldConfig.name"
      :value="currentPhaseId"
      :disabled="disabled"
      :required="fieldConfig.required"
      :aria-invalid="!validation.valid"
      :aria-describedby="
        validation.valid ? undefined : `${fieldConfig.id}-error`
      "
      class="native-phase-selector__select"
      @change="handlers.onChange"
      @focus="handlers.onFocus"
      @blur="handlers.onBlur">
      <option
        v-for="option in formattedOptions"
        :key="option.value"
        :value="option.value"
        :selected="option.selected"
        :disabled="option.disabled">
        {{ option.text }}
      </option>
    </select>
    <div
      v-if="!validation.valid"
      :id="`${fieldConfig.id}-error`"
      class="native-phase-selector__error"
      role="alert">
      {{ validation.validationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useNativePhaseSelector} from "../composables/useNativePhaseSelector";
import type {
  NativePhaseSelectorProps,
  NativePhaseSelectorEmits,
} from "../types";

const props = withDefaults(defineProps<NativePhaseSelectorProps>(), {
  disabled: false,
  label: "Current Phase",
  id: "native-phase-selector",
  required: false,
});

const emit = defineEmits<NativePhaseSelectorEmits>();

// Convert props to refs for composable
const phasesListRef = computed(() => props.phasesList);
const currentPhaseIdRef = computed(() => props.currentPhaseId);

// Use native phase selector composable
const {formattedOptions, fieldConfig, handlers, validation} =
  useNativePhaseSelector(phasesListRef, currentPhaseIdRef, emit, {
    id: props.id,
    required: props.required,
    maxOptionLength: 40,
  });
</script>

<style scoped>
.native-phase-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 1rem 0 1rem;
}

.native-phase-selector__label {
  color: #374151;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.native-phase-selector__select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  background-color: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.native-phase-selector__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.native-phase-selector__select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.native-phase-selector__select[aria-invalid="true"] {
  border-color: #dc2626;
}

.native-phase-selector__select[aria-invalid="true"]:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.native-phase-selector__error {
  font-size: 0.75rem;
  color: #dc2626;
  margin: 0;
}

/* Ensure consistent styling with GlobalInputs */
.native-phase-selector__select {
  /* Match GlobalInputs padding exactly */
  padding: 0.5rem;
  /* Match GlobalInputs border styling */
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  /* Match GlobalInputs typography */
  font-size: 0.875rem;
  /* Match GlobalInputs focus states */
}

.native-phase-selector__select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.native-phase-selector__error {
  /* Match GlobalInputs error styling */
  font-size: 0.75rem;
  color: #dc2626;
}
</style>
