import {ref, watch} from "vue";
import type {PhaseBuilderState, GlobalInputs} from "../types";

interface LegacyGlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  owner?: string;
  repoUrl?: string;
  stack?: string;
  dateIso?: string;
  requirements: string;
}

function migrateGlobalInputs(legacy: LegacyGlobalInputs): GlobalInputs {
  return {
    projectName: legacy.projectName || "",
    featureName: legacy.featureName || "",
    featureSlug: legacy.featureSlug || "",
    requirements: legacy.requirements || "",
  };
}

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
      requirements: "",
    },
    currentPhaseId: "0",
  };

  const storedValue = localStorage.getItem(STORAGE_KEY);
  let initialValue = defaultState;

  if (storedValue) {
    try {
      const parsed = JSON.parse(storedValue);
      // Migrate existing data to new GlobalInputs structure
      if (parsed.globalInputs) {
        parsed.globalInputs = migrateGlobalInputs(
          parsed.globalInputs as LegacyGlobalInputs
        );
      }
      initialValue = parsed;
    } catch (error) {
      console.warn("Failed to parse stored data, using defaults:", error);
    }
  }

  return useLocalStorage<PhaseBuilderState>(STORAGE_KEY, initialValue);
}

export function clearPhaseBuilderStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
