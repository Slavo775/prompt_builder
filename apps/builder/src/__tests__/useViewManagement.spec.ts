import {describe, it, expect, beforeEach} from "vitest";
import {nextTick, reactive} from "vue";
import {useViewManagement} from "../composables/useViewManagement";
import type {ViewAwarePhaseBuilderState} from "../types";

describe("useViewManagement", () => {
  let mockStorage: {value: ViewAwarePhaseBuilderState};

  beforeEach(() => {
    mockStorage = {
      value: reactive({
        currentView: "frontend",
        views: {
          frontend: {
            phases: {},
            currentPhaseId: "0",
            lastModified: "2023-01-01T00:00:00.000Z",
          },
          backend: {
            phases: {},
            currentPhaseId: "backend-0",
            lastModified: "2023-01-01T00:00:00.000Z",
          },
        },
        globalInputs: {
          projectName: "Test Project",
          featureName: "Test Feature",
          featureSlug: "test-feature",
          requirements: "Test requirements",
          packageManager: "pnpm",
          isMonorepo: true,
        },
      }),
    };
  });

  it("should initialize with correct current view", () => {
    const {currentView} = useViewManagement(mockStorage);
    expect(currentView.value).toBe("frontend");
  });

  it("should switch views correctly", () => {
    const {currentView, switchView} = useViewManagement(mockStorage);

    switchView("backend");
    expect(currentView.value).toBe("backend");
    expect(mockStorage.value.currentView).toBe("backend");
  });

  it("should return correct view states", () => {
    const {viewStates} = useViewManagement(mockStorage);

    expect(viewStates.value.frontend.currentPhaseId).toBe("0");
    expect(viewStates.value.backend.currentPhaseId).toBe("backend-0");
  });

  it("should get current view state", () => {
    const {getCurrentViewState} = useViewManagement(mockStorage);

    const frontendState = getCurrentViewState();
    expect(frontendState.currentPhaseId).toBe("0");
  });

  it("should update current view state", () => {
    const {updateCurrentViewState, getCurrentViewState} =
      useViewManagement(mockStorage);

    updateCurrentViewState({currentPhaseId: "1"});

    const updatedState = getCurrentViewState();
    expect(updatedState.currentPhaseId).toBe("1");
    expect(updatedState.lastModified).not.toBe("2023-01-01T00:00:00.000Z");
  });

  it("should detect unsaved changes", async () => {
    const {hasUnsavedChanges} = useViewManagement(mockStorage);

    // Initially no changes
    expect(hasUnsavedChanges.value).toBe(false);

    // Add changes directly to storage to trigger reactivity
    mockStorage.value.views.frontend.phases["0"] = {
      id: "0",
      title: "Test Phase",
      template: "Test template",
      overridesEnabled: true,
      inputs: {TEST: "value"},
      lastOutput: "",
    };

    // Wait for reactivity to update
    await nextTick();

    expect(hasUnsavedChanges.value).toBe(true);
  });
});
