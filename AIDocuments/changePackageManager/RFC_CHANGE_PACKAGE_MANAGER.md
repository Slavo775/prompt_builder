# RFC: Package Manager Selection & Command Adaptation

## Scope & Files (Allowlist)

### Files to be Modified (App Code, Tests, Docs ONLY)

**Core Type Definitions:**

- `apps/builder/src/types/index.ts` - Extend GlobalInputs interface
- `apps/builder/src/config/types.ts` - Add package manager validation types

**Component Updates:**

- `apps/builder/src/components/GlobalInputs.vue` - Add package manager select and monorepo checkbox
- `apps/builder/src/components/__tests__/GlobalInputs.spec.ts` - Update tests for new fields

**Composable Extensions:**

- `apps/builder/src/composables/useReplacements.ts` - Add package manager command tokens
- `apps/builder/src/composables/useLocalStorage.ts` - Add migration for new GlobalInputs fields
- `apps/builder/src/composables/__tests__/useReplacements.spec.ts` - Test package manager token replacement

**New Files to Create:**

- `apps/builder/src/utils/packageManagerCommands.ts` - Command generation logic
- `apps/builder/src/utils/__tests__/packageManagerCommands.spec.ts` - Test command generation
- `apps/builder/src/components/PackageManagerSelect.vue` - Reusable select component
- `apps/builder/src/components/__tests__/PackageManagerSelect.spec.ts` - Component tests

**Phase Template Updates:**

- `apps/builder/src/config/phases/phase-2.5.ts` - Replace hardcoded pnpm commands with tokens
- `apps/builder/src/config/phases/phase-4.ts` - Replace hardcoded pnpm commands with tokens
- `apps/builder/src/config/phases/phase-5.ts` - Replace hardcoded pnpm commands with tokens
- `apps/builder/src/config/phases/phase-6.ts` - Replace hardcoded pnpm commands with tokens

**Validation Updates:**

- `apps/builder/src/utils/validation.ts` - Add package manager validation logic
- `apps/builder/src/utils/__tests__/validation.spec.ts` - Test new validation rules

**Integration Tests:**

- `apps/builder/src/__tests__/tokenParser.spec.ts` - Test package manager token parsing
- `apps/builder/src/__tests__/useValidation.spec.ts` - Test validation with new fields

## Zero-Infra-Change Plan

### Current Infrastructure Usage

**TypeScript Configuration:**

- Use existing strict TypeScript setup without modifications
- Leverage current union type patterns for PackageManager type
- Utilize existing interface extension patterns for GlobalInputs

**Vue.js & Composition API:**

- Build on existing composable patterns (useReplacements, useValidation)
- Use current reactive system for real-time template updates
- Follow established component prop typing conventions

**Testing Framework:**

- Extend existing Vitest + @testing-library/vue test patterns
- Use current accessibility testing approach with jest-axe
- Follow established component testing structure

**Styling & UI:**

- Reuse existing CSS class patterns from GlobalInputs component
- Maintain current SCSS structure and BEM methodology
- Use established form control styling patterns

**State Management:**

- Extend current localStorage persistence pattern
- Use existing migration strategy for GlobalInputs updates
- Follow current reactive state update patterns

### Adapter/Shim Strategies

**Token Replacement Integration:**

```typescript
// Extend existing useReplacements composable
const replacementMap = computed<ReplacementMap>(() => ({
  PROJECT_NAME: globalInputs.projectName,
  FEATURE_NAME: globalInputs.featureName,
  FEATURE_SLUG: globalInputs.featureSlug,
  REQUIREMENTS: globalInputs.requirements,
  // NEW: Package manager command tokens
  PKG_LINT: generatePackageManagerCommand("lint", globalInputs),
  PKG_TYPECHECK: generatePackageManagerCommand("typecheck", globalInputs),
  PKG_TEST: generatePackageManagerCommand("test", globalInputs),
  PKG_BUILD: generatePackageManagerCommand("build", globalInputs),
  ...phaseInputs,
}));
```

