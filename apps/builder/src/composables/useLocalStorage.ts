import {ref, watch} from "vue";
import type {PhaseBuilderState} from "../types";

const STORAGE_KEY = "phaseBuilder:v1";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key);
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;

  const state = ref<T>(initialValue);

  watch(
    state,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    {deep: true}
  );

  return state;
}

export function usePhaseBuilderStorage() {
  const defaultState: PhaseBuilderState = {
    phases: {},
    globalInputs: {
      projectName: "",
      featureName: "",
      featureSlug: "",
      owner: "",
      repoUrl: "",
      stack: "",
      dateIso: new Date().toISOString().split("T")[0] || "",
    },
    currentPhaseId: "0",
  };

  return useLocalStorage<PhaseBuilderState>(STORAGE_KEY, defaultState);
}

export function clearPhaseBuilderStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
