<template>
  <div class="requirements-input">
    <label
      :for="inputId"
      class="requirements-input__label"
    >
      {{ label }}
      <span
        v-if="required"
        class="requirements-input__required"
      >*</span>
    </label>
    <textarea
      :id="inputId"
      v-model="localValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :maxlength="maxLength"
      :aria-describedby="
        ariaDescribedBy || (hasError ? `${inputId}-error` : undefined)
      "
      :aria-invalid="hasError ? 'true' : 'false'"
      class="requirements-input__textarea"
      :class="{
        'requirements-input__textarea--error': hasError,
        'requirements-input__textarea--disabled': disabled,
      }"
      @input="handleInput"
      @blur="handleBlur"
    />
    <div
      v-if="hasError"
      :id="`${inputId}-error`"
      class="requirements-input__error"
      role="alert"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="helpText"
      class="requirements-input__help"
    >
      {{ helpText }}
    </div>
    <div
      v-if="maxLength"
      class="requirements-input__counter"
    >
      {{ (localValue || "").length }}/{{ maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, computed} from "vue";
import type {RequirementsInputProps} from "../config/types";

const props = withDefaults(defineProps<RequirementsInputProps>(), {
  placeholder: "Enter project requirements...",
  rows: 6,
  disabled: false,
  required: false,
  helpText:
    "Use [REQUIREMENTS] token in templates to include these requirements",
  label: "Project Requirements",
  maxLength: 5000,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  error: [error: string | null];
}>();

const inputId =
  props.id || `requirements-input-${Math.random().toString(36).substr(2, 9)}`;
const localValue = ref(props.modelValue || "");

const hasError = computed(() => Boolean(props.errorMessage));

const handleInput = () => {
  emit("update:modelValue", localValue.value);
  if (hasError.value) {
    emit("error", null);
  }
};

const handleBlur = () => {
  if (props.required && !localValue.value.trim()) {
    emit("error", "Requirements are required");
  }
  // Only emit null if there was a previous error
  if (hasError.value) {
    emit("error", null);
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue || "";
  }
);
</script>

<style scoped>
.requirements-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.requirements-input__label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.requirements-input__required {
  color: #dc2626;
  font-weight: 600;
}

.requirements-input__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: #ffffff;
}

.requirements-input__textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.requirements-input__textarea--error {
  border-color: #dc2626;
}

.requirements-input__textarea--error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.requirements-input__textarea--disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.requirements-input__error {
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.requirements-input__help {
  color: #6b7280;
  font-size: 0.75rem;
  line-height: 1.4;
}

.requirements-input__counter {
  color: #6b7280;
  font-size: 0.75rem;
  text-align: right;
  margin-top: -0.25rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .requirements-input__textarea {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}
</style>
