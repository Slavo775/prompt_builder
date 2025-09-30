<template>
  <button
    :class="['copy-button', {'copy-button--success': showSuccess}]"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="handleCopy"
  >
    <span
      v-if="!showSuccess"
      class="copy-button__icon"
    >📋</span>
    <span
      v-else
      class="copy-button__icon"
    >✅</span>
    <span class="copy-button__text">
      {{ showSuccess ? "Copied!" : buttonText }}
    </span>
  </button>
</template>

<script setup lang="ts">
import {ref} from "vue";

interface Props {
  text: string;
  buttonText?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: "Copy",
  disabled: false,
  ariaLabel: "Copy to clipboard",
});

const showSuccess = ref(false);
let successTimeout: ReturnType<typeof setTimeout> | null = null;

const handleCopy = async () => {
  if (props.disabled || !props.text) return;

  try {
    await navigator.clipboard.writeText(props.text);
    showSuccess.value = true;

    if (successTimeout) {
      clearTimeout(successTimeout);
    }

    successTimeout = window.setTimeout(() => {
      showSuccess.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy text:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = props.text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    showSuccess.value = true;
    if (successTimeout) {
      clearTimeout(successTimeout);
    }
    successTimeout = window.setTimeout(() => {
      showSuccess.value = false;
    }, 2000);
  }
};
</script>

<style scoped>
.copy-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.copy-button:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.copy-button:active:not(:disabled) {
  transform: translateY(0);
}

.copy-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.copy-button--success {
  background: #28a745;
}

.copy-button__icon {
  font-size: 1rem;
}

.copy-button__text {
  font-size: 0.875rem;
}
</style>
