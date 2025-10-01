import {computed} from "vue";
import type {GlobalInputs, ReplacementMap} from "../types";
import type {
  TokenReplacementResult,
  TokenReplacementService,
  TokenType,
} from "../config/types";

export function useReplacements(
  globalInputs: GlobalInputs,
  phaseInputs: Record<string, string>
) {
  const replacementMap = computed<ReplacementMap>(() => ({
    PROJECT_NAME: globalInputs.projectName,
    FEATURE_NAME: globalInputs.featureName,
    FEATURE_SLUG: globalInputs.featureSlug,
    REQUIREMENTS: globalInputs.requirements,
    ...phaseInputs,
  }));

  const replaceTokens = (template: string): string => {
    return template.replace(/\[([A-Z_]+)\]/g, (match, token) => {
      return replacementMap.value[token] || match;
    });
  };

  const getAvailableTokens = (): string[] => {
    return Object.keys(replacementMap.value);
  };

  const validateTokens = (
    template: string
  ): {valid: boolean; missingTokens: string[]} => {
    const tokenMatches = template.match(/\[([A-Z_]+)\]/g) || [];
    const usedTokens = tokenMatches.map((match) => match.slice(1, -1));
    const availableTokens = getAvailableTokens();

    const missingTokens = usedTokens.filter(
      (token) => !availableTokens.includes(token)
    );

    return {
      valid: missingTokens.length === 0,
      missingTokens,
    };
  };

  const replaceTokensWithResult = (
    template: string
  ): TokenReplacementResult => {
    const tokenRegex = /\[([A-Z_]+)\]/g;
    const replacedTokens: string[] = [];
    const unreplacedTokens: string[] = [];
    let match: RegExpExecArray | null;

    let renderedTemplate = template;
    while ((match = tokenRegex.exec(template)) !== null) {
      const token = match[1];
      if (token) {
        const value = replacementMap.value[token];

        if (value) {
          replacedTokens.push(token);
          renderedTemplate = renderedTemplate.replace(match[0], value);
        } else {
          unreplacedTokens.push(token);
        }
      }
    }

    return {
      originalTemplate: template,
      renderedTemplate,
      replacedTokens,
      unreplacedTokens,
      isValid: unreplacedTokens.length === 0,
      errors: [],
    };
  };

  const getTokenType = (token: string): TokenType => {
    const globalTokens = [
      "PROJECT_NAME",
      "FEATURE_NAME",
      "FEATURE_SLUG",
      "OWNER",
      "REPO_URL",
      "STACK",
      "DATE_ISO",
      "REQUIREMENTS",
    ];

    if (globalTokens.includes(token)) {
      return "global";
    }

    if (Object.prototype.hasOwnProperty.call(phaseInputs, token)) {
      return "phase";
    }

    const validTokenRegex = /^[A-Z_][A-Z0-9_]*$/;
    if (validTokenRegex.test(token)) {
      return "custom";
    }

    return "unknown";
  };

  const tokenReplacementService: TokenReplacementService = {
    replaceTokens: replaceTokensWithResult,
    validateTokens: (template: string) => {
      const result = validateTokens(template);
      return result.missingTokens.map((token) => ({
        field: `token-${token.toLowerCase()}`,
        token,
        message: `Missing required input: ${token}`,
        type: "required" as const,
      }));
    },
    getAvailableTokens,
    getTokenType,
  };

  return {
    replacementMap,
    replaceTokens,
    getAvailableTokens,
    validateTokens,
    replaceTokensWithResult,
    getTokenType,
    tokenReplacementService,
  };
}
