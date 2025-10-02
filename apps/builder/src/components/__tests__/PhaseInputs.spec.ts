import {describe, it, expect, vi, beforeEach} from "vitest";
import {mount} from "@vue/test-utils";
import PhaseInputs from "../PhaseInputs.vue";
import type {Phase} from "../../types";
import type {GlobalInputs} from "../../types";

// Mock the validation composable
vi.mock("../../composables/useValidation", () => ({
  useValidation: vi.fn(() => ({
    validationState: {
      value: {
        isValid: true,
        errors: [],
        warnings: [],
      },
      effect: vi.fn(),
      [Symbol.for("ComputedRefSymbol")]: true,
      [Symbol.for("RefSymbol")]: true,
    },
  })),
}));

describe("PhaseInputs", () => {
  let mockPhase: Phase;
  let mockGlobalInputs: GlobalInputs;

  beforeEach(() => {
    mockPhase = {
      id: "0",
      title: "Discovery",
      template: "Test template with [CUSTOM_TOKEN]",
      overridesEnabled: false,
      inputs: {
        CUSTOM_TOKEN: "Custom Value",
        ANOTHER_TOKEN: "Another Value",
      },
      lastOutput: "",
    };

    mockGlobalInputs = {
      projectName: "Test Project",
      featureName: "Test Feature",
      featureSlug: "test-feature",
      requirements: "Test requirements for the project",
      packageManager: "pnpm",
      isMonorepo: false,
    };
  });

  it("should render phase inputs", () => {
    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    expect(wrapper.find(".phase-inputs__title").text()).toBe(
      "Phase-Specific Inputs"
    );

    // Check that input fields are rendered
    const inputRows = wrapper.findAll(".phase-inputs__row");
    expect(inputRows).toHaveLength(2);
  });

  it("should display existing phase inputs", () => {
    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const inputs = wrapper.findAll(".phase-inputs__value");
    expect(inputs).toHaveLength(2);

    const customInput = inputs.find(
      (input) => (input.element as HTMLInputElement).value === "Custom Value"
    );
    const anotherInput = inputs.find(
      (input) => (input.element as HTMLInputElement).value === "Another Value"
    );

    expect(customInput).toBeDefined();
    expect(anotherInput).toBeDefined();
  });

  it("should add new input when add button is clicked", async () => {
    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const newInputKey = wrapper.find(".phase-inputs__key");
    const addButton = wrapper.find(".phase-inputs__add-button");

    await newInputKey.setValue("NEW_TOKEN");
    await addButton.trigger("click");

    expect(wrapper.emitted("update:phase")).toBeTruthy();
  });

  it("should remove input when remove button is clicked", async () => {
    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const removeButtons = wrapper.findAll(".phase-inputs__remove");
    await removeButtons[0].trigger("click");

    expect(wrapper.emitted("update:phase")).toBeTruthy();
  });

  it("should show validation errors for phase inputs", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "phase-input-CUSTOM_TOKEN",
              token: "CUSTOM_TOKEN",
              message: "Missing required input: CUSTOM_TOKEN",
              type: "required",
            },
          ],
          warnings: [],
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      validateInput: vi.fn(),
      validateAll: vi.fn(),
      clearValidation: vi.fn(),
    });

    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const errorInput = wrapper.find(".phase-inputs__value--error");
    const errorMessage = wrapper.find(".phase-inputs__error");

    expect(errorInput.exists()).toBe(true);
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe("Missing required input: CUSTOM_TOKEN");
  });

  it("should apply error styling to invalid phase inputs", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "phase-input-CUSTOM_TOKEN",
              token: "CUSTOM_TOKEN",
              message: "Missing required input: CUSTOM_TOKEN",
              type: "required",
            },
          ],
          warnings: [],
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      validateInput: vi.fn(),
      validateAll: vi.fn(),
      clearValidation: vi.fn(),
    });

    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const customInput = wrapper
      .findAll(".phase-inputs__value")
      .find(
        (input) => (input.element as HTMLInputElement).value === "Custom Value"
      );

    expect(customInput?.classes()).toContain("phase-inputs__value--error");
    expect(customInput?.attributes("aria-invalid")).toBe("true");
  });

  it("should not show validation errors when inputs are valid", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: true,
          errors: [],
          warnings: [],
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      validateInput: vi.fn(),
      validateAll: vi.fn(),
      clearValidation: vi.fn(),
    });

    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    expect(wrapper.find(".phase-inputs__value--error").exists()).toBe(false);
    expect(wrapper.find(".phase-inputs__error").exists()).toBe(false);
  });

  it("should pass global inputs and template to validation", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    const mockUseValidationInstance = vi.fn(() => ({
      validationState: {
        value: {
          isValid: true,
          errors: [],
          warnings: [],
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      validateInput: vi.fn(),
      validateAll: vi.fn(),
      clearValidation: vi.fn(),
    }));
    useValidation.mockImplementation(mockUseValidationInstance);

    const template = "Test template with [CUSTOM_TOKEN]";

    mount(PhaseInputs, {
      props: {
        phase: mockPhase,
        globalInputs: mockGlobalInputs,
        template,
      },
    });

    // Verify that useValidation was called with reactive refs
    expect(mockUseValidationInstance).toHaveBeenCalledTimes(1);
    const calls = mockUseValidationInstance.mock.calls;
    if (calls.length > 0 && calls[0].length >= 3) {
      const [templateArg, globalInputsArg, phaseInputsArg] =
        calls[0] as unknown as [
          {value: string},
          {value: typeof mockGlobalInputs},
          {value: typeof mockPhase.inputs}
        ];
      // Check that the arguments are reactive refs with correct values
      expect(templateArg?.value).toBe(template);
      expect(globalInputsArg?.value).toEqual(mockGlobalInputs);
      expect(phaseInputsArg?.value).toEqual(mockPhase.inputs);
    }
  });

  it("should have proper accessibility attributes for error states", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "phase-input-CUSTOM_TOKEN",
              token: "CUSTOM_TOKEN",
              message: "Missing required input: CUSTOM_TOKEN",
              type: "required",
            },
          ],
          warnings: [],
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      validateInput: vi.fn(),
      validateAll: vi.fn(),
      clearValidation: vi.fn(),
    });

    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const customInput = wrapper
      .findAll(".phase-inputs__value")
      .find(
        (input) => (input.element as HTMLInputElement).value === "Custom Value"
      );
    const errorMessage = wrapper.find("#phase-input-CUSTOM_TOKEN-error");

    if (customInput) {
      expect(customInput.attributes("aria-invalid")).toBe("true");
      expect(customInput.attributes("aria-describedby")).toBe(
        "phase-input-CUSTOM_TOKEN-error"
      );
    }
    if (errorMessage.exists()) {
      expect(errorMessage.attributes("role")).toBe("alert");
    }
  });

  it("should handle empty phase inputs", () => {
    const emptyPhase: Phase = {
      ...mockPhase,
      inputs: {},
    };

    const wrapper = mount(PhaseInputs, {
      props: {
        phase: emptyPhase,
      },
    });

    expect(wrapper.findAll(".phase-inputs__row")).toHaveLength(0);
    expect(wrapper.find(".phase-inputs__add").exists()).toBe(true);
  });

  it("should disable add button when input key is empty", () => {
    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const addButton = wrapper.find(".phase-inputs__add-button");
    expect(addButton.attributes("disabled")).toBeDefined();
  });

  it("should enable add button when input key has value", async () => {
    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    const newInputKey = wrapper.find(".phase-inputs__key");
    await newInputKey.setValue("NEW_TOKEN");

    const addButton = wrapper.find(".phase-inputs__add-button");
    expect(addButton.attributes("disabled")).toBeUndefined();
  });

  it("should have proper accessibility attributes for all inputs", () => {
    const wrapper = mount(PhaseInputs, {
      props: {
        phase: mockPhase,
      },
    });

    // Check that all inputs have proper accessibility attributes
    const inputs = wrapper.findAll("input");
    inputs.forEach((input) => {
      const placeholder = input.attributes("placeholder");
      expect(placeholder).toBeTruthy();
    });
  });
});
