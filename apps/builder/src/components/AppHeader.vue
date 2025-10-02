<template>
  <header class="app-header">
    <h1 class="app-header__title">
      Prompt Builder
    </h1>
    <div class="app-header__actions">
      <button
        class="app-header__button"
        :disabled="!hasUnsavedChanges"
        @click="$emit('export')"
      >
        Export
      </button>
      <button
        class="app-header__button"
        @click="$emit('import')"
      >
        Import
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type {ViewType} from "../types";

interface Props {
  hasUnsavedChanges: boolean;
  currentView?: ViewType;
}

defineProps<Props>();

defineEmits<{
  export: [];
  import: [];
}>();
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.app-header__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.app-header__actions {
  display: flex;
  gap: 0.75rem;
}

.app-header__button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.app-header__button:hover:not(:disabled) {
  background: #f9fafb;
}

.app-header__button:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
