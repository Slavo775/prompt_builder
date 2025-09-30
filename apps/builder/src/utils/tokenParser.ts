import type {
  TokenParseResult,
  TokenAnalysis,
  TokenParseError,
} from "../config/types";

/**
 * Parse template for token patterns and extract token information
 */
export function parseTokens(template: string): TokenParseResult {
  const tokenRegex = /\[([A-Za-z_]+)\]/g;
  const tokens: string[] = [];
  const positions: Array<{start: number; end: number; token: string}> = [];
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(template)) !== null) {
    const token = match[1];
    if (token) {
      tokens.push(token);
    }
    positions.push({
      start: match.index,
      end: match.index + match[0].length,
      token: match[0],
    });
  }

  // Check for unclosed tokens (opening [ without closing ])
  const unclosedRegex = /\[[A-Z_]*$/;
  const hasUnclosedTokens = unclosedRegex.test(template);

  // Check for invalid tokens (non-uppercase or non-underscore characters)
  const invalidRegex = /\[[^A-Z_0-9\]]+\]/;
  const hasInvalidTokens = invalidRegex.test(template);

  return {
    tokens: [...new Set(tokens)], // Remove duplicates
    positions,
    hasUnclosedTokens,
    hasInvalidTokens,
  };
}

/**
 * Analyze tokens in context of available inputs
 */
export function analyzeTokens(
  template: string,
  globalInputs: Record<string, string>,
  phaseInputs: Record<string, string>
): TokenAnalysis {
  const parseResult = parseTokens(template);
  const allTokens = parseResult.tokens;

  const globalTokens = Object.keys(globalInputs);
  const phaseTokens = Object.keys(phaseInputs);
  const availableTokens = [...globalTokens, ...phaseTokens];

  const requiredTokens = allTokens.filter((token: string) => {
    const globalValue = globalInputs[token];
    const phaseValue = phaseInputs[token];
    return !globalValue && !phaseValue;
  });

  const missingTokens = requiredTokens.filter((token: string) => {
    const globalValue = globalInputs[token];
    const phaseValue = phaseInputs[token];
    return (
      (!globalValue || globalValue.trim() === "") &&
      (!phaseValue || phaseValue.trim() === "")
    );
  });

  const unusedTokens = availableTokens.filter(
    (token: string) => !allTokens.includes(token)
  );

  return {
    tokens: allTokens,
    requiredTokens,
    availableTokens,
    missingTokens,
    unusedTokens,
  };
}

/**
 * Validate token format
 */
export function validateTokenFormat(token: string): boolean {
  const validTokenRegex = /^[A-Z_][A-Z0-9_]*$/;
  return validTokenRegex.test(token);
}

/**
 * Create token parse error
 */
export function createTokenParseError(
  message: string,
  template: string,
  position?: number,
  token?: string
): TokenParseError {
  const error = new Error(message) as TokenParseError;
  error.template = template;
  error.position = position;
  error.token = token;
  return error;
}

/**
 * Get token type based on available inputs
 */
export function getTokenType(
  token: string,
  globalInputs: Record<string, string>,
  phaseInputs: Record<string, string>
): "global" | "phase" | "custom" | "unknown" {
  if (Object.prototype.hasOwnProperty.call(globalInputs, token)) {
    return "global";
  }
  if (Object.prototype.hasOwnProperty.call(phaseInputs, token)) {
    return "phase";
  }
  if (validateTokenFormat(token)) {
    return "custom";
  }
  return "unknown";
}
