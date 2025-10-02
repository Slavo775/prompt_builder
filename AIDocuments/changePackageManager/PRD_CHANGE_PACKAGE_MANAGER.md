# PRD: Package Manager Selection & Command Adaptation

## Background & Problem Statement

The prompt builder currently hardcodes `pnpm` commands throughout all phase templates, limiting its utility for projects using different package managers (npm, yarn) or different workspace configurations. Users working with npm-based or yarn-based projects must manually edit generated prompts to replace package manager commands, creating friction and potential errors.

### Current State

- All phase templates contain hardcoded `pnpm -w` commands (lint, typecheck, test, build)
- No consideration for monorepo vs single-package projects
- Users must manually replace commands in generated outputs
- Inconsistent command patterns across different project types

### Problem Impact

- **Developer Experience**: Manual command replacement is error-prone and time-consuming
- **Adoption Barrier**: Teams using npm/yarn may avoid the tool due to pnpm-specific outputs
- **Maintenance Overhead**: Users must remember to update commands in every generated prompt
- **Workflow Disruption**: Copy-paste workflows break when commands don't match project setup

## Goals and Non-Goals

### Goals

1. **Package Manager Selection**: Allow users to choose between npm, pnpm, and yarn
2. **Workspace Detection**: Support both monorepo and single-package project configurations
3. **Dynamic Command Generation**: Automatically adapt all package manager commands in templates
4. **Persistent Configuration**: Remember user's package manager preference across sessions
5. **Backward Compatibility**: Maintain existing functionality for current users

### Non-Goals

- Support for alternative package managers (bun, deno, etc.) in initial release
- Automatic detection of package manager from project files
- Custom command configuration beyond standard package manager patterns
- Integration with package.json script detection

## User Stories & Acceptance Criteria

### US-1: Package Manager Selection

**As a** developer using npm/yarn projects  
**I want to** select my preferred package manager in global inputs  
**So that** generated prompts contain the correct commands for my project setup

**Acceptance Criteria:**

- Global inputs include a package manager dropdown (npm, pnpm, yarn)
- Selection persists in localStorage across sessions
- Default selection is pnpm (current behavior)
- Selection is immediately reflected in all template previews

### US-2: Workspace Configuration

**As a** developer working on both monorepo and single-package projects  
**I want to** specify whether my project is a monorepo  
**So that** commands include appropriate workspace flags when needed

**Acceptance Criteria:**

- Global inputs include a "Monorepo" checkbox
- Checkbox state persists in localStorage
- Default state is checked (current `-w` behavior)
- Workspace flag inclusion updates dynamically in previews

### US-3: Dynamic Command Adaptation

**As a** user generating prompts  
**I want** package manager commands to automatically match my selections  
**So that** I can copy-paste commands without manual editing

**Acceptance Criteria:**

- All hardcoded `pnpm -w` commands become dynamic tokens
- Commands adapt based on package manager + workspace selections
- Changes are reflected in real-time across all phase templates
- Exported JSON includes correct commands for selected configuration

### US-4: Command Pattern Consistency

**As a** developer using the generated prompts  
**I want** consistent command patterns across all phases  
**So that** I can reliably execute validation steps

**Acceptance Criteria:**

- npm: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`
- npm (monorepo): `npm run lint --workspaces`, etc.
- pnpm: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
- pnpm (monorepo): `pnpm -w lint`, etc.
- yarn: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn build`
- yarn (monorepo): `yarn workspaces run lint`, etc.

## Functional Requirements

### FR-1: Global Input Extensions

The system SHALL extend GlobalInputs interface to include:

- `packageManager`: Required selection from "npm" | "pnpm" | "yarn"
- `isMonorepo`: Boolean flag for workspace configuration

### FR-2: Token Replacement System

The system SHALL implement dynamic token replacement for:

- `[PKG_LINT]`: Package manager lint command
- `[PKG_TYPECHECK]`: Package manager typecheck command
- `[PKG_TEST]`: Package manager test command
- `[PKG_BUILD]`: Package manager build command

