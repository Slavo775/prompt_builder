<template>
  <div class="phase5-input-field">
    <label
      :for="fieldId"
      class="phase5-input-field__label"
    >
      {{ fieldConfig.label }}
      <span
        v-if="fieldConfig.required"
        class="phase5-input-field__required"
        aria-label="required"
      >
        *
      </span>
    </label>

    <div class="phase5-input-field__input-container">
      <!-- Text Input -->
      <input
        v-if="fieldConfig.type === 'text'"
        :id="fieldId"
        :value="modelValue || ''"
        :placeholder="fieldConfig.placeholder"
        :disabled="disabled"
        :class="[
          'phase5-input-field__input',
          'phase5-input-field__input--text',
          {
            'phase5-input-field__input--error': errorMessage,
          },
        ]"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        @input="handleInput"
      >

      <!-- Textarea -->
      <textarea
        v-else-if="fieldConfig.type === 'textarea'"
        :id="fieldId"
        :value="modelValue || ''"
        :placeholder="fieldConfig.placeholder"
        :disabled="disabled"
        :rows="getTextareaRows()"
        :class="[
          'phase5-input-field__input',
          'phase5-input-field__input--textarea',
          {
            'phase5-input-field__input--error': errorMessage,
          },
        ]"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        @input="handleInput"
      />

      <!-- Select -->
      <select
        v-else-if="fieldConfig.type === 'select'"
        :id="fieldId"
        :value="modelValue || ''"
        :disabled="disabled"
        :class="[
          'phase5-input-field__input',
          'phase5-input-field__input--select',
          {
            'phase5-input-field__input--error': errorMessage,
          },
        ]"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        @change="handleInput"
      >
        <option value="">
          Select {{ fieldConfig.label.toLowerCase() }}
        </option>
        <option
          v-for="option in fieldConfig.options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>

      <!-- URL Input -->
      <input
        v-else-if="fieldConfig.type === 'url'"
        :id="fieldId"
        :value="modelValue || ''"
        :placeholder="fieldConfig.placeholder"
        :disabled="disabled"
        type="url"
        :class="[
          'phase5-input-field__input',
          'phase5-input-field__input--url',
          {
            'phase5-input-field__input--error': errorMessage,
          },
        ]"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        @input="handleInput"
      >

      <!-- Commit SHA Input -->
      <input
        v-else-if="fieldConfig.type === 'commit-sha'"
        :id="fieldId"
        :value="modelValue || ''"
        :placeholder="fieldConfig.placeholder"
        :disabled="disabled"
        :class="[
          'phase5-input-field__input',
          'phase5-input-field__input--commit-sha',
          {
            'phase5-input-field__input--error': errorMessage,
          },
        ]"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
        @input="handleInput"
      >
    </div>

    <!-- Help Text -->
    <div
      v-if="fieldConfig.helpText && !errorMessage"
      :id="`${fieldId}-help`"
      class="phase5-input-field__help"
    >
      {{ fieldConfig.helpText }}
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      :id="`${fieldId}-error`"
      class="phase5-input-field__error"
      role="alert"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {Phase5InputFieldProps} from "../config/types";

const props = defineProps<Phase5InputFieldProps>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// Generate unique field ID
const fieldId = computed(() => `phase5-${props.fieldConfig.key}`);

// Compute ARIA attributes
const ariaDescribedBy = computed(() => {
  const ids: string[] = [];

  if (props.fieldConfig.helpText && !props.errorMessage) {
    ids.push(`${fieldId.value}-help`);
  }

  if (props.errorMessage) {
    ids.push(`${fieldId.value}-error`);
  }

  return ids.length > 0 ? ids.join(" ") : undefined;
});

const ariaInvalid = computed(() => {
  return props.errorMessage ? "true" : "false";
});

// Handle input changes
const handleInput = (event: Event): void => {
  const target = event.target as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;
  emit("update:modelValue", target.value);
};

// Get textarea rows based on field type
const getTextareaRows = (): number => {
  const field = props.fieldConfig.key;

  // Longer textareas for more complex fields
  if (
    field === "reproSteps" ||
    field === "prdGoalsRelevant" ||
    field === "prdNongoalsRelevant"
  ) {
    return 4;
  }

  if (
    field === "rfcAllowlistPaths" ||
    field === "rfcZeroInfraSummary" ||
    field === "rfcOptionalAdjustments"
  ) {
    return 3;
  }

  return 2;
};
</script>

<style scoped>
.phase5-input-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.phase5-input-field__label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.phase5-input-field__required {
  color: #dc2626;
  font-weight: 600;
}

.phase5-input-field__input-container {
  position: relative;
}

.phase5-input-field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.phase5-input-field__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.phase5-input-field__input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.phase5-input-field__input--error {
  border-color: #dc2626;
}

.phase5-input-field__input--error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.phase5-input-field__input--textarea {
  resize: vertical;
  min-height: 2.5rem;
  font-family: inherit;
}

.phase5-input-field__input--select {
  cursor: pointer;
}

.phase5-input-field__input--url {
  font-family: monospace;
}

.phase5-input-field__input--commit-sha {
  font-family: monospace;
}

.phase5-input-field__help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.phase5-input-field__error {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
}
</style>
