<template>
  <div class="phase-view">
    <div class="phase-view__header">
      <h2 class="phase-view__title">{{ phase.title }}</h2>
      <div class="phase-view__actions">
        <button
          :class="[
            'phase-view__toggle',
            {'phase-view__toggle--active': phase.overridesEnabled},
          ]"
          @click="toggleOverrides"
          :aria-pressed="phase.overridesEnabled">
          {{ phase.overridesEnabled ? "Custom Template" : "Default Template" }}
        </button>
        <button
          v-if="phase.overridesEnabled"
          class="phase-view__reset"
          @click="resetToDefault">
          Reset to Default
        </button>
      </div>
    </div>

    <div class="phase-view__content">
      <PhaseTemplateEditor :phase="phase" @update:template="updateTemplate" />

      <PhaseInputs :phase="phase" @update:phase="updatePhase" />

      <PhasePreview
        :rendered-template="renderedTemplate"
        :last-output="phase.lastOutput"
        @save-output="saveOutput" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import type {Phase, GlobalInputs} from "../types";
import {useReplacements} from "../composables/useReplacements";
import PhaseTemplateEditor from "./PhaseTemplateEditor.vue";
import PhaseInputs from "./PhaseInputs.vue";
import PhasePreview from "./PhasePreview.vue";

interface Props {
  phase: Phase;
  globalInputs: GlobalInputs;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:phase": [phase: Phase];
}>();

const {replaceTokens} = useReplacements(props.globalInputs, props.phase.inputs);

const renderedTemplate = computed(() => {
  return replaceTokens(props.phase.template);
});

const toggleOverrides = () => {
  const updatedPhase = {
    ...props.phase,
    overridesEnabled: !props.phase.overridesEnabled,
  };
  emit("update:phase", updatedPhase);
};

const resetToDefault = () => {
  const updatedPhase = {
    ...props.phase,
    overridesEnabled: false,
    inputs: {},
    lastOutput: "",
  };
  emit("update:phase", updatedPhase);
};

const updateTemplate = (template: string) => {
  const updatedPhase = {...props.phase, template};
  emit("update:phase", updatedPhase);
};

const updatePhase = (phase: Phase) => {
  emit("update:phase", phase);
};

const saveOutput = (output: string) => {
  const updatedPhase = {...props.phase, lastOutput: output};
  emit("update:phase", updatedPhase);
};
</script>

<style scoped>
.phase-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.phase-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.phase-view__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.phase-view__actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.phase-view__toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-view__toggle:hover {
  background: #f9fafb;
}

.phase-view__toggle--active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.phase-view__reset {
  padding: 0.5rem 1rem;
  border: 1px solid #dc2626;
  background: white;
  color: #dc2626;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.phase-view__reset:hover {
  background: #dc2626;
  color: white;
}

.phase-view__content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  overflow: hidden;
}
</style>
