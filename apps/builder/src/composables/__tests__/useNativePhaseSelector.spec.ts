import {describe, it, expect, vi, beforeEach} from "vitest";
import {ref, nextTick} from "vue";
import {useNativePhaseSelector} from "../useNativePhaseSelector";
import type {Phase, BackendPhase, AnyPhaseId} from "../../types";

describe("useNativePhaseSelector", () => {
  const mockPhases: Phase[] = [
    {
      id: "0",
      title: "Create/refresh REPO_CONSTRAINTS.md",
      template: "Test template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
    {
      id: "1",
      title: "Repo exploration COMPREHENSIVE_ANALYSIS.md",
      template: "Test template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
    {
      id: "2",
      title:
        "Implementation Phase with a very long title that should be truncated for mobile display purposes",
      template: "Test template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
  ];

  const mockBackendPhases: BackendPhase[] = [
    {
      id: "0",
      title: "Backend Discovery",
      template: "Backend template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
    {
      id: "1",
      title: "Backend Planning",
      template: "Backend template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
  ];

  let mockEmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockEmit = vi.fn();
  });

  describe("Initialization", () => {
    it("should initialize with correct default state", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {formattedOptions, selectedOption, fieldConfig, validation} =
        useNativePhaseSelector(phasesListRef, currentPhaseIdRef, mockEmit);

      expect(formattedOptions.value).toHaveLength(3);
      expect(selectedOption.value?.value).toBe("0");
      expect(fieldConfig.value.id).toBe("native-phase-selector");
      expect(validation.value.valid).toBe(true);
    });

    it("should create correct formatted options", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("1");

      const {formattedOptions} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const options = formattedOptions.value;
      expect(options).toHaveLength(3);

      expect(options[0]).toEqual({
        value: "0",
        text: "Phase 0: Create/refresh REPO_CONSTRAINTS.md",
        selected: false,
        disabled: false,
      });

      expect(options[1]).toEqual({
        value: "1",
        text: "Phase 1: Repo exploration COMPREHENSIVE_ANALYS...",
        selected: true,
        disabled: false,
      });
    });

    it("should truncate long phase titles", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("2");

      const {formattedOptions} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {maxOptionLength: 30}
      );

      const longTitleOption = formattedOptions.value[2];
      expect(longTitleOption.text).toContain("...");
      expect(longTitleOption.text.length).toBeLessThan(40);
    });

    it("should handle custom configuration options", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {fieldConfig} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {
          id: "custom-selector",
          required: true,
          maxOptionLength: 20,
        }
      );

      expect(fieldConfig.value.id).toBe("custom-selector");
      expect(fieldConfig.value.required).toBe(true);
    });
  });

  describe("Selected Option Management", () => {
    it("should correctly identify selected option", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("1");

      const {selectedOption, formattedOptions} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(selectedOption.value?.value).toBe("1");
      expect(selectedOption.value?.selected).toBe(true);

      // Other options should not be selected
      const otherOptions = formattedOptions.value.filter(
        (option) => option.value !== "1"
      );
      otherOptions.forEach((option) => {
        expect(option.selected).toBe(false);
      });
    });

    it("should handle no selected option", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("invalid" as AnyPhaseId);

      const {selectedOption} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(selectedOption.value).toBeUndefined();
    });

    it("should update selected option when current phase changes", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {selectedOption} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(selectedOption.value?.value).toBe("0");

      // Change current phase
      currentPhaseIdRef.value = "2";
      await nextTick();

      expect(selectedOption.value?.value).toBe("2");
    });
  });

  describe("Form Field Configuration", () => {
    it("should generate correct field configuration", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("1");

      const {fieldConfig} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {
          id: "test-field",
          required: true,
        }
      );

      const config = fieldConfig.value;
      expect(config.id).toBe("test-field");
      expect(config.name).toBe("phase-selector");
      expect(config.value).toBe("1");
      expect(config.required).toBe(true);
      expect(config.valid).toBe(true);
    });

    it("should handle validation for required fields", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("" as AnyPhaseId);

      const {fieldConfig, validation} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {required: true}
      );

      expect(fieldConfig.value.valid).toBe(false);
      expect(validation.value.valid).toBe(false);
      expect(validation.value.valueMissing).toBe(true);
      expect(validation.value.validationMessage).toBe("Please select a phase");
    });

    it("should handle validation for optional fields", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("" as AnyPhaseId);

      const {fieldConfig, validation} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {required: false}
      );

      expect(fieldConfig.value.valid).toBe(true);
      expect(validation.value.valid).toBe(true);
      expect(validation.value.valueMissing).toBe(false);
      expect(validation.value.validationMessage).toBe("");
    });
  });

  describe("Event Handlers", () => {
    it("should handle onChange events with valid phase IDs", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = {
        target: {value: "2"},
      } as unknown as Event;

      handlers.onChange(mockEvent);

      expect(mockEmit).toHaveBeenCalledWith("phase-change", "2");
    });

    it("should ignore onChange events with invalid phase IDs", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = {
        target: {value: "invalid"},
      } as unknown as Event;

      handlers.onChange(mockEvent);

      expect(mockEmit).not.toHaveBeenCalled();
    });

    it("should handle onFocus events", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = new FocusEvent("focus");
      handlers.onFocus(mockEvent);

      expect(mockEmit).toHaveBeenCalledWith("focus", mockEvent);
    });

    it("should handle onBlur events", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = new FocusEvent("blur");
      handlers.onBlur(mockEvent);

      expect(mockEmit).toHaveBeenCalledWith("blur", mockEvent);
    });
  });

  describe("Validation Logic", () => {
    it("should validate required fields correctly", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("1");

      const {validation} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {required: true}
      );

      const result = validation.value;
      expect(result.valid).toBe(true);
      expect(result.valueMissing).toBe(false);
      expect(result.customError).toBe(false);
      expect(result.validationMessage).toBe("");
    });

    it("should handle missing required values", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("" as AnyPhaseId);

      const {validation} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {required: true}
      );

      const result = validation.value;
      expect(result.valid).toBe(false);
      expect(result.valueMissing).toBe(true);
      expect(result.customError).toBe(false);
      expect(result.validationMessage).toBe("Please select a phase");
    });

    it("should handle optional fields", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("" as AnyPhaseId);

      const {validation} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {required: false}
      );

      const result = validation.value;
      expect(result.valid).toBe(true);
      expect(result.valueMissing).toBe(false);
      expect(result.customError).toBe(false);
      expect(result.validationMessage).toBe("");
    });
  });

  describe("Backend Phases Support", () => {
    it("should work with backend phases", () => {
      const phasesListRef = ref(mockBackendPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {formattedOptions, selectedOption} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(formattedOptions.value).toHaveLength(2);
      expect(selectedOption.value?.text).toBe("Phase 0: Backend Discovery");
      expect(formattedOptions.value[0].text).toBe("Phase 0: Backend Discovery");
      expect(formattedOptions.value[1].text).toBe("Phase 1: Backend Planning");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty phases list", () => {
      const phasesListRef = ref([]);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {formattedOptions, selectedOption} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(formattedOptions.value).toHaveLength(0);
      expect(selectedOption.value).toBeUndefined();
    });

    it("should handle invalid current phase ID", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("invalid" as AnyPhaseId);

      const {selectedOption, fieldConfig} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(selectedOption.value).toBeUndefined();
      expect(fieldConfig.value.value).toBe("invalid");
    });

    it("should handle phase list changes", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {formattedOptions} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(formattedOptions.value).toHaveLength(3);

      // Change phase list
      phasesListRef.value = mockBackendPhases;
      await nextTick();

      expect(formattedOptions.value).toHaveLength(2);
    });

    it("should handle custom max option length", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("2");

      const {formattedOptions} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit,
        {maxOptionLength: 20}
      );

      const longOption = formattedOptions.value[2];
      expect(longOption.text).toContain("...");
      expect(longOption.text.length).toBeLessThan(30);
    });

    it("should handle phase ID validation correctly", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      // Valid phase ID should emit
      const validEvent = {
        target: {value: "1"},
      } as unknown as Event;
      handlers.onChange(validEvent);
      expect(mockEmit).toHaveBeenCalledWith("phase-change", "1");

      mockEmit.mockClear();

      // Invalid phase ID should not emit
      const invalidEvent = {
        target: {value: "999"},
      } as unknown as Event;
      handlers.onChange(invalidEvent);
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe("Reactive Updates", () => {
    it("should update options when phases list changes", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {formattedOptions} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(formattedOptions.value).toHaveLength(3);

      // Update phases list
      phasesListRef.value = [
        ...mockPhases,
        {
          id: "3",
          title: "New Phase",
          template: "New template",
          overridesEnabled: false,
          inputs: {},
          lastOutput: "",
        },
      ];

      await nextTick();
      expect(formattedOptions.value).toHaveLength(4);
    });

    it("should update selected option when current phase ID changes", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {selectedOption} = useNativePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(selectedOption.value?.value).toBe("0");

      currentPhaseIdRef.value = "2";
      await nextTick();

      expect(selectedOption.value?.value).toBe("2");
    });
  });
});
