<template>
  <div class="app">
    <AppHeader
      :has-unsaved-changes="hasUnsavedChanges"
      :current-view="currentView"
      @export="exportData"
      @import="importData"
    />

    <TabNavigation
      :current-view="currentView"
      @view-change="handleViewChange"
    />

    <div class="app__main">
      <ViewContainer
        :view-type="currentView"
        :view-state="currentViewStateRef"
      >
        <template #default="{viewType}">
          <aside class="app__sidebar">
            <PhaseNavigation
              :phases-list="phasesList"
              :current-phase-id="currentPhaseId"
              :view-type="viewType"
              @phase-change="handlePhaseChange"
            />

            <GlobalInputs
              :global-inputs="globalInputs"
              :template="currentPhase.template"
              :phase-inputs="currentPhase.inputs"
              @update:global-inputs="updateGlobalInputs"
            />
          </aside>

          <main class="app__content">
            <PhaseView
              :phase="currentPhase"
              :global-inputs="globalInputs"
              :view-type="viewType"
              @update:phase="updateCurrentPhase"
            />
          </main>
        </template>
      </ViewContainer>
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
import {ref, computed} from "vue";
import {usePhaseBuilderStorage} from "../composables/useLocalStorage";
import {useViewManagement} from "../composables/useViewManagement";
import {useViewAwarePhases} from "../composables/useViewAwarePhases";
import AppHeader from "../components/AppHeader.vue";
import TabNavigation from "../components/TabNavigation.vue";
import ViewContainer from "../components/ViewContainer.vue";
import PhaseNavigation from "../components/PhaseNavigation.vue";
import GlobalInputs from "../components/GlobalInputs.vue";
import PhaseView from "../components/PhaseView.vue";
import type {
  Phase,
  BackendPhase,
  GlobalInputs as GlobalInputsType,
  ViewType,
  AnyPhaseId,
  ViewAwareExportData,
} from "../types";

const storage = usePhaseBuilderStorage();
const fileInput = ref<HTMLInputElement>();

const {
  currentView,
  getCurrentViewState,
  updateCurrentViewState,
  switchView,
  hasUnsavedChanges,
} = useViewManagement(storage);

const globalInputsRef = computed({
  get: () => storage.value.globalInputs,
  set: (value) => {
    storage.value.globalInputs = value;
  },
});

// Create a reactive reference to the current view state
const currentViewStateRef = computed(() => getCurrentViewState());

const {
  currentPhase,
  phasesList,
  updatePhase,
  switchPhase,
  exportViewData,
  importViewData,
} = useViewAwarePhases(
  currentViewStateRef,
  currentView,
  globalInputsRef,
  updateCurrentViewState
);

const currentPhaseId = computed(() => currentViewStateRef.value.currentPhaseId);

const globalInputs = computed(() => ({
  ...storage.value.globalInputs,
  requirements: storage.value.globalInputs.requirements || "",
}));

const handleViewChange = (viewType: ViewType) => {
  switchView(viewType);
};

const handlePhaseChange = (phaseId: AnyPhaseId) => {
  switchPhase(phaseId);
};

const updateCurrentPhase = (updatedPhase: Phase | BackendPhase) => {
  updatePhase(updatedPhase.id, updatedPhase);
};

const updateGlobalInputs = (newGlobalInputs: GlobalInputsType) => {
  storage.value.globalInputs = {
    ...newGlobalInputs,
    requirements: newGlobalInputs.requirements || "",
  };
};

const exportData = () => {
  const data = exportViewData();
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
      const data = JSON.parse(
        e.target?.result as string
      ) as ViewAwareExportData;
      importViewData(data);
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
