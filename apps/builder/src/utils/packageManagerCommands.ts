import type {PackageManager} from "../types";

// Command types
export type CommandType = "lint" | "typecheck" | "test" | "build";

// Package manager configuration
export interface PackageManagerConfig {
  readonly packageManager: PackageManager;
  readonly isMonorepo: boolean;
}

// Generated command set
export interface PackageManagerCommands {
  readonly lint: string;
  readonly typecheck: string;
  readonly test: string;
  readonly build: string;
}

// Package manager command patterns
export const PACKAGE_MANAGER_PATTERNS: Record<
  PackageManager,
  Record<"single" | "monorepo", Record<CommandType, string>>
> = {
  npm: {
    single: {
      lint: "npm run lint",
      typecheck: "npm run typecheck",
      test: "npm run test",
      build: "npm run build",
    },
    monorepo: {
      lint: "npm run lint --workspaces",
      typecheck: "npm run typecheck --workspaces",
      test: "npm run test --workspaces",
      build: "npm run build --workspaces",
    },
  },
  pnpm: {
    single: {
      lint: "pnpm lint",
      typecheck: "pnpm typecheck",
      test: "pnpm test",
      build: "pnpm build",
    },
    monorepo: {
      lint: "pnpm -w lint",
      typecheck: "pnpm -w typecheck",
      test: "pnpm -w test",
      build: "pnpm -w build",
    },
  },
  yarn: {
    single: {
      lint: "yarn lint",
      typecheck: "yarn typecheck",
      test: "yarn test",
      build: "yarn build",
    },
    monorepo: {
      lint: "yarn workspaces run lint",
      typecheck: "yarn workspaces run typecheck",
      test: "yarn workspaces run test",
      build: "yarn workspaces run build",
    },
  },
} as const;

/**
 * Generate package manager commands based on configuration
 */
export function generatePackageManagerCommands(
  config: PackageManagerConfig
): PackageManagerCommands {
  const patterns = PACKAGE_MANAGER_PATTERNS[config.packageManager];
  const modePatterns = config.isMonorepo ? patterns.monorepo : patterns.single;

  return {
    lint: modePatterns.lint,
    typecheck: modePatterns.typecheck,
    test: modePatterns.test,
    build: modePatterns.build,
  };
}

/**
 * Generate a specific package manager command
 */
export function generatePackageManagerCommand(
  command: CommandType,
  config: PackageManagerConfig
): string {
  const patterns = PACKAGE_MANAGER_PATTERNS[config.packageManager];
  const modePatterns = config.isMonorepo ? patterns.monorepo : patterns.single;
  return modePatterns[command];
}

/**
 * Type guard for valid package manager
 */
export function isValidPackageManager(value: string): value is PackageManager {
  return ["npm", "pnpm", "yarn"].includes(value);
}

/**
 * Type guard for valid package manager configuration
 */
export function isValidPackageManagerConfig(
  config: unknown
): config is PackageManagerConfig {
  return (
    typeof config === "object" &&
    config !== null &&
    "packageManager" in config &&
    "isMonorepo" in config &&
    isValidPackageManager((config as PackageManagerConfig).packageManager) &&
    typeof (config as PackageManagerConfig).isMonorepo === "boolean"
  );
}
