import {computed} from "vue";
import type {GlobalInputs, ReplacementMap} from "../types";

export function useReplacements(
  globalInputs: GlobalInputs,
  phaseInputs: Record<string, string>
) {
  const replacementMap = computed<ReplacementMap>(() => ({
    PROJECT_NAME: globalInputs.projectName,
    FEATURE_NAME: globalInputs.featureName,
    FEATURE_SLUG: globalInputs.featureSlug,
    OWNER: globalInputs.owner,
    REPO_URL: globalInputs.repoUrl || "",
    STACK: globalInputs.stack,
    DATE_ISO: globalInputs.dateIso,
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

  return {
    replacementMap,
    replaceTokens,
    getAvailableTokens,
    validateTokens,
  };
}
