<template>
  <nav class="phase-nav">
    <button
      v-for="phase in phasesList"
      :key="phase.id"
      :class="[
        'phase-nav__item',
        {'phase-nav__item--active': currentPhaseId === phase.id},
      ]"
      :aria-current="currentPhaseId === phase.id ? 'page' : undefined"
      @click="$emit('phase-change', phase.id)"
    >
      <span class="phase-nav__number">{{ phase.id }}</span>
      <span class="phase-nav__title">{{ phase.title }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import type {Phase, BackendPhase, AnyPhaseId, ViewType} from "../types";

interface Props {
  phasesList: (Phase | BackendPhase)[];
  currentPhaseId: AnyPhaseId;
  viewType?: ViewType;
}

defineProps<Props>();

defineEmits<{
  "phase-change": [phaseId: AnyPhaseId];
}>();
</script>

<style scoped>
.phase-nav {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.phase-nav__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.phase-nav__item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.phase-nav__item--active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.phase-nav__item--active:hover {
  background: #2563eb;
}

.phase-nav__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
}

.phase-nav__item--active .phase-nav__number {
  background: rgba(255, 255, 255, 0.3);
}

.phase-nav__title {
  font-weight: 500;
  font-size: 0.875rem;
}
</style>
