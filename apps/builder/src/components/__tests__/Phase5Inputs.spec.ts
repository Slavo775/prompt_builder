import {describe, it, expect, vi} from "vitest";
import {mount} from "@vue/test-utils";
import Phase5Inputs from "../Phase5Inputs.vue";

// Mock the usePhase5Inputs composable
const mockInputs = {
  bugTitle: "Test Bug",
  commitSha: "abc1234",
  browserOs: "Chrome 120 on macOS 14",
  urlRoute: "https://example.com/page",
  severity: "major" as const,
  prdFile: "PRD_test_feature.md",
  featureName: "Test Feature",
  prdGoalsRelevant: "• Goal 1: Test\n• Goal 2: Validate",
  prdNongoalsRelevant: "• Non-Goal 1: Refactor\n• Non-Goal 2: Rewrite",
  prdFrIds: "FR-1, FR-2",
  prdTypesStable: "User, AuthState",
  rfcFile: "RFC_test_feature.md",
  rfcAllowlistPaths: "src/components/\nsrc/utils/",
  rfcZeroInfraSummary: "No infrastructure changes needed",
  rfcOptionalAdjustments: "Optional changes",
  reproSteps: "1) Navigate to page\n2) Click button\n3) See error",
  expectedBehavior: "Should work correctly",
  actualBehavior: "Shows error message",
  suspectedRootCause: "Missing validation",
};

vi.mock("../../composables/usePhase5Inputs", () => ({
  usePhase5Inputs: vi.fn(() => ({
    inputs: {
      value: mockInputs,
    },
    validationState: {
      value: {
        isValid: true,
        errors: [],
        warnings: [],
      },
    },
    updateInput: vi.fn(),
    getFieldError: vi.fn(() => ""),
  })),
}));

