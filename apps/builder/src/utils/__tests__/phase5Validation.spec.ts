import {describe, it, expect} from "vitest";
import {
  validatePhase5Field,
  validatePhase5Inputs,
  getPhase5FieldError,
  hasPhase5FieldError,
  getPhase5FieldsWithErrors,
  createEmptyPhase5Inputs,
  phase5InputsToTokenMap,
} from "../phase5Validation";
import type {
  Phase5Inputs,
  Phase5ValidationRule,
  BugSeverity,
} from "../../config/types";

describe("phase5Validation", () => {
  describe("validatePhase5Field", () => {
    const rules: Phase5ValidationRule[] = [
      {
        field: "bugTitle",
        required: true,
        message: "Bug title is required",
      },
      {
        field: "urlRoute",
        required: true,
        pattern: /^https?:\/\/.+/,
        message: "URL must be a valid HTTP/HTTPS URL",
      },
    ];

    it("should validate required field", () => {
      const errors = validatePhase5Field("bugTitle", "", rules);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("bugTitle");
      expect(errors[0].message).toBe("Bug title is required");
      expect(errors[0].type).toBe("required");
    });

    it("should pass validation for valid required field", () => {
      const errors = validatePhase5Field("bugTitle", "Test Bug", rules);

      expect(errors).toHaveLength(0);
    });

    it("should validate pattern for non-empty field", () => {
      const errors = validatePhase5Field("urlRoute", "invalid-url", rules);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("urlRoute");
      expect(errors[0].message).toBe("URL must be a valid HTTP/HTTPS URL");
      expect(errors[0].type).toBe("format");
    });

    it("should pass pattern validation for valid URL", () => {
      const errors = validatePhase5Field(
        "urlRoute",
        "https://example.com",
        rules
      );

      expect(errors).toHaveLength(0);
    });

    it("should not validate pattern for empty required field", () => {
      const errors = validatePhase5Field("urlRoute", "", rules);

      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("required");
    });
  });

  describe("validatePhase5Inputs", () => {
    it("should validate all inputs and return valid state", () => {
      const inputs: Phase5Inputs = {
        bugTitle: "Test Bug",
        commitSha: "abc1234",
        browserOs: "Chrome 120 on macOS 14",
        urlRoute: "https://example.com/page",
        severity: "major",
        prdFile: "PRD_test_feature.md",
        featureName: "Test Feature",
        prdGoalsRelevant: "Test goals",
        prdNongoalsRelevant: "Test non-goals",
        prdFrIds: "FR-1, FR-2",
        prdTypesStable: "User, AuthState",
        rfcFile: "RFC_test_feature.md",
        rfcAllowlistPaths: "src/components/",
        rfcZeroInfraSummary: "No infra changes",
        rfcOptionalAdjustments: "Optional changes",
        reproSteps: "1) Navigate\n2) Click",
        expectedBehavior: "Should work",
        actualBehavior: "Shows error",
        suspectedRootCause: "Missing validation",
      };

      const validationState = validatePhase5Inputs(inputs, []);

      expect(validationState.isValid).toBe(true);
      expect(validationState.errors).toHaveLength(0);
      expect(validationState.warnings).toHaveLength(0);
    });

    it("should validate severity field", () => {
      const inputs: Phase5Inputs = {
        ...createEmptyPhase5Inputs(),
        severity: "invalid" as BugSeverity,
      };

      const validationState = validatePhase5Inputs(inputs, []);

      expect(validationState.isValid).toBe(false);
      expect(validationState.errors).toHaveLength(1);
      expect(validationState.errors[0].field).toBe("severity");
    });

    it("should validate URL field", () => {
      const inputs: Phase5Inputs = {
        ...createEmptyPhase5Inputs(),
        urlRoute: "invalid-url",
      };

      const validationState = validatePhase5Inputs(inputs, []);

      expect(validationState.isValid).toBe(false);
      expect(validationState.errors).toHaveLength(1);
      expect(validationState.errors[0].field).toBe("urlRoute");
    });

    it("should validate PRD file format", () => {
      const inputs: Phase5Inputs = {
        ...createEmptyPhase5Inputs(),
        prdFile: "invalid-prd.md",
      };

      const validationState = validatePhase5Inputs(inputs, []);

      expect(validationState.isValid).toBe(false);
      expect(validationState.errors).toHaveLength(1);
      expect(validationState.errors[0].field).toBe("prdFile");
    });

    it("should validate RFC file format", () => {
      const inputs: Phase5Inputs = {
        ...createEmptyPhase5Inputs(),
        rfcFile: "invalid-rfc.md",
      };

      const validationState = validatePhase5Inputs(inputs, []);

      expect(validationState.isValid).toBe(false);
      expect(validationState.errors).toHaveLength(1);
      expect(validationState.errors[0].field).toBe("rfcFile");
    });
  });

  describe("getPhase5FieldError", () => {
    it("should return error message for field with error", () => {
      const validationState = {
        isValid: false,
        errors: [
          {
            field: "bugTitle" as keyof Phase5Inputs,
            message: "Bug title is required",
            type: "required" as const,
          },
        ],
        warnings: [],
      };

      const error = getPhase5FieldError("bugTitle", validationState);

      expect(error).toBe("Bug title is required");
    });

    it("should return empty string for field without error", () => {
      const validationState = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      const error = getPhase5FieldError("bugTitle", validationState);

      expect(error).toBe("");
    });
  });

  describe("hasPhase5FieldError", () => {
    it("should return true for field with error", () => {
      const validationState = {
        isValid: false,
        errors: [
          {
            field: "bugTitle" as keyof Phase5Inputs,
            message: "Bug title is required",
            type: "required" as const,
          },
        ],
        warnings: [],
      };

      const hasError = hasPhase5FieldError("bugTitle", validationState);

      expect(hasError).toBe(true);
    });

    it("should return false for field without error", () => {
      const validationState = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      const hasError = hasPhase5FieldError("bugTitle", validationState);

      expect(hasError).toBe(false);
    });
  });

  describe("getPhase5FieldsWithErrors", () => {
    it("should return fields with errors", () => {
      const validationState = {
        isValid: false,
        errors: [
          {
            field: "bugTitle" as keyof Phase5Inputs,
            message: "Bug title is required",
            type: "required" as const,
          },
          {
            field: "urlRoute" as keyof Phase5Inputs,
            message: "URL is invalid",
            type: "format" as const,
          },
        ],
        warnings: [],
      };

      const fieldsWithErrors = getPhase5FieldsWithErrors(validationState);

      expect(fieldsWithErrors).toEqual(["bugTitle", "urlRoute"]);
    });

    it("should return empty array when no errors", () => {
      const validationState = {
        isValid: true,
        errors: [],
        warnings: [],
      };

      const fieldsWithErrors = getPhase5FieldsWithErrors(validationState);

      expect(fieldsWithErrors).toEqual([]);
    });
  });

  describe("createEmptyPhase5Inputs", () => {
    it("should create empty Phase 5 inputs", () => {
      const inputs = createEmptyPhase5Inputs();

      expect(inputs).toEqual({
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
  });

  describe("phase5InputsToTokenMap", () => {
    it("should convert Phase 5 inputs to token map", () => {
      const inputs: Phase5Inputs = {
        bugTitle: "Test Bug",
        commitSha: "abc1234",
        browserOs: "Chrome 120 on macOS 14",
        urlRoute: "https://example.com/page",
        severity: "major",
        prdFile: "PRD_test_feature.md",
        featureName: "Test Feature",
        prdGoalsRelevant: "Test goals",
        prdNongoalsRelevant: "Test non-goals",
        prdFrIds: "FR-1, FR-2",
        prdTypesStable: "User, AuthState",
        rfcFile: "RFC_test_feature.md",
        rfcAllowlistPaths: "src/components/",
        rfcZeroInfraSummary: "No infra changes",
        rfcOptionalAdjustments: "Optional changes",
        reproSteps: "1) Navigate\n2) Click\n3) See error",
        expectedBehavior: "Should work",
        actualBehavior: "Shows error",
        suspectedRootCause: "Missing validation",
      };

      const tokenMap = phase5InputsToTokenMap(inputs);

      expect(tokenMap).toEqual({
        BUG_TITLE: "Test Bug",
        COMMIT_SHA: "abc1234",
        BROWSER_OS: "Chrome 120 on macOS 14",
        URL_ROUTE: "https://example.com/page",
        PRD_FILE: "PRD_test_feature.md",
        FEATURE_NAME: "Test Feature",
        PRD_GOALS_RELEVANT: "Test goals",
        PRD_NONGOALS_RELEVANT: "Test non-goals",
        PRD_FR_IDS: "FR-1, FR-2",
        PRD_TYPES_STABLE: "User, AuthState",
        RFC_FILE: "RFC_test_feature.md",
        RFC_ALLOWLIST_PATHS: "src/components/",
        RFC_ZERO_INFRA_SUMMARY: "No infra changes",
        RFC_OPTIONAL_ADJUSTMENTS: "Optional changes",
        STEP_1: "1) Navigate",
        STEP_2: "2) Click",
        STEP_3: "3) See error",
        EXPECTED_BEHAVIOR: "Should work",
        ACTUAL_BEHAVIOR: "Shows error",
      });
    });

    it("should handle empty reproduction steps", () => {
      const inputs: Phase5Inputs = {
        ...createEmptyPhase5Inputs(),
        reproSteps: "",
      };

      const tokenMap = phase5InputsToTokenMap(inputs);

      expect(tokenMap.STEP_1).toBe("");
      expect(tokenMap.STEP_2).toBe("");
      expect(tokenMap.STEP_3).toBe("");
    });
  });
});
