import {describe, it, expect, vi, beforeEach} from "vitest";
import {ref, nextTick} from "vue";
import {usePhaseSelector} from "../usePhaseSelector";
import type {Phase, BackendPhase, AnyPhaseId} from "../../types";

describe("usePhaseSelector", () => {
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
        "Implementation Phase with a very long title that should be truncated",
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

    // Mock DOM methods
    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: vi.fn(() => ({
        top: 100,
        bottom: 140,
        left: 50,
        right: 250,
        width: 200,
        height: 40,
      })),
    });

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
  });

  describe("Initialization", () => {
    it("should initialize with correct default state", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {
        dropdownState,
        isOpen,
        phaseOptions,
        selectedOption,
        focusedIndex,
      } = usePhaseSelector(phasesListRef, currentPhaseIdRef, mockEmit);

      expect(dropdownState.value).toBe("closed");
      expect(isOpen.value).toBe(false);
      expect(focusedIndex.value).toBe(-1);
      expect(phaseOptions.value).toHaveLength(3);
      expect(selectedOption.value?.id).toBe("0");
    });

    it("should create correct phase options", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("1");

      const {phaseOptions} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const options = phaseOptions.value;
      expect(options).toHaveLength(3);

      expect(options[0]).toEqual({
        id: "0",
        label: "0 - Create/refresh REPO_CONSTRA...",
        title: "Create/refresh REPO_CONSTRAINTS.md",
        selected: false,
        disabled: false,
      });

      expect(options[1]).toEqual({
        id: "1",
        label: "1 - Repo exploration COMPREHENS...",
        title: "Repo exploration COMPREHENSIVE_ANALYSIS.md",
        selected: true,
        disabled: false,
      });
    });

    it("should truncate long phase titles in labels", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("2");

      const {phaseOptions} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const longTitleOption = phaseOptions.value[2];
      expect(longTitleOption.label).toContain("...");
      expect(longTitleOption.label.length).toBeLessThan(40);
    });
  });

  describe("Dropdown State Management", () => {
    it("should open dropdown correctly", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {dropdownState, isOpen, openDropdown, focusedIndex} =
        usePhaseSelector(phasesListRef, currentPhaseIdRef, mockEmit);

      await openDropdown();

      expect(dropdownState.value).toBe("open");
      expect(isOpen.value).toBe(true);
      expect(focusedIndex.value).toBe(0); // Should focus current selection
      expect(mockEmit).toHaveBeenCalledWith("dropdown-open");
    });

    it("should close dropdown correctly", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {dropdownState, isOpen, openDropdown, closeDropdown} =
        usePhaseSelector(phasesListRef, currentPhaseIdRef, mockEmit);

      // Open first
      await openDropdown();
      expect(isOpen.value).toBe(true);

      // Then close
      closeDropdown();
      expect(dropdownState.value).toBe("closing");
      expect(mockEmit).toHaveBeenCalledWith("dropdown-close");

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(dropdownState.value).toBe("closed");
    });

    it("should not open dropdown if already opening/open", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {openDropdown} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      await openDropdown();
      mockEmit.mockClear();

      // Try to open again
      await openDropdown();
      expect(mockEmit).not.toHaveBeenCalled();
    });

    it("should not close dropdown if already closed", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {closeDropdown} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      closeDropdown();
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe("Position Calculation", () => {
    it("should calculate dropdown position below trigger", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {calculatePosition, dropdownPosition} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockElement = {
        getBoundingClientRect: () => ({
          top: 100,
          bottom: 140,
          left: 50,
          right: 250,
          width: 200,
          height: 40,
        }),
      } as HTMLElement;

      calculatePosition(mockElement);

      expect(dropdownPosition.value).toEqual({
        top: 144, // bottom + 4px gap
        left: 50,
        width: 200,
        maxHeight: expect.any(Number),
        placement: "bottom",
      });
    });

    it("should calculate dropdown position above trigger when no space below", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {calculatePosition, dropdownPosition} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      // Mock element near bottom of viewport
      const mockElement = {
        getBoundingClientRect: () => ({
          top: 750,
          bottom: 790,
          left: 50,
          right: 250,
          width: 200,
          height: 40,
        }),
      } as HTMLElement;

      calculatePosition(mockElement);

      expect(dropdownPosition.value?.placement).toBe("top");
      expect(dropdownPosition.value?.top).toBeLessThan(750);
    });
  });

  describe("Keyboard Handlers", () => {
    it("should handle arrow down key", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = {preventDefault: vi.fn()} as unknown as KeyboardEvent;

      // Should open dropdown when closed
      handlers.onArrowDown(mockEvent);
      await nextTick();

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEmit).toHaveBeenCalledWith("dropdown-open");
    });

    it("should handle arrow up key", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = {preventDefault: vi.fn()} as unknown as KeyboardEvent;

      handlers.onArrowUp(mockEvent);
      await nextTick();

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEmit).toHaveBeenCalledWith("dropdown-open");
    });

    it("should handle enter key", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = {preventDefault: vi.fn()} as unknown as KeyboardEvent;

      handlers.onEnter(mockEvent);
      await nextTick();

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEmit).toHaveBeenCalledWith("dropdown-open");
    });

    it("should handle escape key", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const mockEvent = {preventDefault: vi.fn()} as unknown as KeyboardEvent;

      handlers.onEscape(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      // Should not emit anything when dropdown is closed
    });

    it("should navigate options with arrow keys when open", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers, openDropdown, focusedIndex} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      // Open dropdown first
      await openDropdown();
      expect(focusedIndex.value).toBe(0);

      const mockEvent = {preventDefault: vi.fn()} as unknown as KeyboardEvent;

      // Arrow down should move to next option
      handlers.onArrowDown(mockEvent);
      expect(focusedIndex.value).toBe(1);

      // Arrow down again should move to next option
      handlers.onArrowDown(mockEvent);
      expect(focusedIndex.value).toBe(2);

      // Arrow down at end should wrap to beginning
      handlers.onArrowDown(mockEvent);
      expect(focusedIndex.value).toBe(0);

      // Arrow up should move to previous option (wrapping to end)
      handlers.onArrowUp(mockEvent);
      expect(focusedIndex.value).toBe(2);
    });

    it("should select focused option with enter when dropdown is open", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers, openDropdown, focusedIndex} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      // Open dropdown and navigate to option 1
      await openDropdown();
      focusedIndex.value = 1;

      const mockEvent = {preventDefault: vi.fn()} as unknown as KeyboardEvent;

      handlers.onEnter(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEmit).toHaveBeenCalledWith("phase-change", "1");
    });
  });

  describe("Option Selection", () => {
    it("should handle option click", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      handlers.onOptionClick("2");

      expect(mockEmit).toHaveBeenCalledWith("phase-change", "2");
    });

    it("should not emit phase-change for same phase", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      handlers.onOptionClick("0"); // Same as current

      expect(mockEmit).not.toHaveBeenCalledWith("phase-change", "0");
    });

    it("should handle trigger click", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      // Should open when closed
      handlers.onTriggerClick();
      await nextTick();

      expect(mockEmit).toHaveBeenCalledWith("dropdown-open");
    });

    it("should handle outside click", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {handlers} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      handlers.onOutsideClick();

      // Should not emit anything when dropdown is closed
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility Attributes", () => {
    it("should provide correct a11y attributes", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("1");

      const {a11yAttrs} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      const attrs = a11yAttrs.value;

      expect(attrs.role).toBe("combobox");
      expect(attrs["aria-expanded"]).toBe("false");
      expect(attrs["aria-haspopup"]).toBe("listbox");
      expect(attrs["aria-label"]).toContain("Phase selector");
      expect(attrs["aria-label"]).toContain("1 - Repo exploration");
      expect(attrs.tabindex).toBe("0");
    });

    it("should update aria-expanded when dropdown opens", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {a11yAttrs, openDropdown} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(a11yAttrs.value["aria-expanded"]).toBe("false");

      await openDropdown();

      expect(a11yAttrs.value["aria-expanded"]).toBe("true");
    });

    it("should handle no selected option gracefully", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("invalid" as AnyPhaseId);

      const {a11yAttrs} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(a11yAttrs.value["aria-label"]).toContain("No phase selected");
    });
  });

  describe("Backend Phases Support", () => {
    it("should work with backend phases", () => {
      const phasesListRef = ref(mockBackendPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {phaseOptions, selectedOption} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(phaseOptions.value).toHaveLength(2);
      expect(selectedOption.value?.title).toBe("Backend Discovery");
      expect(phaseOptions.value[0].label).toBe("0 - Backend Discovery");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty phases list", () => {
      const phasesListRef = ref([]);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {phaseOptions, selectedOption} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(phaseOptions.value).toHaveLength(0);
      expect(selectedOption.value).toBeUndefined();
    });

    it("should handle invalid current phase ID", () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("invalid" as AnyPhaseId);

      const {selectedOption} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(selectedOption.value).toBeUndefined();
    });

    it("should handle phase list changes", async () => {
      const phasesListRef = ref(mockPhases);
      const currentPhaseIdRef = ref<AnyPhaseId>("0");

      const {phaseOptions} = usePhaseSelector(
        phasesListRef,
        currentPhaseIdRef,
        mockEmit
      );

      expect(phaseOptions.value).toHaveLength(3);

      // Change phase list
      phasesListRef.value = mockBackendPhases;
      await nextTick();

      expect(phaseOptions.value).toHaveLength(2);
    });
  });
});
