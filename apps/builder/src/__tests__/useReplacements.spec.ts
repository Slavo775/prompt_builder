import {describe, it, expect} from "vitest";
import {useReplacements} from "../composables/useReplacements";
import type {GlobalInputs} from "../../types";

describe("useReplacements", () => {
  const mockGlobalInputs: GlobalInputs = {
    projectName: "Test Project",
    featureName: "Test Feature",
    featureSlug: "test-feature",
    owner: "Test Owner",
    repoUrl: "https://github.com/test/repo",
    stack: "Vue 3, TypeScript",
    dateIso: "2024-01-01",
  };

  const mockPhaseInputs = {
    CUSTOM_TOKEN: "Custom Value",
    ANOTHER_TOKEN: "Another Value",
  };

  it("should replace global tokens correctly", () => {
    const {replaceTokens} = useReplacements(mockGlobalInputs, {});
    const template = "Project: [PROJECT_NAME], Feature: [FEATURE_NAME]";
    const result = replaceTokens(template);

    expect(result).toBe("Project: Test Project, Feature: Test Feature");
  });

  it("should replace phase-specific tokens correctly", () => {
    const {replaceTokens} = useReplacements(mockGlobalInputs, mockPhaseInputs);
    const template = "Custom: [CUSTOM_TOKEN], Another: [ANOTHER_TOKEN]";
    const result = replaceTokens(template);

    expect(result).toBe("Custom: Custom Value, Another: Another Value");
  });

  it("should replace mixed tokens correctly", () => {
    const {replaceTokens} = useReplacements(mockGlobalInputs, mockPhaseInputs);
    const template =
      "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN], Stack: [STACK]";
    const result = replaceTokens(template);

    expect(result).toBe(
      "Project: Test Project, Custom: Custom Value, Stack: Vue 3, TypeScript"
    );
  });

  it("should leave unknown tokens unchanged", () => {
    const {replaceTokens} = useReplacements(mockGlobalInputs, {});
    const template = "Unknown: [UNKNOWN_TOKEN], Known: [PROJECT_NAME]";
    const result = replaceTokens(template);

    expect(result).toBe("Unknown: [UNKNOWN_TOKEN], Known: Test Project");
  });

  it("should return available tokens", () => {
    const {getAvailableTokens} = useReplacements(
      mockGlobalInputs,
      mockPhaseInputs
    );
    const tokens = getAvailableTokens();

    expect(tokens).toContain("PROJECT_NAME");
    expect(tokens).toContain("FEATURE_NAME");
    expect(tokens).toContain("CUSTOM_TOKEN");
    expect(tokens).toContain("ANOTHER_TOKEN");
  });

  it("should validate tokens correctly", () => {
    const {validateTokens} = useReplacements(mockGlobalInputs, mockPhaseInputs);

    const validTemplate = "Project: [PROJECT_NAME], Custom: [CUSTOM_TOKEN]";
    const validResult = validateTokens(validTemplate);
    expect(validResult.valid).toBe(true);
    expect(validResult.missingTokens).toHaveLength(0);

    const invalidTemplate = "Project: [PROJECT_NAME], Unknown: [UNKNOWN_TOKEN]";
    const invalidResult = validateTokens(invalidTemplate);
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.missingTokens).toContain("UNKNOWN_TOKEN");
  });
});
