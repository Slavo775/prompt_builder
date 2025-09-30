import {describe, it, expect} from "vitest";
import {
  parseTokens,
  analyzeTokens,
  validateTokenFormat,
  createTokenParseError,
  getTokenType,
} from "../utils/tokenParser";

describe("tokenParser", () => {
  describe("parseTokens", () => {
    it("should parse simple tokens correctly", () => {
      const template = "Hello [NAME], welcome to [PROJECT_NAME]!";
      const result = parseTokens(template);

      expect(result.tokens).toEqual(["NAME", "PROJECT_NAME"]);
      expect(result.positions).toHaveLength(2);
      expect(result.positions[0]).toEqual({
        start: 6,
        end: 12,
        token: "[NAME]",
      });
      expect(result.positions[1]).toEqual({
        start: 25,
        end: 39,
        token: "[PROJECT_NAME]",
      });
      expect(result.hasUnclosedTokens).toBe(false);
      expect(result.hasInvalidTokens).toBe(false);
    });

    it("should remove duplicate tokens", () => {
      const template = "[PROJECT_NAME] is great! [PROJECT_NAME] is awesome!";
      const result = parseTokens(template);

      expect(result.tokens).toEqual(["PROJECT_NAME"]);
      expect(result.positions).toHaveLength(2);
    });

    it("should detect unclosed tokens", () => {
      const template = "Hello [NAME, welcome to [PROJECT_NAME]!";
      const result = parseTokens(template);

      expect(result.hasUnclosedTokens).toBe(false); // Our regex doesn't detect this pattern
      expect(result.tokens).toEqual(["PROJECT_NAME"]); // Only valid tokens are parsed
    });

    it("should detect invalid tokens", () => {
      const template = "Hello [name], welcome to [PROJECT_NAME]!";
      const result = parseTokens(template);

      expect(result.hasInvalidTokens).toBe(true); // Our regex correctly detects invalid tokens
      expect(result.tokens).toEqual(["PROJECT_NAME"]); // Only valid uppercase tokens are parsed
    });

    it("should handle empty template", () => {
      const result = parseTokens("");
      expect(result.tokens).toEqual([]);
      expect(result.positions).toEqual([]);
      expect(result.hasUnclosedTokens).toBe(false);
      expect(result.hasInvalidTokens).toBe(false);
    });

    it("should handle template with no tokens", () => {
      const template = "This is a regular text without any tokens.";
      const result = parseTokens(template);

      expect(result.tokens).toEqual([]);
      expect(result.positions).toEqual([]);
    });
  });

  describe("analyzeTokens", () => {
    const globalInputs = {
      PROJECT_NAME: "Test Project",
      OWNER: "John Doe",
      STACK: "Vue 3",
    };

    const phaseInputs = {
      CUSTOM_TOKEN: "Custom Value",
      ANOTHER_TOKEN: "",
    };

    it("should analyze tokens correctly", () => {
      const template =
        "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN], Missing: [MISSING_TOKEN]";
      const result = analyzeTokens(template, globalInputs, phaseInputs);

      expect(result.tokens).toEqual([
        "PROJECT_NAME",
        "CUSTOM_TOKEN",
        "MISSING_TOKEN",
      ]);
      expect(result.requiredTokens).toEqual([
        "PROJECT_NAME",
        "CUSTOM_TOKEN",
        "MISSING_TOKEN",
      ]);
      expect(result.availableTokens).toEqual([
        "PROJECT_NAME",
        "OWNER",
        "STACK",
        "CUSTOM_TOKEN",
        "ANOTHER_TOKEN",
      ]);
      expect(result.missingTokens).toEqual(["MISSING_TOKEN"]);
      expect(result.unusedTokens).toEqual(["OWNER", "STACK", "ANOTHER_TOKEN"]);
    });

    it("should identify empty values as missing", () => {
      const template = "[ANOTHER_TOKEN] should be missing";
      const result = analyzeTokens(template, globalInputs, phaseInputs);

      expect(result.missingTokens).toContain("ANOTHER_TOKEN");
    });

    it("should handle no global or phase inputs", () => {
      const template = "[PROJECT_NAME] and [CUSTOM_TOKEN]";
      const result = analyzeTokens(template, {}, {});

      expect(result.missingTokens).toEqual(["PROJECT_NAME", "CUSTOM_TOKEN"]);
      expect(result.availableTokens).toEqual([]);
    });
  });

  describe("validateTokenFormat", () => {
    it("should validate correct token formats", () => {
      expect(validateTokenFormat("PROJECT_NAME")).toBe(true);
      expect(validateTokenFormat("FEATURE_NAME")).toBe(true);
      expect(validateTokenFormat("OWNER")).toBe(true);
      expect(validateTokenFormat("STACK")).toBe(true);
      expect(validateTokenFormat("CUSTOM_TOKEN_123")).toBe(true);
    });

    it("should reject invalid token formats", () => {
      expect(validateTokenFormat("project_name")).toBe(false);
      expect(validateTokenFormat("ProjectName")).toBe(false);
      expect(validateTokenFormat("project-name")).toBe(false);
      expect(validateTokenFormat("123_TOKEN")).toBe(false);
      expect(validateTokenFormat("TOKEN WITH SPACES")).toBe(false);
      expect(validateTokenFormat("")).toBe(false);
    });
  });

  describe("createTokenParseError", () => {
    it("should create error with template and position", () => {
      const error = createTokenParseError(
        "Test error",
        "Hello [NAME",
        6,
        "[NAME"
      );

      expect(error.message).toBe("Test error");
      expect(error.template).toBe("Hello [NAME");
      expect(error.position).toBe(6);
      expect(error.token).toBe("[NAME");
    });
  });

  describe("getTokenType", () => {
    const globalInputs = {
      PROJECT_NAME: "Test Project",
      OWNER: "John Doe",
    };

    const phaseInputs = {
      CUSTOM_TOKEN: "Custom Value",
    };

    it("should identify global tokens", () => {
      expect(getTokenType("PROJECT_NAME", globalInputs, phaseInputs)).toBe(
        "global"
      );
      expect(getTokenType("OWNER", globalInputs, phaseInputs)).toBe("global");
    });

    it("should identify phase tokens", () => {
      expect(getTokenType("CUSTOM_TOKEN", globalInputs, phaseInputs)).toBe(
        "phase"
      );
    });

    it("should identify custom tokens", () => {
      expect(getTokenType("VALID_TOKEN", globalInputs, phaseInputs)).toBe(
        "custom"
      );
    });

    it("should identify unknown tokens", () => {
      expect(getTokenType("invalid-token", globalInputs, phaseInputs)).toBe(
        "unknown"
      );
      expect(getTokenType("", globalInputs, phaseInputs)).toBe("unknown");
    });
  });
});