**Validation Integration:**

```typescript
// Extend existing validation system
export function validateGlobalInputs(
  globalInputs: GlobalInputs,
  template: string,
  phaseInputs: Record<string, string> = {}
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Existing validation logic...

  // NEW: Package manager validation
  if (!isValidPackageManager(globalInputs.packageManager)) {
    errors.push(
      createValidationError(
        "packageManager",
        "PACKAGE_MANAGER",
        "Invalid package manager selection"
      )
    );
  }

  return errors;
}
```

**LocalStorage Migration:**

```typescript
// Extend existing migration pattern
function migrateGlobalInputs(legacy: LegacyGlobalInputs): GlobalInputs {
  return {
    projectName: legacy.projectName || "",
    featureName: legacy.featureName || "",
    featureSlug: legacy.featureSlug || "",
    requirements: legacy.requirements || "",
    // NEW: Default values for backward compatibility
    packageManager: "pnpm", // Maintain current behavior
    isMonorepo: true, // Maintain current -w flag behavior
  };
}
```

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### 1. Enhanced Type Checking for Package Manager Commands

**Rationale:** Ensure compile-time safety for package manager command generation

**Minimal Diff (NOT to be applied):**

```typescript
// tsconfig.json - PROPOSAL ONLY
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": true, // Stricter optional property handling
    "noUncheckedIndexedAccess": true    // Safer array/object access
  }
}
```

**Risk/Benefit:**

- **Risk:** May require updates to existing code that relies on loose optional property handling
- **Benefit:** Prevents runtime errors from undefined package manager configurations
- **Decision:** Defer to future RFC - current strict mode is sufficient

### 2. ESLint Rule for Package Manager Command Validation

**Rationale:** Prevent hardcoded package manager commands in templates

**Minimal Diff (NOT to be applied):**

```javascript
// eslint.config.js - PROPOSAL ONLY
{
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/pnpm -w|npm run|yarn /]",
        "message": "Use package manager tokens instead of hardcoded commands"
      }
    ]
  }
}
```

**Risk/Benefit:**

- **Risk:** May flag legitimate usage in documentation or comments
- **Benefit:** Prevents regression to hardcoded commands
- **Decision:** Manual code review is sufficient for this feature scope

## Type Guarantees

### Strict TypeScript Compliance

**No `any`, `unknown`, `non-null !`, or `as any`:**

```typescript
// ✅ CORRECT: Exhaustive union type
export type PackageManager = "npm" | "pnpm" | "yarn";

// ✅ CORRECT: Type guard with proper narrowing
export function isValidPackageManager(value: string): value is PackageManager {
  return ["npm", "pnpm", "yarn"].includes(value);
}

// ✅ CORRECT: Precise interface extension
export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  requirements: string;
  packageManager: PackageManager; // Required, no optional
  isMonorepo: boolean; // Required, no optional
}

// ✅ CORRECT: Exhaustive command mapping
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
  // ... exhaustive for pnpm, yarn
} as const;
```

**Exhaustive Unions & Precise Exported Types:**

```typescript
// ✅ CORRECT: Discriminated union for command configuration
export interface PackageManagerConfig {
  readonly packageManager: PackageManager;
  readonly isMonorepo: boolean;
}

// ✅ CORRECT: Exhaustive command type
export type CommandType = "lint" | "typecheck" | "test" | "build";

// ✅ CORRECT: Precise component props
export interface PackageManagerSelectProps {
  readonly modelValue: PackageManager;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly errorMessage?: string;
  readonly helpText?: string;
  readonly "aria-describedby"?: string;
}

// ✅ CORRECT: Validation error with discriminated type
export interface PackageManagerValidationError {
  readonly field: "packageManager" | "isMonorepo";
  readonly message: string;
  readonly type: "required" | "invalid_value" | "configuration_mismatch";
}

// ✅ CORRECT: Command generation service interface
export interface PackageManagerService {
  generateCommands(config: PackageManagerConfig): PackageManagerCommands;
  getCommandToken(command: CommandType, config: PackageManagerConfig): string;
  validateConfig(config: PackageManagerConfig): PackageManagerValidationError[];
}
```

