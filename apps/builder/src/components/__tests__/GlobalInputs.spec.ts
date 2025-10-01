import {describe, it, expect, vi} from "vitest";
import {mount} from "@vue/test-utils";
import GlobalInputs from "../GlobalInputs.vue";
import type {GlobalInputs as GlobalInputsType} from "../../types";

// Mock the validation composable
vi.mock("../../composables/useValidation", () => ({
  useValidation: vi.fn(() => ({
    validationState: {
      value: {
        isValid: true,
        errors: [],
        warnings: [],
      },
    },
  })),
}));

describe("GlobalInputs", () => {
  const mockGlobalInputs: GlobalInputsType = {
    projectName: "Test Project",
    featureName: "Test Feature",
    featureSlug: "test-feature",
    requirements: "Test requirements for the project",
  };

  it("should render all input fields", () => {
    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    expect(wrapper.find("#project-name").exists()).toBe(true);
    expect(wrapper.find("#feature-name").exists()).toBe(true);
    expect(wrapper.find("#feature-slug").exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("should bind input values correctly", () => {
    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    expect(wrapper.find("#project-name").element.value).toBe("Test Project");
    expect(wrapper.find("#feature-name").element.value).toBe("Test Feature");
    expect(wrapper.find("#feature-slug").element.value).toBe("test-feature");
    expect(wrapper.find("textarea").element.value).toBe(
      "Test requirements for the project"
    );
  });

  it("should show validation errors when present", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "project-name",
              token: "PROJECT_NAME",
              message: "Missing required input: PROJECT_NAME",
              type: "required",
            },
          ],
          warnings: [],
        },
      },
    });

    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    expect(wrapper.find(".global-inputs__input--error").exists()).toBe(true);
    expect(wrapper.find(".global-inputs__error").exists()).toBe(true);
    expect(wrapper.find(".global-inputs__error").text()).toBe(
      "Missing required input: PROJECT_NAME"
    );
  });

  it("should apply error styling to invalid inputs", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "project-name",
              token: "PROJECT_NAME",
              message: "Missing required input: PROJECT_NAME",
              type: "required",
            },
          ],
          warnings: [],
        },
      },
    });

    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    const projectNameInput = wrapper.find("#project-name");
    expect(projectNameInput.classes()).toContain("global-inputs__input--error");
    expect(projectNameInput.attributes("aria-invalid")).toBe("true");
    expect(projectNameInput.attributes("aria-describedby")).toBe(
      "project-name-error"
    );
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
      },
    });

    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    expect(wrapper.find(".global-inputs__input--error").exists()).toBe(false);
    expect(wrapper.find(".global-inputs__error").exists()).toBe(false);
  });

  it("should pass template and phase inputs to validation", async () => {
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
      },
    }));
    useValidation.mockImplementation(mockUseValidationInstance);

    const template = "Project: [PROJECT_NAME]";
    const phaseInputs = {CUSTOM_TOKEN: "Custom Value"};

    mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
        template,
        phaseInputs,
      },
    });

    expect(mockUseValidationInstance).toHaveBeenCalledWith(
      template,
      mockGlobalInputs,
      phaseInputs
    );
  });

  it("should have proper accessibility attributes", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "project-name",
              token: "PROJECT_NAME",
              message: "Missing required input: PROJECT_NAME",
              type: "required",
            },
          ],
          warnings: [],
        },
      },
    });

    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    const projectNameInput = wrapper.find("#project-name");
    const errorMessage = wrapper.find("#project-name-error");

    expect(projectNameInput.attributes("aria-invalid")).toBe("true");
    expect(projectNameInput.attributes("aria-describedby")).toBe(
      "project-name-error"
    );
    expect(errorMessage.attributes("role")).toBe("alert");
  });

  it("should handle multiple validation errors", async () => {
    const {useValidation} = vi.mocked(
      await import("../../composables/useValidation")
    );
    useValidation.mockReturnValue({
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "project-name",
              token: "PROJECT_NAME",
              message: "Missing required input: PROJECT_NAME",
              type: "required",
            },
            {
              field: "feature-name",
              token: "FEATURE_NAME",
              message: "Missing required input: FEATURE_NAME",
              type: "required",
            },
          ],
          warnings: [],
        },
      },
    });

    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    const errorInputs = wrapper.findAll(".global-inputs__input--error");
    const errorMessages = wrapper.findAll(".global-inputs__error");

    expect(errorInputs).toHaveLength(2);
    expect(errorMessages).toHaveLength(2);
  });

  it("should have proper accessibility attributes for all inputs", () => {
    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    // Check that all inputs have proper labels and IDs
    const inputs = wrapper.findAll("input");
    inputs.forEach((input) => {
      const id = input.attributes("id");
      expect(id).toBeTruthy();

      const label = wrapper.find(`label[for="${id}"]`);
      expect(label.exists()).toBe(true);
    });
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
              field: "project-name",
              token: "PROJECT_NAME",
              message: "Missing required input: PROJECT_NAME",
              type: "required",
            },
          ],
          warnings: [],
        },
      },
    });

    const wrapper = mount(GlobalInputs, {
      props: {
        globalInputs: mockGlobalInputs,
      },
    });

    const projectNameInput = wrapper.find("#project-name");
    const errorMessage = wrapper.find("#project-name-error");

    // Check aria attributes
    expect(projectNameInput.attributes("aria-invalid")).toBe("true");
    expect(projectNameInput.attributes("aria-describedby")).toBe(
      "project-name-error"
    );
    expect(errorMessage.attributes("role")).toBe("alert");
  });
});
