<template>
  <div class="phase-inputs">
    <h3 class="phase-inputs__title">Phase-Specific Inputs</h3>
    <div class="phase-inputs__list">
      <template v-for="(value, inputKey) in phase.inputs" :key="inputKey">
        <div class="phase-inputs__row">
          <input
            :value="value"
            :placeholder="`Value for ${inputKey}`"
            :class="[
              'phase-inputs__value',
              {
                'phase-inputs__value--error': getFieldError(
                  `phase-input-${inputKey}`
                ),
              },
            ]"
            :aria-describedby="
              getFieldError(`phase-input-${inputKey}`)
                ? `phase-input-${inputKey}-error`
                : undefined
            "
            :aria-invalid="
              getFieldError(`phase-input-${inputKey}`) ? 'true' : 'false'
            "
            @input="
              updatePhaseInput(
                inputKey,
                ($event.target as HTMLInputElement).value
              )
            " />
          <button
            class="phase-inputs__remove"
            :aria-label="`Remove input ${inputKey}`"
            @click="removeInput(inputKey)">
            ×
          </button>
        </div>
        <!-- Error messages for phase inputs -->
        <div
          v-if="getFieldError(`phase-input-${inputKey}`)"
          :id="`phase-input-${inputKey}-error`"
          class="phase-inputs__error"
          role="alert">
          {{ getFieldError(`phase-input-${inputKey}`) }}
        </div>
      </template>
      <div class="phase-inputs__add">
        <input
          v-model="newInputKey"
          placeholder="New input key"
          class="phase-inputs__key"
          @keyup.enter="addInput" />
        <button
          :disabled="!newInputKey.trim()"
          class="phase-inputs__add-button"
          @click="addInput">
          Add Input
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {Phase, BackendPhase} from "../types";
import type {GlobalInputs} from "../types";
import type {ValidationError} from "../config/types";
import {useValidation} from "../composables/useValidation";

interface Props {
  phase: Phase | BackendPhase;
  globalInputs?: GlobalInputs;
  template?: string;
}

const props = withDefaults(defineProps<Props>(), {
  globalInputs: () => ({
    projectName: "",
    featureName: "",
    featureSlug: "",
    requirements: "",
    packageManager: "pnpm",
    isMonorepo: true,
  }),
  template: "",
});

const emit = defineEmits<{
  "update:phase": [phase: Phase | BackendPhase];
}>();

const newInputKey = ref("");

// Use validation composable
const {validationState} = useValidation(
  props.template,
  props.globalInputs,
  props.phase.inputs
);

// Get error message for a specific field
const getFieldError = (fieldName: string): string => {
  const error = validationState.value.errors.find(
    (err: ValidationError) => err.field === fieldName
  );
  return error?.message || "";
};

const updatePhaseInput = (key: string, value: string) => {
  const updatedPhase = {
    ...props.phase,
    inputs: {...props.phase.inputs, [key]: value},
  };
  emit("update:phase", updatedPhase);
};

const addInput = () => {
  if (!newInputKey.value.trim()) return;

  const key = newInputKey.value.trim().toUpperCase();
  const updatedPhase = {
    ...props.phase,
    inputs: {...props.phase.inputs, [key]: ""},
  };
  emit("update:phase", updatedPhase);
  newInputKey.value = "";
};

const removeInput = (key: string) => {
  // eslint-disable-next-line no-unused-vars
  const {[key]: _, ...remainingInputs} = props.phase.inputs;
  const updatedPhase = {
    ...props.phase,
    inputs: remainingInputs,
  };
  emit("update:phase", updatedPhase);
};
</script>

<style scoped>
.phase-inputs {
  display: flex;
  flex-direction: column;
}

.phase-inputs__title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.phase-inputs__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.phase-inputs__row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.phase-inputs__value {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.phase-inputs__remove {
  width: 2rem;
  height: 2rem;
  border: 1px solid #dc2626;
  background: white;
  color: #dc2626;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phase-inputs__remove:hover {
  background: #dc2626;
  color: white;
}

.phase-inputs__add {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.phase-inputs__key {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.phase-inputs__add-button {
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-inputs__add-button:hover:not(:disabled) {
  background: #2563eb;
}

.phase-inputs__add-button:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.phase-inputs__value--error {
  border-color: #dc2626;
}

.phase-inputs__value--error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.phase-inputs__error {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  display: block;
}
</style>
