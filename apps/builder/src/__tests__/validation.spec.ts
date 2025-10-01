import {describe, it, expect} from "vitest";
import {
  validateGlobalInputs,
  validatePhaseInputs,
  validateAllInputs,
  validateInputField,
  getValidationRules,
  createValidationError,
  createValidationWarning,
} from "../utils/validation";
import type {GlobalInputs} from "../types";

describe("validation", () => {
  const mockGlobalInputs: GlobalInputs = {
    projectName: "Test Project",
    featureName: "Test Feature",
    featureSlug: "test-feature",
    requirements: "Test requirements for the project",
  };

  describe("validateGlobalInputs", () => {
    it("should validate complete global inputs", () => {
      const template =
        "Project: [PROJECT_NAME], Feature: [FEATURE_NAME], Requirements: [REQUIREMENTS]";
      const errors = validateGlobalInputs(mockGlobalInputs, template);

      expect(errors).toHaveLength(0);
    });

    it("should identify missing global inputs", () => {
      const template = "Project: [PROJECT_NAME], Missing: [MISSING_TOKEN]";
      const errors = validateGlobalInputs(mockGlobalInputs, template);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("missing-token");
      expect(errors[0].token).toBe("MISSING_TOKEN");
      expect(errors[0].message).toContain("Missing required input");
    });

    it("should identify empty global inputs", () => {
      const incompleteInputs = {
        ...mockGlobalInputs,
        projectName: "",
      };
      const template = "Project: [PROJECT_NAME]";
      const errors = validateGlobalInputs(incompleteInputs, template);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("project-name");
      expect(errors[0].token).toBe("PROJECT_NAME");
      expect(errors[0].message).toContain("Missing required input");
    });

    it("should handle phase inputs in validation", () => {
      const template = "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN]";
      const phaseInputs = {CUSTOM_TOKEN: "Custom Value"};
      const errors = validateGlobalInputs(
        mockGlobalInputs,
        template,
        phaseInputs
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].token).toBe("CUSTOM_TOKEN");
    });
  });

  describe("validatePhaseInputs", () => {
    it("should validate complete phase inputs", () => {
      const template = "Custom: [CUSTOM_TOKEN], Another: [ANOTHER_TOKEN]";
      const phaseInputs = {
        CUSTOM_TOKEN: "Custom Value",
        ANOTHER_TOKEN: "Another Value",
      };
      const errors = validatePhaseInputs(
        phaseInputs,
        template,
        mockGlobalInputs
      );

      expect(errors).toHaveLength(0);
    });

    it("should identify missing phase inputs", () => {
      const template = "Custom: [CUSTOM_TOKEN], Missing: [MISSING_TOKEN]";
      const phaseInputs = {CUSTOM_TOKEN: "Custom Value"};
      const errors = validatePhaseInputs(
        phaseInputs,
        template,
        mockGlobalInputs
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("phase-input-MISSING_TOKEN");
      expect(errors[0].token).toBe("MISSING_TOKEN");
      expect(errors[0].message).toContain("Missing required input");
    });

    it("should identify empty phase inputs", () => {
      const template = "Custom: [CUSTOM_TOKEN]";
      const phaseInputs = {CUSTOM_TOKEN: ""};
      const errors = validatePhaseInputs(
        phaseInputs,
        template,
        mockGlobalInputs
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("phase-input-CUSTOM_TOKEN");
      expect(errors[0].token).toBe("CUSTOM_TOKEN");
      expect(errors[0].message).toContain("Missing required input");
    });

    it("should not validate global inputs as phase inputs", () => {
      const template = "Project: [PROJECT_NAME]";
      const phaseInputs = {};
      const errors = validatePhaseInputs(
        phaseInputs,
        template,
        mockGlobalInputs
      );

      expect(errors).toHaveLength(0);
    });
  });

  describe("validateAllInputs", () => {
    it("should validate all inputs successfully", () => {
      const template = "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN]";
      const phaseInputs = {CUSTOM_TOKEN: "Custom Value"};
      const result = validateAllInputs(template, mockGlobalInputs, phaseInputs);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it("should identify multiple validation errors", () => {
      const template =
        "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN], Missing: [MISSING_TOKEN]";
      const phaseInputs = {CUSTOM_TOKEN: ""};
      const result = validateAllInputs(template, mockGlobalInputs, phaseInputs);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should generate warnings for unused inputs", () => {
      const template = "Project: [PROJECT_NAME]";
      const phaseInputs = {
        CUSTOM_TOKEN: "Custom Value",
        UNUSED_TOKEN: "Unused Value",
      };
      const result = validateAllInputs(template, mockGlobalInputs, phaseInputs);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.token === "CUSTOM_TOKEN")).toBe(
        true
      );
      expect(result.warnings.some((w) => w.token === "UNUSED_TOKEN")).toBe(
        true
      );
    });
  });

  describe("validateInputField", () => {
    it("should validate required field with value", () => {
      const errors = validateInputField(
        "test-field",
        "Test Value",
        "TEST_TOKEN",
        true
      );
      expect(errors).toHaveLength(0);
    });

    it("should validate required field without value", () => {
      const errors = validateInputField("test-field", "", "TEST_TOKEN", true);
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("test-field");
      expect(errors[0].token).toBe("TEST_TOKEN");
      expect(errors[0].message).toContain("Required input cannot be empty");
    });

    it("should validate optional field without value", () => {
      const errors = validateInputField("test-field", "", "TEST_TOKEN", false);
      expect(errors).toHaveLength(0);
    });

    it("should validate field with whitespace-only value", () => {
      const errors = validateInputField(
        "test-field",
        "   ",
        "TEST_TOKEN",
        true
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain("Required input cannot be empty");
    });
  });

  describe("getValidationRules", () => {
    it("should extract validation rules from template", () => {
      const template = "Hello [PROJECT_NAME], welcome to [FEATURE_NAME]!";
      const rules = getValidationRules(template);

      expect(rules).toHaveLength(2);
      expect(rules[0].token).toBe("PROJECT_NAME");
      expect(rules[0].required).toBe(true);
      expect(rules[1].token).toBe("FEATURE_NAME");
      expect(rules[1].required).toBe(true);
    });

    it("should handle template with no tokens", () => {
      const template = "This is a regular text without any tokens.";
      const rules = getValidationRules(template);

      expect(rules).toHaveLength(0);
    });

    it("should remove duplicate tokens from rules", () => {
      const template = "[PROJECT_NAME] is great! [PROJECT_NAME] is awesome!";
      const rules = getValidationRules(template);

      expect(rules).toHaveLength(1);
      expect(rules[0].token).toBe("PROJECT_NAME");
    });
  });

  describe("createValidationError", () => {
    it("should create validation error with default type", () => {
      const error = createValidationError(
        "test-field",
        "TEST_TOKEN",
        "Test error message"
      );

      expect(error.field).toBe("test-field");
      expect(error.token).toBe("TEST_TOKEN");
      expect(error.message).toBe("Test error message");
      expect(error.type).toBe("required");
    });

    it("should create validation error with custom type", () => {
      const error = createValidationError(
        "test-field",
        "TEST_TOKEN",
        "Test error message",
        "custom"
      );

      expect(error.type).toBe("custom");
    });
  });

  describe("createValidationWarning", () => {
    it("should create validation warning with default type", () => {
      const warning = createValidationWarning(
        "test-field",
        "TEST_TOKEN",
        "Test warning message"
      );

      expect(warning.field).toBe("test-field");
      expect(warning.token).toBe("TEST_TOKEN");
      expect(warning.message).toBe("Test warning message");
      expect(warning.type).toBe("suggestion");
    });

    it("should create validation warning with custom type", () => {
      const warning = createValidationWarning(
        "test-field",
        "TEST_TOKEN",
        "Test warning message",
        "deprecation"
      );

      expect(warning.type).toBe("deprecation");
    });
  });
});
