import {ref, computed, nextTick, type Ref, type ComputedRef} from "vue";
import type {
  Phase,
  BackendPhase,
  AnyPhaseId,
  PhaseOption,
  DropdownState,
  DropdownPosition,
  DropdownPlacement,
  KeyboardHandlers,
} from "../types";

export interface UsePhaseSelectorReturn {
  readonly dropdownState: Ref<DropdownState>;
  readonly isOpen: ComputedRef<boolean>;
  readonly phaseOptions: ComputedRef<PhaseOption[]>;
  readonly selectedOption: ComputedRef<PhaseOption | undefined>;
  readonly focusedIndex: Ref<number>;
  readonly dropdownPosition: Ref<DropdownPosition | null>;
  readonly handlers: KeyboardHandlers & {
    readonly onTriggerClick: () => void;
    // eslint-disable-next-line no-unused-vars
    readonly onOptionClick: (phaseId: AnyPhaseId) => void;
    readonly onOutsideClick: () => void;
  };
  readonly a11yAttrs: ComputedRef<Record<string, string>>;
  readonly openDropdown: () => Promise<void>;
  readonly closeDropdown: () => void;
  // eslint-disable-next-line no-unused-vars
  readonly calculatePosition: (triggerElement: HTMLElement) => void;
}

export function usePhaseSelector(
  phasesList: Ref<ReadonlyArray<Phase | BackendPhase>>,
  currentPhaseId: Ref<AnyPhaseId>,

  emit: (
    // eslint-disable-next-line no-unused-vars
    event: "phase-change" | "dropdown-open" | "dropdown-close",
    // eslint-disable-next-line no-unused-vars
    ...args: unknown[]
  ) => void
): UsePhaseSelectorReturn {
  const dropdownState = ref<DropdownState>("closed");
  const focusedIndex = ref(-1);
  const dropdownPosition = ref<DropdownPosition | null>(null);

  const isOpen = computed(
    () => dropdownState.value === "open" || dropdownState.value === "opening"
  );

  const phaseOptions = computed((): PhaseOption[] => {
    return phasesList.value.map(
      (phase): PhaseOption => ({
        id: phase.id,
        label: formatPhaseLabel(phase),
        title: phase.title,
        selected: phase.id === currentPhaseId.value,
        disabled: false,
      })
    );
  });

  const selectedOption = computed((): PhaseOption | undefined => {
    return phaseOptions.value.find((option) => option.selected);
  });

  const formatPhaseLabel = (phase: Phase | BackendPhase): string => {
    const title =
      phase.title.length > 30
        ? `${phase.title.substring(0, 27)}...`
        : phase.title;
    return `${phase.id} - ${title}`;
  };

  const openDropdown = async (): Promise<void> => {
    if (dropdownState.value !== "closed") return;

    dropdownState.value = "opening";
    emit("dropdown-open");

    await nextTick();
    dropdownState.value = "open";

    // Set focus to current selection
    const currentIndex = phaseOptions.value.findIndex(
      (option) => option.selected
    );
    focusedIndex.value = currentIndex >= 0 ? currentIndex : 0;
  };

  const closeDropdown = (): void => {
    if (dropdownState.value === "closed") return;

    dropdownState.value = "closing";
    emit("dropdown-close");

    setTimeout(() => {
      dropdownState.value = "closed";
      focusedIndex.value = -1;
    }, 150); // Animation duration
  };

  const calculatePosition = (triggerElement: HTMLElement): void => {
    const rect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(320, phaseOptions.value.length * 40 + 16); // Max height with padding

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const placement: DropdownPlacement =
      spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove
        ? "bottom"
        : "top";

    dropdownPosition.value = {
      top:
        placement === "bottom"
          ? rect.bottom + 4
          : rect.top - dropdownHeight - 4,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.min(
        dropdownHeight,
        placement === "bottom" ? spaceBelow - 8 : spaceAbove - 8
      ),
      placement,
    };
  };

  const selectPhase = (phaseId: AnyPhaseId): void => {
    if (phaseId !== currentPhaseId.value) {
      emit("phase-change", phaseId);
    }
    closeDropdown();
  };

  const navigateOptions = (direction: "up" | "down"): void => {
    if (!isOpen.value) return;

    const maxIndex = phaseOptions.value.length - 1;

    if (direction === "down") {
      focusedIndex.value =
        focusedIndex.value >= maxIndex ? 0 : focusedIndex.value + 1;
    } else {
      focusedIndex.value =
        focusedIndex.value <= 0 ? maxIndex : focusedIndex.value - 1;
    }
  };

  const handlers: KeyboardHandlers & {
    readonly onTriggerClick: () => void;
    // eslint-disable-next-line no-unused-vars
    readonly onOptionClick: (phaseId: AnyPhaseId) => void;
    readonly onOutsideClick: () => void;
  } = {
    onArrowDown: (event: KeyboardEvent): void => {
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
      } else {
        navigateOptions("down");
      }
    },

    onArrowUp: (event: KeyboardEvent): void => {
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
      } else {
        navigateOptions("up");
      }
    },

    onEnter: (event: KeyboardEvent): void => {
      event.preventDefault();
      if (!isOpen.value) {
        openDropdown();
      } else if (focusedIndex.value >= 0) {
        const option = phaseOptions.value[focusedIndex.value];
        if (option) {
          selectPhase(option.id);
        }
      }
    },

    onEscape: (event: KeyboardEvent): void => {
      event.preventDefault();
      if (isOpen.value) {
        closeDropdown();
      }
    },

    onTab: (): void => {
      if (isOpen.value) {
        closeDropdown();
      }
    },

    onTriggerClick: (): void => {
      if (isOpen.value) {
        closeDropdown();
      } else {
        openDropdown();
      }
    },

    onOptionClick: (phaseId: AnyPhaseId): void => {
      selectPhase(phaseId);
    },

    onOutsideClick: (): void => {
      if (isOpen.value) {
        closeDropdown();
      }
    },
  };

  const a11yAttrs = computed((): Record<string, string> => {
    const selectedLabel = selectedOption.value?.label || "No phase selected";

    return {
      role: "combobox",
      "aria-expanded": isOpen.value.toString(),
      "aria-haspopup": "listbox",
      "aria-controls": "phase-selector-dropdown",
      "aria-label": `Phase selector. Current: ${selectedLabel}`,
      tabindex: "0",
    };
  });

  return {
    dropdownState,
    isOpen,
    phaseOptions,
    selectedOption,
    focusedIndex,
    dropdownPosition,
    handlers,
    a11yAttrs,
    openDropdown,
    closeDropdown,
    calculatePosition,
  };
}
