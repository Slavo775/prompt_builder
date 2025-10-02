import {ref, computed, watch} from "vue";
import type {
  ViewType,
  ViewState,
  ViewAwarePhaseBuilderState,
  PhaseBuilderState,
  AnyPhaseId,
} from "../types";

export interface UseViewManagementReturn {
  currentView: import("vue").Ref<ViewType>;
  viewStates: import("vue").ComputedRef<{
    frontend: ViewState;
    backend: ViewState;
  }>;
  // eslint-disable-next-line no-unused-vars
  switchView: (viewType: ViewType) => void;
  getCurrentViewState: () => ViewState;
  // eslint-disable-next-line no-unused-vars
  updateCurrentViewState: (updates: Partial<ViewState>) => void;
  hasUnsavedChanges: import("vue").ComputedRef<boolean>;
}

export function useViewManagement(storage: {
  value: ViewAwarePhaseBuilderState;
}): UseViewManagementReturn {
  const currentView = ref<ViewType>(storage.value.currentView);

  const viewStates = computed(() => storage.value.views);

  const hasUnsavedChanges = computed(() => {
    const frontendState = storage.value.views.frontend;
    const backendState = storage.value.views.backend;

    const frontendHasChanges = Object.values(frontendState.phases).some(
      (phase) =>
        phase.overridesEnabled ||
        Object.keys(phase.inputs).length > 0 ||
        phase.lastOutput !== ""
    );

    const backendHasChanges = Object.values(backendState.phases).some(
      (phase) =>
        phase.overridesEnabled ||
        Object.keys(phase.inputs).length > 0 ||
        phase.lastOutput !== ""
    );

    return frontendHasChanges || backendHasChanges;
  });

  const switchView = (viewType: ViewType) => {
    currentView.value = viewType;
    storage.value.currentView = viewType;
  };

  const getCurrentViewState = (): ViewState => {
    return storage.value.views[currentView.value];
  };

  const updateCurrentViewState = (updates: Partial<ViewState>) => {
    const currentState = getCurrentViewState();
    storage.value.views[currentView.value] = {
      ...currentState,
      ...updates,
      lastModified: new Date().toISOString(),
    };
  };

  // Watch for view changes and update storage
  watch(
    currentView,
    (newView) => {
      storage.value.currentView = newView;
    },
    {immediate: true}
  );

  return {
    currentView,
    viewStates,
    switchView,
    getCurrentViewState,
    updateCurrentViewState,
    hasUnsavedChanges,
  };
}

// Migration function for backward compatibility
export function migrateToViewAwareStorage(
  legacyData: PhaseBuilderState
): ViewAwarePhaseBuilderState {
  return {
    currentView: "frontend",
    views: {
      frontend: {
        phases: legacyData.phases,
        currentPhaseId: legacyData.currentPhaseId as AnyPhaseId,
        lastModified: new Date().toISOString(),
      },
      backend: {
        phases: {},
        currentPhaseId: "backend-0",
        lastModified: new Date().toISOString(),
      },
    },
    globalInputs: legacyData.globalInputs,
  };
}
