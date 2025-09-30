<template>
  <div class="json-editor">
    <label
      :for="inputId"
      class="json-editor__label"
    >
      {{ label }}
      <span
        v-if="required"
        class="json-editor__required"
      >*</span>
    </label>
    <textarea
      :id="inputId"
      v-model="localValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      class="json-editor__textarea"
      :class="{'json-editor__textarea--error': hasError}"
      @blur="validateJson"
      @input="handleInput"
    />
    <div
      v-if="hasError"
      class="json-editor__error"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="helpText"
      class="json-editor__help"
    >
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

interface Props {
  modelValue: string;
  label: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  validateJson?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  rows: 4,
  disabled: false,
  required: false,
  helpText: "",
  validateJson: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  error: [error: string | null];
}>();

const inputId = `json-editor-${Math.random().toString(36).substr(2, 9)}`;
const localValue = ref(props.modelValue);
const hasError = ref(false);
const errorMessage = ref("");

const validateJson = () => {
  if (!props.validateJson) {
    hasError.value = false;
    errorMessage.value = "";
    emit("error", null);
    return;
  }

  if (!localValue.value.trim()) {
    hasError.value = false;
    errorMessage.value = "";
    emit("error", null);
    return;
  }

  try {
    JSON.parse(localValue.value);
    hasError.value = false;
    errorMessage.value = "";
    emit("error", null);
  } catch (error) {
    hasError.value = true;
    errorMessage.value =
      error instanceof Error ? error.message : "Invalid JSON";
    emit("error", errorMessage.value);
  }
};

const handleInput = () => {
  emit("update:modelValue", localValue.value);
  if (hasError.value) {
    validateJson();
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
    if (props.validateJson) {
      validateJson();
    }
  }
);
</script>

<style scoped>
.json-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.json-editor__label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.json-editor__required {
  color: #dc2626;
  margin-left: 0.25rem;
}

.json-editor__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
}

.json-editor__textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.json-editor__textarea--error {
  border-color: #dc2626;
}

.json-editor__textarea--error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.json-editor__error {
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 500;
}

.json-editor__help {
  color: #6b7280;
  font-size: 0.75rem;
}
</style>
