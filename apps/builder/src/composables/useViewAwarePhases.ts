import {computed, ref, watch} from "vue";
import type {
  Phase,
  BackendPhase,
  AnyPhaseId,
  ViewType,
  ViewState,
  ViewAwareExportData,
  ViewExportData,
  GlobalInputs,
} from "../types";
import {getPhaseConfig} from "../config";

export interface UseViewAwarePhasesReturn {
  currentPhase: import("vue").ComputedRef<Phase | BackendPhase>;
  phasesList: import("vue").ComputedRef<(Phase | BackendPhase)[]>;
  updatePhase: (
    // eslint-disable-next-line no-unused-vars
    phaseId: AnyPhaseId,
    // eslint-disable-next-line no-unused-vars
    updates: Partial<Phase | BackendPhase>
  ) => void;
  // eslint-disable-next-line no-unused-vars
  switchPhase: (phaseId: AnyPhaseId) => void;
  exportViewData: () => ViewAwareExportData;
  // eslint-disable-next-line no-unused-vars
  importViewData: (data: ViewAwareExportData) => void;
}

export function useViewAwarePhases(
  viewStateRef: import("vue").ComputedRef<ViewState>,
  viewTypeRef: import("vue").Ref<ViewType>,
  globalInputs: {value: GlobalInputs},
  // eslint-disable-next-line no-unused-vars
  updateViewState: (updates: Partial<ViewState>) => void
): UseViewAwarePhasesReturn {
  const currentPhaseId = ref<AnyPhaseId>(viewStateRef.value.currentPhaseId);

  // Watch for view state changes and update current phase ID
  watch(
    viewStateRef,
    (newViewState) => {
      currentPhaseId.value = newViewState.currentPhaseId;
    },
    {immediate: true}
  );

  const getPhase = (id: AnyPhaseId): Phase | BackendPhase => {
    const viewState = viewStateRef.value;
    if (viewState.phases[id]) {
      return viewState.phases[id] as Phase | BackendPhase;
    }

    // Create default phase if it doesn't exist
    const config = getPhaseConfig(id);
    return {
      id,
      title: config.title,
      template: config.template,
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    };
  };

  const phasesList = computed(() => {
    const viewType = viewTypeRef.value;
    const phaseIds =
      viewType === "backend"
        ? ["backend-0", "backend-1", "backend-2", "backend-3"]
        : ["0", "1", "2", "2.5", "3", "4", "5", "6"];

    return phaseIds.map((id) => getPhase(id as AnyPhaseId));
  });

  const currentPhase = computed(() => getPhase(currentPhaseId.value));

  const updatePhase = (
    id: AnyPhaseId,
    updates: Partial<Phase | BackendPhase>
  ) => {
    const viewState = viewStateRef.value;
    const existingPhase = getPhase(id);
    const updatedPhase = {...existingPhase, ...updates};
    const updatedPhases = {
      ...viewState.phases,
      [id]: updatedPhase,
    } as typeof viewState.phases;
    updateViewState({phases: updatedPhases});
  };

  const switchPhase = (phaseId: AnyPhaseId) => {
    currentPhaseId.value = phaseId;
    updateViewState({currentPhaseId: phaseId});
  };

  const exportViewData = (): ViewAwareExportData => {
    const viewType = viewTypeRef.value;
    const viewState = viewStateRef.value;

    const frontendData: ViewExportData = {
      viewType: "frontend",
      phases: viewType === "frontend" ? viewState.phases : {},
      currentPhaseId: viewType === "frontend" ? viewState.currentPhaseId : "0",
      lastModified: viewState.lastModified,
    };

    const backendData: ViewExportData = {
      viewType: "backend",
      phases: viewType === "backend" ? viewState.phases : {},
      currentPhaseId:
        viewType === "backend" ? viewState.currentPhaseId : "backend-0",
      lastModified: viewState.lastModified,
    };

    return {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      globalInputs: globalInputs.value,
      views: {
        frontend: frontendData,
        backend: backendData,
      },
      metadata: {
        currentView: viewType,
        appVersion: "1.0.0",
      },
    };
  };

  const importViewData = (data: ViewAwareExportData) => {
    const viewType = viewTypeRef.value;
    const viewData = data.views[viewType];
    if (viewData) {
      updateViewState({
        phases: viewData.phases,
        currentPhaseId: viewData.currentPhaseId,
        lastModified: viewData.lastModified,
      });
      currentPhaseId.value = viewData.currentPhaseId;
    }

    // Update global inputs
    Object.assign(globalInputs.value, data.globalInputs);
  };

  return {
    currentPhase,
    phasesList,
    updatePhase,
    switchPhase,
    exportViewData,
    importViewData,
  };
}
