import {ref, watch} from "vue";
import type {
  PhaseBuilderState,
  ViewAwarePhaseBuilderState,
  AnyPhaseId,
} from "../types";

// Legacy migration function - kept for potential future use
// function migrateGlobalInputs(legacy: LegacyGlobalInputs): GlobalInputs {
//   return {
//     projectName: legacy.projectName || "",
//     featureName: legacy.featureName || "",
//     featureSlug: legacy.featureSlug || "",
//     requirements: legacy.requirements || "",
//     packageManager:
//       legacy.packageManager === "npm" || legacy.packageManager === "yarn"
//         ? legacy.packageManager
//         : "pnpm", // Default to pnpm for backward compatibility
//     isMonorepo: legacy.isMonorepo ?? true, // Default to true for backward compatibility
//   };
// }

// Migration function for view-aware storage
function migrateToViewAwareStorage(
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

const STORAGE_KEY = "phaseBuilder:v2";
const LEGACY_STORAGE_KEY = "phaseBuilder:v1";

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
  // Try to load view-aware storage first
  const viewAwareData = localStorage.getItem(STORAGE_KEY);

  if (viewAwareData) {
    const parsedData = JSON.parse(viewAwareData) as ViewAwarePhaseBuilderState;
    return useLocalStorage(STORAGE_KEY, parsedData);
  }

  // Check for legacy storage and migrate
  const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);

  if (legacyData) {
    const parsedLegacyData = JSON.parse(legacyData) as PhaseBuilderState;
    const migratedData = migrateToViewAwareStorage(parsedLegacyData);

    // Save migrated data to new storage key
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));

    // Remove legacy storage
    localStorage.removeItem(LEGACY_STORAGE_KEY);

    return useLocalStorage(STORAGE_KEY, migratedData);
  }

  // No existing data, create default view-aware state
  const defaultState: ViewAwarePhaseBuilderState = {
    currentView: "frontend",
    views: {
      frontend: {
        phases: {},
        currentPhaseId: "0",
        lastModified: new Date().toISOString(),
      },
      backend: {
        phases: {},
        currentPhaseId: "backend-0",
        lastModified: new Date().toISOString(),
      },
    },
    globalInputs: {
      projectName: "",
      featureName: "",
      featureSlug: "",
      requirements: "",
      packageManager: "pnpm",
      isMonorepo: true,
    },
  };

  return useLocalStorage(STORAGE_KEY, defaultState);
}