### FR-3: Command Generation Logic

The system SHALL generate commands according to these patterns:

| Package Manager | Monorepo | Lint Command                | Test Command                |
| --------------- | -------- | --------------------------- | --------------------------- |
| npm             | false    | `npm run lint`              | `npm run test`              |
| npm             | true     | `npm run lint --workspaces` | `npm run test --workspaces` |
| pnpm            | false    | `pnpm lint`                 | `pnpm test`                 |
| pnpm            | true     | `pnpm -w lint`              | `pnpm -w test`              |
| yarn            | false    | `yarn lint`                 | `yarn test`                 |
| yarn            | true     | `yarn workspaces run lint`  | `yarn workspaces run test`  |

### FR-4: Template Migration

The system SHALL update all phase templates to replace hardcoded commands:

- Phase 2.5: Replace `pnpm -w lint|typecheck|test|build` with tokens
- Phase 4: Replace `pnpm -w lint|typecheck|test|build` with tokens
- Phase 5: Replace `pnpm -w lint|typecheck|test|build` with tokens
- Phase 6: Replace `pnpm -w lint|typecheck|test|build` with tokens

### FR-5: UI Components

The system SHALL provide form controls in GlobalInputs:

- Package manager select dropdown with clear labels
- Monorepo checkbox with descriptive help text
- Real-time validation and error handling
- Accessible form controls with proper ARIA attributes

### FR-6: Data Persistence

The system SHALL persist selections in localStorage:

- Package manager preference survives browser sessions
- Monorepo flag survives browser sessions
- Export/import functionality includes new fields
- Backward compatibility with existing localStorage data

## Technical Considerations

### Performance

- **Token Replacement**: Command generation is computed, not stored, to ensure real-time updates
- **Template Rendering**: Minimal performance impact as token replacement is already optimized
- **Storage**: New fields add negligible localStorage overhead

### Accessibility (a11y)

- **Form Controls**: Select and checkbox must have proper labels and descriptions
- **Screen Readers**: Help text explains the impact of selections
- **Keyboard Navigation**: All controls accessible via keyboard
- **Error States**: Clear error messaging for invalid selections

### Internationalization (i18n)

- **Labels**: Package manager names remain in English (standard)
- **Help Text**: Descriptive text should be localizable in future
- **Error Messages**: Validation messages follow existing patterns

### State Management

- **Reactive Updates**: Changes trigger immediate template re-rendering
- **Validation**: Package manager selection is required field
- **Error Handling**: Graceful fallback to pnpm if invalid selection

### Error/Empty/Loading States

- **Default State**: pnpm + monorepo (current behavior)
- **Invalid Selection**: Fallback to pnpm with user notification
- **Empty State**: Required field validation prevents empty selection
- **Loading State**: No async operations required

## Risks & Mitigations

### Risk 1: Breaking Changes for Existing Users

**Impact**: High - Could disrupt current workflows  
**Likelihood**: Medium  
**Mitigation**:

- Default to current behavior (pnpm + monorepo)
- Gradual rollout with feature flag
- Clear migration documentation

### Risk 2: Command Pattern Inconsistencies

**Impact**: Medium - Users may get incorrect commands  
**Likelihood**: Low  
**Mitigation**:

- Comprehensive testing of all package manager combinations
- Reference documentation for command patterns
- User validation through preview functionality

### Risk 3: Template Maintenance Overhead

**Impact**: Low - More complex template management  
**Likelihood**: High  
**Mitigation**:

- Centralized command generation logic
- Automated testing for template token replacement
- Clear documentation for future template additions

### Risk 4: User Confusion About Workspace Settings

**Impact**: Medium - Incorrect workspace configuration  
**Likelihood**: Medium  
**Mitigation**:

- Clear help text explaining monorepo vs single-package
- Examples in UI showing command differences
- Validation warnings for unusual combinations