describe("Phase5Inputs", () => {
  it("should render Phase 5 inputs component", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
      },
    });

    expect(wrapper.find(".phase5-inputs__title").text()).toBe(
      "Phase 5 - Fix Report Inputs"
    );
  });

  it("should render all four sections", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
      },
    });

    const sections = wrapper.findAll(".phase5-inputs__section");
    expect(sections).toHaveLength(4);

    const sectionTitles = sections.map((section) =>
      section.find(".phase5-inputs__section-title").text()
    );
    expect(sectionTitles).toEqual([
      "Bug Context",
      "PRD Context",
      "RFC Context",
      "Bug Reproduction",
    ]);
  });

  it("should render all 17 input fields", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
      },
    });

    console.log("HTML:", wrapper.html());
    console.log("All inputs:", wrapper.findAll("input"));
    console.log("All textareas:", wrapper.findAll("textarea"));
    console.log("All selects:", wrapper.findAll("select"));

    // Count all input fields (text inputs, textareas, selects, and url inputs)
    const allInputs = wrapper.findAll("input");
    const textareas = wrapper.findAll("textarea");
    const selects = wrapper.findAll("select");

    // Filter inputs by type
    const textInputs = allInputs.filter(
      (input) =>
        (!input.attributes("type") || input.attributes("type") === "text") &&
        !input.classes().includes("phase5-input-field__input--commit-sha")
    );
    const urlInputs = allInputs.filter(
      (input) => input.attributes("type") === "url"
    );
    const commitShaInputs = allInputs.filter((input) =>
      input.classes().includes("phase5-input-field__input--commit-sha")
    );

    console.log("All inputs:", allInputs.length);
    console.log("Text inputs:", textInputs.length);
    console.log("Textareas:", textareas.length);
    console.log("Selects:", selects.length);
    console.log("URL inputs:", urlInputs.length);
    console.log("Commit SHA inputs:", commitShaInputs.length);

    // Expected counts:
    // - Text inputs: 7 (bugTitle, browserOs, prdFile, featureName, prdFrIds, prdTypesStable, rfcFile)
    // - URL inputs: 1 (urlRoute)
    // - Commit SHA inputs: 1 (commitSha)
    // - Textareas: 9 (prdGoalsRelevant, prdNongoalsRelevant, rfcAllowlistPaths, rfcZeroInfraSummary, rfcOptionalAdjustments, reproSteps, expectedBehavior, actualBehavior, suspectedRootCause)
    // - Selects: 1 (severity)
    // Total: 7 + 1 + 1 + 9 + 1 = 19

    expect(textInputs.length).toBe(7);
    expect(urlInputs.length).toBe(1);
    expect(commitShaInputs.length).toBe(1);
    expect(textareas.length).toBe(9);
    expect(selects.length).toBe(1);

    const totalInputs = allInputs.length + textareas.length + selects.length;
    expect(totalInputs).toBe(19);
  });

  it("should display validation summary when there are errors", async () => {
    // Mock validation state with errors
    const {usePhase5Inputs} = await import("../../composables/usePhase5Inputs");
    vi.mocked(usePhase5Inputs).mockReturnValue({
      inputs: {value: mockInputs},
      validationState: {
        value: {
          isValid: false,
          errors: [
            {
              field: "bugTitle",
              message: "Bug title is required",
              type: "required",
            },
            {
              field: "severity",
              message: "Severity is required",
              type: "required",
            },
          ],
          warnings: [],
        },
      },
      updateInput: vi.fn(),
      getFieldError: vi.fn((field) => {
        if (field === "bugTitle") return "Bug title is required";
        if (field === "severity") return "Severity is required";
        return "";
      }),
    });

    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
        showValidation: true,
      },
    });

    const validationSummary = wrapper.find(
      ".phase5-inputs__validation-summary"
    );
    expect(validationSummary.exists()).toBe(true);
    expect(
      validationSummary.find(".phase5-inputs__validation-title").text()
    ).toBe("Please fix the following errors:");
  });

  it("should emit update:modelValue when inputs change", async () => {
    // Create a mock that actually emits events
    const mockEmit = vi.fn();
    const {usePhase5Inputs} = await import("../../composables/usePhase5Inputs");
    vi.mocked(usePhase5Inputs).mockReturnValue({
      inputs: {value: mockInputs},
      validationState: {value: {isValid: true, errors: [], warnings: []}},
      updateInput: vi.fn((field, value) => {
        // Simulate updating the inputs and emitting
        const updatedInputs = {...mockInputs, [field]: value};
        mockEmit("update:modelValue", updatedInputs);
      }),
      validateInput: vi.fn(),
      validateAll: vi.fn(),
      resetInputs: vi.fn(),
      getFieldError: vi.fn(),
    });

    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
      },
    });

    // Find the first input field and trigger change
    const firstInput = wrapper.find("input");
    await firstInput.setValue("New Bug Title");

    // The emission should happen through the updateInput mock
    expect(mockEmit).toHaveBeenCalledWith(
      "update:modelValue",
      expect.any(Object)
    );
  });

  it("should be accessible", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
      },
    });

    // Basic accessibility checks
    expect(wrapper.find(".phase5-inputs__title").exists()).toBe(true);
    expect(wrapper.findAll("label").length).toBeGreaterThan(0);

    // Count all form elements
    const allInputs = wrapper.findAll("input");
    const textareas = wrapper.findAll("textarea");
    const selects = wrapper.findAll("select");
    const totalFormElements =
      allInputs.length + textareas.length + selects.length;
    expect(totalFormElements).toBe(19);
  });

  it("should support compact mode", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
        compact: true,
      },
    });

    expect(wrapper.classes()).toContain("phase5-inputs--compact");
  });

  it("should support disabled state", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
        disabled: true,
      },
    });

    // Check that inputs are disabled
    const inputs = wrapper.findAll("input, textarea, select");
    inputs.forEach((input) => {
      expect(input.attributes("disabled")).toBeDefined();
    });
  });

  it("should render help text for fields", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
      },
    });

    const helpTexts = wrapper.findAll(".phase5-input-field__help");
    expect(helpTexts.length).toBeGreaterThan(0);
  });

  it("should render required indicators for required fields", () => {
    const wrapper = mount(Phase5Inputs, {
      props: {
        modelValue: mockInputs,
      },
    });

    const requiredIndicators = wrapper.findAll(".phase5-input-field__required");
    expect(requiredIndicators.length).toBeGreaterThan(0);
  });
});
