import {describe, it, expect} from "vitest";
import {
  generatePackageManagerCommand,
  generatePackageManagerCommands,
  isValidPackageManager,
  isValidPackageManagerConfig,
  PACKAGE_MANAGER_PATTERNS,
} from "../packageManagerCommands";
import type {PackageManager, CommandType} from "../../types";

describe("packageManagerCommands", () => {
  describe("generatePackageManagerCommand", () => {
    it("should generate npm commands for single package", () => {
      const config = {
        packageManager: "npm" as PackageManager,
        isMonorepo: false,
      };

      expect(generatePackageManagerCommand("lint", config)).toBe(
        "npm run lint"
      );
      expect(generatePackageManagerCommand("typecheck", config)).toBe(
        "npm run typecheck"
      );
      expect(generatePackageManagerCommand("test", config)).toBe(
        "npm run test"
      );
      expect(generatePackageManagerCommand("build", config)).toBe(
        "npm run build"
      );
    });

    it("should generate npm commands for monorepo", () => {
      const config = {
        packageManager: "npm" as PackageManager,
        isMonorepo: true,
      };

      expect(generatePackageManagerCommand("lint", config)).toBe(
        "npm run lint --workspaces"
      );
      expect(generatePackageManagerCommand("typecheck", config)).toBe(
        "npm run typecheck --workspaces"
      );
      expect(generatePackageManagerCommand("test", config)).toBe(
        "npm run test --workspaces"
      );
      expect(generatePackageManagerCommand("build", config)).toBe(
        "npm run build --workspaces"
      );
    });

    it("should generate pnpm commands for single package", () => {
      const config = {
        packageManager: "pnpm" as PackageManager,
        isMonorepo: false,
      };

      expect(generatePackageManagerCommand("lint", config)).toBe("pnpm lint");
      expect(generatePackageManagerCommand("typecheck", config)).toBe(
        "pnpm typecheck"
      );
      expect(generatePackageManagerCommand("test", config)).toBe("pnpm test");
      expect(generatePackageManagerCommand("build", config)).toBe("pnpm build");
    });

    it("should generate pnpm commands for monorepo", () => {
      const config = {
        packageManager: "pnpm" as PackageManager,
        isMonorepo: true,
      };

      expect(generatePackageManagerCommand("lint", config)).toBe(
        "pnpm -w lint"
      );
      expect(generatePackageManagerCommand("typecheck", config)).toBe(
        "pnpm -w typecheck"
      );
      expect(generatePackageManagerCommand("test", config)).toBe(
        "pnpm -w test"
      );
      expect(generatePackageManagerCommand("build", config)).toBe(
        "pnpm -w build"
      );
    });

    it("should generate yarn commands for single package", () => {
      const config = {
        packageManager: "yarn" as PackageManager,
        isMonorepo: false,
      };

      expect(generatePackageManagerCommand("lint", config)).toBe("yarn lint");
      expect(generatePackageManagerCommand("typecheck", config)).toBe(
        "yarn typecheck"
      );
      expect(generatePackageManagerCommand("test", config)).toBe("yarn test");
      expect(generatePackageManagerCommand("build", config)).toBe("yarn build");
    });

    it("should generate yarn commands for monorepo", () => {
      const config = {
        packageManager: "yarn" as PackageManager,
        isMonorepo: true,
      };

      expect(generatePackageManagerCommand("lint", config)).toBe(
        "yarn workspaces run lint"
      );
      expect(generatePackageManagerCommand("typecheck", config)).toBe(
        "yarn workspaces run typecheck"
      );
      expect(generatePackageManagerCommand("test", config)).toBe(
        "yarn workspaces run test"
      );
      expect(generatePackageManagerCommand("build", config)).toBe(
        "yarn workspaces run build"
      );
    });
  });

  describe("generatePackageManagerCommands", () => {
    it("should generate all commands for npm single package", () => {
      const config = {
        packageManager: "npm" as PackageManager,
        isMonorepo: false,
      };
      const commands = generatePackageManagerCommands(config);

      expect(commands).toEqual({
        lint: "npm run lint",
        typecheck: "npm run typecheck",
        test: "npm run test",
        build: "npm run build",
      });
    });

    it("should generate all commands for pnpm monorepo", () => {
      const config = {
        packageManager: "pnpm" as PackageManager,
        isMonorepo: true,
      };
      const commands = generatePackageManagerCommands(config);

      expect(commands).toEqual({
        lint: "pnpm -w lint",
        typecheck: "pnpm -w typecheck",
        test: "pnpm -w test",
        build: "pnpm -w build",
      });
    });

    it("should generate all commands for yarn monorepo", () => {
      const config = {
        packageManager: "yarn" as PackageManager,
        isMonorepo: true,
      };
      const commands = generatePackageManagerCommands(config);

      expect(commands).toEqual({
        lint: "yarn workspaces run lint",
        typecheck: "yarn workspaces run typecheck",
        test: "yarn workspaces run test",
        build: "yarn workspaces run build",
      });
    });
  });

  describe("isValidPackageManager", () => {
    it("should return true for valid package managers", () => {
      expect(isValidPackageManager("npm")).toBe(true);
      expect(isValidPackageManager("pnpm")).toBe(true);
      expect(isValidPackageManager("yarn")).toBe(true);
    });

    it("should return false for invalid package managers", () => {
      expect(isValidPackageManager("bun")).toBe(false);
      expect(isValidPackageManager("deno")).toBe(false);
      expect(isValidPackageManager("")).toBe(false);
      expect(isValidPackageManager("invalid")).toBe(false);
    });
  });

  describe("isValidPackageManagerConfig", () => {
    it("should return true for valid configurations", () => {
      expect(
        isValidPackageManagerConfig({
          packageManager: "npm",
          isMonorepo: true,
        })
      ).toBe(true);

      expect(
        isValidPackageManagerConfig({
          packageManager: "pnpm",
          isMonorepo: false,
        })
      ).toBe(true);

      expect(
        isValidPackageManagerConfig({
          packageManager: "yarn",
          isMonorepo: true,
        })
      ).toBe(true);
    });

    it("should return false for invalid configurations", () => {
      expect(isValidPackageManagerConfig(null)).toBe(false);
      expect(isValidPackageManagerConfig(undefined)).toBe(false);
      expect(isValidPackageManagerConfig("string")).toBe(false);
      expect(isValidPackageManagerConfig({})).toBe(false);

      expect(
        isValidPackageManagerConfig({
          packageManager: "invalid",
          isMonorepo: true,
        })
      ).toBe(false);

      expect(
        isValidPackageManagerConfig({
          packageManager: "npm",
          isMonorepo: "true", // Should be boolean
        })
      ).toBe(false);

      expect(
        isValidPackageManagerConfig({
          packageManager: "npm",
          // Missing isMonorepo
        })
      ).toBe(false);
    });
  });

  describe("PACKAGE_MANAGER_PATTERNS", () => {
    it("should have patterns for all package managers", () => {
      const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn"];
      const commands: CommandType[] = ["lint", "typecheck", "test", "build"];
      const modes = ["single", "monorepo"] as const;

      packageManagers.forEach((pm) => {
        expect(PACKAGE_MANAGER_PATTERNS[pm]).toBeDefined();

        modes.forEach((mode) => {
          expect(PACKAGE_MANAGER_PATTERNS[pm][mode]).toBeDefined();

          commands.forEach((cmd) => {
            expect(PACKAGE_MANAGER_PATTERNS[pm][mode][cmd]).toBeDefined();
            expect(typeof PACKAGE_MANAGER_PATTERNS[pm][mode][cmd]).toBe(
              "string"
            );
            expect(
              PACKAGE_MANAGER_PATTERNS[pm][mode][cmd].length
            ).toBeGreaterThan(0);
          });
        });
      });
    });

    it("should have different patterns for single vs monorepo", () => {
      const packageManagers: PackageManager[] = ["npm", "pnpm", "yarn"];
      const commands: CommandType[] = ["lint", "typecheck", "test", "build"];

      packageManagers.forEach((pm) => {
        commands.forEach((cmd) => {
          const singleCmd = PACKAGE_MANAGER_PATTERNS[pm].single[cmd];
          const monorepoCmd = PACKAGE_MANAGER_PATTERNS[pm].monorepo[cmd];

          expect(singleCmd).not.toBe(monorepoCmd);
        });
      });
    });
  });
});
