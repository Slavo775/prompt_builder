import {describe, it, expect, beforeEach} from "vitest";
import {useValidation} from "../composables/useValidation";
import type {GlobalInputs} from "../types";

describe("useValidation", () => {
  let mockGlobalInputs: GlobalInputs;
  let mockPhaseInputs: Record<string, string>;

  beforeEach(() => {
    mockGlobalInputs = {
      projectName: "Test Project",
      featureName: "Test Feature",
      featureSlug: "test-feature",
      owner: "John Doe",
      repoUrl: "https://github.com/test/repo",
      stack: "Vue 3, TypeScript",
      dateIso: "2024-01-01",
      requirements: "Test Requirements",
    };

    mockPhaseInputs = {
      CUSTOM_TOKEN: "Custom Value",
      ANOTHER_TOKEN: "Another Value",
    };
  });

  describe("validation state", () => {
    it("should return valid state for complete inputs", () => {
      const template = "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN]";
      const {validationState} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(validationState.value.isValid).toBe(true);
      expect(validationState.value.errors).toHaveLength(0);
    });

    it("should return invalid state for missing inputs", () => {
      const template = "Project: [PROJECT_NAME], Missing: [MISSING_TOKEN]";
      const {validationState} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(validationState.value.isValid).toBe(false);
      expect(validationState.value.errors.length).toBeGreaterThan(0);
    });

    it("should return invalid state for empty inputs", () => {
      const template = "Project: [PROJECT_NAME]";
      const incompleteInputs = {
        ...mockGlobalInputs,
        projectName: "",
      };
      const {validationState} = useValidation(
        template,
        incompleteInputs,
        mockPhaseInputs
      );

      expect(validationState.value.isValid).toBe(false);
      expect(
        validationState.value.errors.some((e) => e.token === "PROJECT_NAME")
      ).toBe(true);
    });

    it("should generate warnings for unused inputs", () => {
      const template = "Project: [PROJECT_NAME]";
      const {validationState} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(validationState.value.warnings.length).toBeGreaterThan(0);
      expect(
        validationState.value.warnings.some((w) => w.token === "CUSTOM_TOKEN")
      ).toBe(true);
    });
  });

  describe("validateInput", () => {
    it("should validate individual input field", () => {
      const template = "Project: [PROJECT_NAME]";
      const {validateInput} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      const errors = validateInput("project-name", "Test Value");
      expect(errors).toHaveLength(0);
    });

    it("should return error for empty required field", () => {
      const template = "Project: [PROJECT_NAME]";
      const {validateInput} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      const errors = validateInput("project-name", "");
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("project-name");
      expect(errors[0].token).toBe("PROJECT_NAME");
    });

    it("should validate non-required field", () => {
      const template = "Project: [PROJECT_NAME]";
      const {validateInput} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      // Testing a field that's not in the template (should not be required)
      const errors = validateInput("optional-field", "");
      expect(errors).toHaveLength(0);
    });

    it("should handle field name mapping", () => {
      const template = "Project: [PROJECT_NAME]";
      const {validateInput} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      const errors = validateInput("project-name", "");
      expect(errors[0].token).toBe("PROJECT_NAME");
    });
  });

  describe("validateAll", () => {
    it("should validate all inputs and return complete state", () => {
      const template = "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN]";
      const {validateAll} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      const result = validateAll();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should identify all validation errors", () => {
      const template = "Project: [PROJECT_NAME], Missing: [MISSING_TOKEN]";
      const incompleteInputs = {
        ...mockGlobalInputs,
        projectName: "",
      };
      const {validateAll} = useValidation(
        template,
        incompleteInputs,
        mockPhaseInputs
      );

      const result = validateAll();
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("clearValidation", () => {
    it("should clear all validation when no field specified", () => {
      const template = "Project: [PROJECT_NAME]";
      const incompleteInputs = {
        ...mockGlobalInputs,
        projectName: "",
      };
      const {validationState, clearValidation} = useValidation(
        template,
        incompleteInputs,
        mockPhaseInputs
      );

      expect(validationState.value.errors.length).toBeGreaterThan(0);

      clearValidation();

      expect(validationState.value.isValid).toBe(true);
      expect(validationState.value.errors).toHaveLength(0);
    });

    it("should clear validation for specific field", () => {
      const template = "Project: [PROJECT_NAME]";
      const incompleteInputs = {
        ...mockGlobalInputs,
        projectName: "",
      };
      const {validationState, clearValidation} = useValidation(
        template,
        incompleteInputs,
        mockPhaseInputs
      );

      const initialErrorCount = validationState.value.errors.length;
      expect(initialErrorCount).toBeGreaterThan(0);

      clearValidation("project-name");

      // Should have one less error (or be valid if that was the only error)
      expect(validationState.value.errors.length).toBeLessThan(
        initialErrorCount
      );
    });
  });

  describe("reactive updates", () => {
    it("should update validation when template changes", () => {
      let template = "Project: [PROJECT_NAME]";
      const {validationState} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(validationState.value.isValid).toBe(true);

      // Simulate template change (in real usage, this would be reactive)
      template = "Project: [PROJECT_NAME], Missing: [MISSING_TOKEN]";
      const {validationState: newValidationState} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(newValidationState.value.isValid).toBe(false);
    });

    it("should update validation when inputs change", () => {
      const template = "Project: [PROJECT_NAME]";
      const {validationState} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(validationState.value.isValid).toBe(true);

      // Simulate input change
      const newInputs = {
        ...mockGlobalInputs,
        projectName: "",
      };
      const {validationState: newValidationState} = useValidation(
        template,
        newInputs,
        mockPhaseInputs
      );

      expect(newValidationState.value.isValid).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty template", () => {
      const {validationState} = useValidation(
        "",
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(validationState.value.isValid).toBe(true);
      expect(validationState.value.errors).toHaveLength(0);
    });

    it("should handle template with no tokens", () => {
      const template = "This is a regular text without any tokens.";
      const {validationState} = useValidation(
        template,
        mockGlobalInputs,
        mockPhaseInputs
      );

      expect(validationState.value.isValid).toBe(true);
      expect(validationState.value.errors).toHaveLength(0);
    });

    it("should handle empty inputs", () => {
      const template = "Project: [PROJECT_NAME]";
      const emptyInputs = {
        projectName: "",
        featureName: "",
        featureSlug: "",
        owner: "",
        repoUrl: "",
        stack: "",
        dateIso: "",
      };
      const {validationState} = useValidation(template, emptyInputs, {});

      expect(validationState.value.isValid).toBe(false);
      expect(
        validationState.value.errors.some((e) => e.token === "PROJECT_NAME")
      ).toBe(true);
    });
  });
});
