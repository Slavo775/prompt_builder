<template>
  <div class="app">
    <AppHeader
      :has-unsaved-changes="hasUnsavedChanges"
      @export="exportData"
      @import="importData"
    />

    <div class="app__main">
      <aside class="app__sidebar">
        <PhaseNavigation
          :phases-list="phasesList"
          :current-phase-id="currentPhaseId"
          @phase-change="currentPhaseId = $event"
        />

        <GlobalInputs
          :global-inputs="globalInputs"
          :template="currentPhase.template"
          :phase-inputs="currentPhase.inputs"
        />
      </aside>

      <main class="app__content">
        <PhaseView
          :phase="currentPhase"
          :global-inputs="globalInputs"
          @update:phase="updateCurrentPhase"
        />
      </main>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    >
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {usePhaseBuilderStorage} from "../composables/useLocalStorage";
import {usePhases} from "../composables/usePhases";
import AppHeader from "../components/AppHeader.vue";
import PhaseNavigation from "../components/PhaseNavigation.vue";
import GlobalInputs from "../components/GlobalInputs.vue";
import PhaseView from "../components/PhaseView.vue";
import type {Phase} from "../types";

const storage = usePhaseBuilderStorage();
const fileInput = ref<HTMLInputElement>();

const {
  currentPhaseId,
  updatePhase,
  phasesList,
  currentPhase,
  hasUnsavedChanges,
  exportPhases,
  importPhases,
} = usePhases(storage.value.phases, storage.value.globalInputs);

const globalInputs = storage.value.globalInputs;

const updateCurrentPhase = (updatedPhase: Phase) => {
  updatePhase(updatedPhase.id, updatedPhase);
};

const exportData = () => {
  const data = exportPhases();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `prompt-builder-export-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const importData = () => {
  fileInput.value?.click();
};

const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      importPhases(data);
      target.value = "";
    } catch (error) {
      console.error("Failed to import data:", error);
      alert("Failed to import data. Please check the file format.");
    }
  };
  reader.readAsText(file);
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

.app__main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app__sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.app__content {
  flex: 1;
  overflow: hidden;
}
</style>
