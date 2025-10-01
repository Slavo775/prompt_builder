<template>
  <div class="phase5-severity-select">
    <label
      for="phase5-severity"
      class="phase5-severity-select__label"
    >
      Severity
      <span
        class="phase5-severity-select__required"
        aria-label="required"
      >
        *
      </span>
    </label>

    <select
      id="phase5-severity"
      :value="modelValue || ''"
      :disabled="disabled"
      :class="[
        'phase5-severity-select__select',
        {
          'phase5-severity-select__select--error': errorMessage,
        },
      ]"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="ariaInvalid"
      @change="handleChange"
    >
      <option value="">
        Select severity level
      </option>
      <option
        v-for="severity in severityOptions"
        :key="severity.value"
        :value="severity.value"
      >
        {{ severity.label }}
      </option>
    </select>

    <!-- Help Text -->
    <div
      v-if="!errorMessage"
      id="phase5-severity-help"
      class="phase5-severity-select__help"
    >
      Impact level of the bug
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      id="phase5-severity-error"
      class="phase5-severity-select__error"
      role="alert"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {BugSeverity} from "../config/types";

interface Props {
  modelValue?: BugSeverity;
  disabled?: boolean;
  errorMessage?: string;
  ariaDescribedby?: string;
  ariaInvalid?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  disabled: false,
  errorMessage: "",
  ariaDescribedby: "",
  ariaInvalid: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: BugSeverity];
}>();

// Severity options with labels
const severityOptions = [
  {value: "blocker", label: "Blocker - System unusable"},
  {value: "critical", label: "Critical - Major functionality broken"},
  {value: "major", label: "Major - Significant functionality affected"},
  {value: "minor", label: "Minor - Small functionality issue"},
  {value: "trivial", label: "Trivial - Cosmetic issue"},
] as const;

// Compute ARIA attributes
const ariaDescribedBy = computed(() => {
  const ids: string[] = [];

  if (!props.errorMessage) {
    ids.push("phase5-severity-help");
  }

  if (props.errorMessage) {
    ids.push("phase5-severity-error");
  }

  return ids.length > 0 ? ids.join(" ") : undefined;
});

const ariaInvalid = computed(() => {
  return props.errorMessage ? "true" : "false";
});

// Handle select change
const handleChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value as BugSeverity);
};
</script>

<style scoped>
.phase5-severity-select {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.phase5-severity-select__label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.phase5-severity-select__required {
  color: #dc2626;
  font-weight: 600;
}

.phase5-severity-select__select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.phase5-severity-select__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.phase5-severity-select__select:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.phase5-severity-select__select--error {
  border-color: #dc2626;
}

.phase5-severity-select__select--error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.phase5-severity-select__help {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.phase5-severity-select__error {
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
}
</style>