## Success Criteria & Measurement

### Launch Criteria

- [ ] All package manager combinations generate correct commands
- [ ] UI controls are accessible and intuitive
- [ ] Existing localStorage data migrates without data loss
- [ ] All existing tests pass with new functionality
- [ ] New functionality has >90% test coverage

### Success Metrics

- **Adoption**: >50% of users modify default package manager within 30 days
- **Error Reduction**: <5% of support requests related to command issues
- **User Satisfaction**: Positive feedback on package manager flexibility
- **Performance**: No measurable impact on template rendering speed

### Validation Methods

- **Unit Tests**: Command generation logic for all combinations
- **Integration Tests**: End-to-end template rendering with different selections
- **Accessibility Tests**: Form controls pass jest-axe validation
- **User Testing**: Manual validation of generated commands in real projects

## Public UI/API Types (Design)

### Core Types

```typescript
// Package manager selection
export type PackageManager = "npm" | "pnpm" | "yarn";

// Enhanced global inputs interface
export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  requirements: string;
  packageManager: PackageManager;
  isMonorepo: boolean;
}

// Package manager command configuration
export interface PackageManagerConfig {
  packageManager: PackageManager;
  isMonorepo: boolean;
}

// Generated command set
export interface PackageManagerCommands {
  lint: string;
  typecheck: string;
  test: string;
  build: string;
}

// Command generation service
export interface PackageManagerService {
  generateCommands(config: PackageManagerConfig): PackageManagerCommands;
  getCommandToken(
    command: "lint" | "typecheck" | "test" | "build",
    config: PackageManagerConfig
  ): string;
  validateConfig(config: PackageManagerConfig): ValidationError[];
}
```

### Component Props

```typescript
// Package manager select component
export interface PackageManagerSelectProps {
  modelValue: PackageManager;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  helpText?: string;
  "aria-describedby"?: string;
}

// Monorepo checkbox component
export interface MonorepoCheckboxProps {
  modelValue: boolean;
  disabled?: boolean;
  label?: string;
  helpText?: string;
  "aria-describedby"?: string;
}

// Enhanced global inputs props
export interface GlobalInputsProps {
  globalInputs: GlobalInputs;
  template?: string;
  phaseInputs?: Record<string, string>;
}
```

### Token Replacement Extensions

```typescript
// Extended replacement map with package manager tokens
export interface ReplacementMap {
  [key: string]: string;
  PROJECT_NAME: string;
  FEATURE_NAME: string;
  FEATURE_SLUG: string;
  REQUIREMENTS: string;
  PKG_LINT: string;
  PKG_TYPECHECK: string;
  PKG_TEST: string;
  PKG_BUILD: string;
}

// Package manager token generator
export interface PackageManagerTokens {
  PKG_LINT: string;
  PKG_TYPECHECK: string;
  PKG_TEST: string;
  PKG_BUILD: string;
}
```

### Validation Types

```typescript
// Package manager validation rules
export interface PackageManagerValidationRule {
  field: "packageManager" | "isMonorepo";
  required: boolean;
  allowedValues?: PackageManager[];
  message?: string;
}

// Enhanced validation state
export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  packageManagerErrors: PackageManagerValidationError[];
}

// Package manager specific validation error
export interface PackageManagerValidationError {
  field: "packageManager" | "isMonorepo";
  message: string;
  type: "required" | "invalid_value" | "configuration_mismatch";
}
```

### Utility Types

```typescript
// Package manager command patterns
export const PACKAGE_MANAGER_PATTERNS = {
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

// Type guards
export function isValidPackageManager(value: string): value is PackageManager {
  return ["npm", "pnpm", "yarn"].includes(value);
}

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
```

---

**Document Status**: Draft v1.0  
**Author**: Product Manager  
**Stakeholders**: Engineering Team, UX Team  
**Implementation Target**: Next Sprint  
**Dependencies**: None (pure feature addition)
