import {describe, it, expect, vi} from "vitest";
import {usePhase5Inputs} from "../usePhase5Inputs";
import type {Phase5Inputs} from "../../config/types";

// Mock the validation utilities
vi.mock("../../utils/phase5Validation", () => ({
  createEmptyPhase5Inputs: vi.fn(() => ({
    bugTitle: "",
    commitSha: "",
    browserOs: "",
    urlRoute: "",
    severity: "minor",
    prdFile: "",
    featureName: "",
    prdGoalsRelevant: "",
    prdNongoalsRelevant: "",
    prdFrIds: "",
    prdTypesStable: "",
    rfcFile: "",
    rfcAllowlistPaths: "",
    rfcZeroInfraSummary: "",
    rfcOptionalAdjustments: "",
    reproSteps: "",
    expectedBehavior: "",
    actualBehavior: "",
    suspectedRootCause: "",
  })),
  validatePhase5Inputs: vi.fn(() => ({
    isValid: true,
    errors: [],
    warnings: [],
  })),
  getPhase5FieldError: vi.fn(() => ""),
  PHASE_5_VALIDATION_RULES: [],
}));

describe("usePhase5Inputs", () => {
  it("should initialize with empty inputs", () => {
    const {inputs} = usePhase5Inputs();

    expect(inputs.value).toEqual({
      bugTitle: "",
      commitSha: "",
      browserOs: "",
      urlRoute: "",
      severity: "minor",
      prdFile: "",
      featureName: "",
      prdGoalsRelevant: "",
      prdNongoalsRelevant: "",
      prdFrIds: "",
      prdTypesStable: "",
      rfcFile: "",
      rfcAllowlistPaths: "",
      rfcZeroInfraSummary: "",
      rfcOptionalAdjustments: "",
      reproSteps: "",
      expectedBehavior: "",
      actualBehavior: "",
      suspectedRootCause: "",
    });
  });

  it("should initialize with provided inputs", () => {
    const initialInputs: Partial<Phase5Inputs> = {
      bugTitle: "Test Bug",
      severity: "critical",
    };

    const {inputs} = usePhase5Inputs(initialInputs);

    expect(inputs.value.bugTitle).toBe("Test Bug");
    expect(inputs.value.severity).toBe("critical");
    expect(inputs.value.commitSha).toBe(""); // Should use default for unspecified fields
  });

  it("should update input field", () => {
    const {inputs, updateInput} = usePhase5Inputs();

    updateInput("bugTitle", "New Bug Title");

    expect(inputs.value.bugTitle).toBe("New Bug Title");
  });

  it("should update multiple input fields", () => {
    const {inputs, updateInput} = usePhase5Inputs();

    updateInput("bugTitle", "Bug Title");
    updateInput("commitSha", "abc1234");
    updateInput("severity", "major");

    expect(inputs.value.bugTitle).toBe("Bug Title");
    expect(inputs.value.commitSha).toBe("abc1234");
    expect(inputs.value.severity).toBe("major");
  });

  it("should validate input field", () => {
    const {validateInput} = usePhase5Inputs();

    const errors = validateInput("bugTitle");

    expect(Array.isArray(errors)).toBe(true);
  });

  it("should validate all inputs", () => {
    const {validateAll} = usePhase5Inputs();

    const validationState = validateAll();

    expect(validationState).toEqual({
      isValid: true,
      errors: [],
      warnings: [],
    });
  });

  it("should reset inputs to empty state", () => {
    const {inputs, updateInput, resetInputs} = usePhase5Inputs();

    // Set some values
    updateInput("bugTitle", "Test Bug");
    updateInput("commitSha", "abc1234");

    // Reset
    resetInputs();

    expect(inputs.value.bugTitle).toBe("");
    expect(inputs.value.commitSha).toBe("");
  });

  it("should get field error", () => {
    const {getFieldError} = usePhase5Inputs();

    const error = getFieldError("bugTitle");

    expect(typeof error).toBe("string");
  });

  it("should return validation state", () => {
    const {validationState} = usePhase5Inputs();

    expect(validationState.value).toEqual({
      isValid: true,
      errors: [],
      warnings: [],
    });
  });

  it("should be reactive to input changes", async () => {
    const {inputs, updateInput, validationState} = usePhase5Inputs();

    // Initial state
    expect(validationState.value.isValid).toBe(true);

    // Update input
    updateInput("bugTitle", "Test Bug");

    // Validation should be triggered
    expect(inputs.value.bugTitle).toBe("Test Bug");
  });

  it("should handle all Phase 5 input fields", () => {
    const {updateInput, inputs} = usePhase5Inputs();

    const testValues = {
      bugTitle: "Test Bug",
      commitSha: "abc1234",
      browserOs: "Chrome 120 on macOS 14",
      urlRoute: "https://example.com/page",
      severity: "major" as const,
      prdFile: "PRD_test.md",
      featureName: "Test Feature",
      prdGoalsRelevant: "Test goals",
      prdNongoalsRelevant: "Test non-goals",
      prdFrIds: "FR-1, FR-2",
      prdTypesStable: "User, AuthState",
      rfcFile: "RFC_test.md",
      rfcAllowlistPaths: "src/components/",
      rfcZeroInfraSummary: "No infra changes",
      rfcOptionalAdjustments: "Optional changes",
      reproSteps: "1) Navigate\n2) Click",
      expectedBehavior: "Should work",
      actualBehavior: "Shows error",
      suspectedRootCause: "Missing validation",
    };

    // Update all fields
    Object.entries(testValues).forEach(([field, value]) => {
      updateInput(field as keyof Phase5Inputs, value as string);
    });

    // Verify all fields were updated
    Object.entries(testValues).forEach(([field, value]) => {
      expect(inputs.value[field as keyof Phase5Inputs]).toBe(value);
    });
  });
});
