<template>
  <div class="phase-preview">
    <div class="phase-preview__header">
      <h3 class="phase-preview__title">
        Preview
      </h3>
      <div class="phase-preview__actions">
        <CopyButton
          :text="renderedTemplate"
          button-text="Copy Prompt"
          :disabled="!renderedTemplate"
        />
        <CopyButton
          :text="lastOutput"
          button-text="Copy Output"
          :disabled="!lastOutput"
        />
        <button
          class="phase-preview__save-button"
          :disabled="!renderedTemplate"
          @click="saveOutput"
        >
          Save Output
        </button>
      </div>
    </div>
    <div class="phase-preview__content">
      <pre class="phase-preview__text">{{ renderedTemplate }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import CopyButton from "./CopyButton.vue";

interface Props {
  renderedTemplate: string;
  lastOutput: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "save-output": [output: string];
}>();

const saveOutput = () => {
  emit("save-output", props.renderedTemplate);
};
</script>

<style scoped>
.phase-preview {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.phase-preview__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.phase-preview__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.phase-preview__save-button {
  padding: 0.5rem 1rem;
  border: 1px solid #10b981;
  background: #10b981;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-preview__save-button:hover:not(:disabled) {
  background: #059669;
}

.phase-preview__save-button:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.phase-preview__title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.phase-preview__content {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.phase-preview__text {
  margin: 0;
  padding: 1rem;
  background: #f9fafb;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  height: 100%;
  overflow-y: auto;
}
</style>
