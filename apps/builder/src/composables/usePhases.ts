import {computed, ref} from "vue";
import type {Phase, PhaseId, PhaseMap, GlobalInputs} from "../types";
import {DEFAULT_PHASE_TITLES, DEFAULT_PHASE_TEMPLATES} from "../types";

export function usePhases(phases: PhaseMap, globalInputs: GlobalInputs) {
  const currentPhaseId = ref<PhaseId>("0");

  const getPhase = (id: PhaseId): Phase => {
    if (!phases[id]) {
      phases[id] = {
        id,
        title: DEFAULT_PHASE_TITLES[id],
        template: DEFAULT_PHASE_TEMPLATES[id],
        overridesEnabled: false,
        inputs: {},
        lastOutput: "",
      };
    }
    return phases[id];
  };

  const updatePhase = (id: string, updates: Partial<Omit<Phase, "id">>) => {
    const phase = getPhase(id as PhaseId);
    Object.assign(phase, updates);
  };

  const updatePhaseInput = (phaseId: string, key: string, value: string) => {
    const phase = getPhase(phaseId as PhaseId);
    if (!phase.inputs) {
      phase.inputs = {};
    }
    phase.inputs[key] = value;
  };

  const removePhaseInput = (phaseId: string, key: string) => {
    const phase = getPhase(phaseId as PhaseId);
    if (phase.inputs) {
      delete phase.inputs[key];
    }
  };

  const resetPhaseToDefault = (id: string) => {
    const phase = getPhase(id as PhaseId);
    phase.template = DEFAULT_PHASE_TEMPLATES[id as PhaseId];
    phase.overridesEnabled = false;
    phase.inputs = {};
    phase.lastOutput = "";
  };

  const phasesList = computed(() => {
    return ["0", "1", "2", "2.5", "3", "4"].map((id) =>
      getPhase(id as PhaseId)
    );
  });

  const currentPhase = computed(() => getPhase(currentPhaseId.value));

  const hasUnsavedChanges = computed(() => {
    return phasesList.value.some(
      (phase) =>
        phase.overridesEnabled ||
        Object.keys(phase.inputs).length > 0 ||
        phase.lastOutput !== ""
    );
  });

  const exportPhases = () => {
    return {
      phases: phasesList.value,
      globalInputs,
      exportedAt: new Date().toISOString(),
    };
  };

  const importPhases = (data: {
    phases: Phase[];
    globalInputs: GlobalInputs;
  }) => {
    // Clear existing phases
    Object.keys(phases).forEach((key) => delete phases[key]);

    // Import new phases
    data.phases.forEach((phase) => {
      phases[phase.id] = {...phase};
    });

    // Update global inputs
    Object.assign(globalInputs, data.globalInputs);
  };

  return {
    currentPhaseId,
    getPhase,
    updatePhase,
    updatePhaseInput,
    removePhaseInput,
    resetPhaseToDefault,
    phasesList,
    currentPhase,
    hasUnsavedChanges,
    exportPhases,
    importPhases,
  };
}
