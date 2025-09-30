<template>
  <div class="phase-inputs">
    <h3 class="phase-inputs__title">Phase-Specific Inputs</h3>
    <div class="phase-inputs__list">
      <div
        v-for="(_, key) in phase.inputs"
        :key="key"
        class="phase-inputs__row">
        <input
          v-model="phase.inputs[key]"
          :placeholder="`Value for ${key}`"
          class="phase-inputs__value" />
        <button
          @click="removeInput(key)"
          class="phase-inputs__remove"
          :aria-label="`Remove input ${key}`">
          ×
        </button>
      </div>
      <div class="phase-inputs__add">
        <input
          v-model="newInputKey"
          placeholder="New input key"
          class="phase-inputs__key"
          @keyup.enter="addInput" />
        <button
          @click="addInput"
          :disabled="!newInputKey.trim()"
          class="phase-inputs__add-button">
          Add Input
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {Phase} from "../types";

interface Props {
  phase: Phase;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:phase": [phase: Phase];
}>();

const newInputKey = ref("");

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
  const {[key]: removed, ...remainingInputs} = props.phase.inputs;
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
</style>
