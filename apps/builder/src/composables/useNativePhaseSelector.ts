import {computed, type Ref, type ComputedRef} from "vue";
import type {
  Phase,
  BackendPhase,
  AnyPhaseId,
  NativePhaseOption,
  PhaseFormField,
  FormValidationResult,
} from "../types";

export interface UseNativePhaseSelectorReturn {
  readonly formattedOptions: ComputedRef<ReadonlyArray<NativePhaseOption>>;
  readonly selectedOption: ComputedRef<NativePhaseOption | undefined>;
  readonly fieldConfig: ComputedRef<PhaseFormField>;
  readonly handlers: {
    // eslint-disable-next-line no-unused-vars
    readonly onChange: (event: Event) => void;
    // eslint-disable-next-line no-unused-vars
    readonly onFocus: (event: FocusEvent) => void;
    // eslint-disable-next-line no-unused-vars
    readonly onBlur: (event: FocusEvent) => void;
  };
  readonly validation: ComputedRef<FormValidationResult>;
}

export function useNativePhaseSelector<T extends Function>(
  phasesList: Ref<ReadonlyArray<Phase | BackendPhase>>,
  currentPhaseId: Ref<AnyPhaseId>,
  emit: T,
  options: {
    id?: string;
    required?: boolean;
    maxOptionLength?: number;
  } = {}
): UseNativePhaseSelectorReturn {
  const {
    id = "native-phase-selector",
    required = false,
    maxOptionLength = 40,
  } = options;

  const formatPhaseOptionText = (
    phase: Phase | BackendPhase,
    maxLength: number = maxOptionLength
  ): string => {
    const title =
      phase.title.length > maxLength
        ? `${phase.title.substring(0, maxLength - 3)}...`
        : phase.title;
    return `Phase ${phase.id}: ${title}`;
  };

  const formattedOptions = computed((): ReadonlyArray<NativePhaseOption> => {
    return phasesList.value.map(
      (phase): NativePhaseOption => ({
        value: phase.id,
        text: formatPhaseOptionText(phase),
        selected: phase.id === currentPhaseId.value,
        disabled: false,
      })
    );
  });

  const selectedOption = computed((): NativePhaseOption | undefined => {
    return formattedOptions.value.find((option) => option.selected);
  });

  const fieldConfig = computed(
    (): PhaseFormField => ({
      id,
      name: "phase-selector",
      value: currentPhaseId.value,
      required,
      valid: !required || Boolean(currentPhaseId.value),
    })
  );

  const validation = computed((): FormValidationResult => {
    const isValid = !required || Boolean(currentPhaseId.value);
    return {
      valid: isValid,
      valueMissing: required && !currentPhaseId.value,
      customError: false,
      validationMessage: isValid ? "" : "Please select a phase",
    };
  });

  const isValidPhaseId = (value: string): value is AnyPhaseId => {
    return formattedOptions.value.some((option) => option.value === value);
  };

  const handlers = {
    onChange: (event: Event): void => {
      const target = event.target as HTMLSelectElement;
      const value = target.value;

      if (isValidPhaseId(value)) {
        emit("phase-change", value);
      }
    },

    onFocus: (event: FocusEvent): void => {
      emit("focus", event);
    },

    onBlur: (event: FocusEvent): void => {
      emit("blur", event);
    },
  };

  return {
    formattedOptions,
    selectedOption,
    fieldConfig,
    handlers,
    validation,
  };
}