**Type-Safe Token Replacement:**

```typescript
// ✅ CORRECT: Extended replacement map with package manager tokens
export interface ReplacementMap {
  readonly [key: string]: string;
  readonly PROJECT_NAME: string;
  readonly FEATURE_NAME: string;
  readonly FEATURE_SLUG: string;
  readonly REQUIREMENTS: string;
  readonly PKG_LINT: string;
  readonly PKG_TYPECHECK: string;
  readonly PKG_TEST: string;
  readonly PKG_BUILD: string;
}

// ✅ CORRECT: Type-safe command generation
export function generatePackageManagerCommand(
  command: CommandType,
  config: PackageManagerConfig
): string {
  const patterns = PACKAGE_MANAGER_PATTERNS[config.packageManager];
  const modePatterns = config.isMonorepo ? patterns.monorepo : patterns.single;
  return modePatterns[command];
}
```

## Validation Plan (Human-Runnable)

### Pre-Implementation Validation

```bash
# Verify current state is clean
[PKG_LINT]
[PKG_TYPECHECK]
[PKG_TEST]
[PKG_BUILD]
```

### Post-Implementation Validation

```bash
# 1. Type checking passes with new interfaces
[PKG_TYPECHECK]

# 2. Linting passes with new code patterns
[PKG_LINT]

# 3. All existing tests pass + new tests
[PKG_TEST]

# 4. Build succeeds with new components
[PKG_BUILD]
```

### Manual Testing Checklist

**Package Manager Selection:**

- [ ] Dropdown shows npm, pnpm, yarn options
- [ ] Selection persists across browser refresh
- [ ] Default selection is pnpm (backward compatibility)
- [ ] Invalid selection shows validation error

**Monorepo Configuration:**

- [ ] Checkbox toggles workspace flag behavior
- [ ] Default state is checked (backward compatibility)
- [ ] State persists across browser refresh
- [ ] Help text explains monorepo vs single-package

**Command Generation:**

- [ ] npm + single-package: `npm run lint`
- [ ] npm + monorepo: `npm run lint --workspaces`
- [ ] pnpm + single-package: `pnpm lint`
- [ ] pnpm + monorepo: `pnpm -w lint`
- [ ] yarn + single-package: `yarn lint`
- [ ] yarn + monorepo: `yarn workspaces run lint`

**Template Integration:**

- [ ] Phase 2.5 shows correct commands in preview
- [ ] Phase 4 shows correct commands in preview
- [ ] Phase 5 shows correct commands in preview
- [ ] Phase 6 shows correct commands in preview
- [ ] Export/import preserves package manager settings

**Accessibility:**

- [ ] Package manager select has proper label and description
- [ ] Monorepo checkbox has proper label and help text
- [ ] Error states are announced to screen readers
- [ ] Keyboard navigation works for all new controls
- [ ] `jest-axe` passes for GlobalInputs component

### Performance Validation

- [ ] Template rendering performance unchanged (<100ms for complex templates)
- [ ] LocalStorage operations complete quickly (<10ms)
- [ ] Component re-renders are minimal (only on relevant state changes)
- [ ] Memory usage remains stable (no leaks in token replacement)

### Error Handling Validation

- [ ] Invalid package manager gracefully falls back to pnpm
- [ ] Missing localStorage data uses proper defaults
- [ ] Malformed JSON in localStorage doesn't crash app
- [ ] Network interruption during export/import handled gracefully

---

**RFC Status:** Draft v1.0  
**Author:** Senior Frontend Developer  
**Reviewers:** Product Manager, Engineering Team  
**Implementation Target:** Next Sprint  
**Dependencies:** PRD_CHANGE_PACKAGE_MANAGER.md
