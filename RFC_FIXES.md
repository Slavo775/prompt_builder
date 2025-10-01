# RFC: Prompt Builder Critical Fixes Implementation

**Author**: Senior Frontend Developer  
**Date**: 2024-01-01  
**Status**: Draft  
**Type**: Implementation Plan

## Summary

This RFC outlines the implementation plan for fixing three critical issues in the prompt builder application:

1. **Token replacement not working** - Input values and rendered results don't match
2. **Error states not working** - Validation feedback not properly displayed
3. **Missing requirements input** - No dedicated text area for project requirements

## Scope & Files (Allowlist)

### Files to be Modified

#### Core Types & Interfaces

- `apps/builder/src/types/index.ts` - Add requirements field to GlobalInputs
- `apps/builder/src/config/types.ts` - Add new validation and token replacement types

#### Token Replacement System

- `apps/builder/src/composables/useReplacements.ts` - Fix token replacement logic
- `apps/builder/src/utils/tokenParser.ts` - Enhance token parsing and analysis
- `apps/builder/src/utils/validation.ts` - Fix validation logic and error reporting

#### UI Components

- `apps/builder/src/components/GlobalInputs.vue` - Add requirements input, fix error display
- `apps/builder/src/components/PhaseInputs.vue` - Fix error state display
- `apps/builder/src/components/PhaseTemplateEditor.vue` - Enhance template editing
- `apps/builder/src/components/PhasePreview.vue` - Ensure preview accuracy

#### New Components

- `apps/builder/src/components/RequirementsInput.vue` - New requirements textarea component

#### Tests

- `apps/builder/src/__tests__/useReplacements.spec.ts` - Update token replacement tests
- `apps/builder/src/__tests__/validation.spec.ts` - Update validation tests
- `apps/builder/src/__tests__/tokenParser.spec.ts` - Update token parsing tests
- `apps/builder/src/components/__tests__/GlobalInputs.spec.ts` - Update global inputs tests
- `apps/builder/src/components/__tests__/PhaseInputs.spec.ts` - Update phase inputs tests
- `apps/builder/src/components/__tests__/RequirementsInput.spec.ts` - New requirements component tests

#### Documentation

- `PRD_FIXES.md` - Product requirements (already created)

### Files NOT to be Modified (DN-T)

- All configuration files (tsconfig\*.json, eslint.config.js, vite.config.ts, etc.)
- Package management files (package.json, pnpm-lock.yaml)
- Build and deployment configuration
- Any dotfiles or infrastructure files

## Zero-Infra-Change Plan

### Current Infrastructure Utilization

#### Linting & Type Checking

- **ESLint**: Use existing `eslint.config.js` configuration
- **TypeScript**: Use existing `tsconfig.json` and `tsconfig.app.json`
- **Vue**: Use existing Vue 3 Composition API patterns

#### Testing Framework

- **Vitest**: Use existing test configuration
- **@testing-library/vue**: Use existing component testing setup
- **jest-axe**: Add for accessibility testing (no config changes needed)

#### Build System

- **Vite**: Use existing build configuration
- **vue-tsc**: Use existing TypeScript compilation
- **No bundler changes**: Work within current Vite setup

#### Styling

- **SCSS**: Use existing BEM methodology and scoped styles
- **CSS Variables**: Maintain existing design system
- **Responsive Design**: Work within existing layout constraints

### Adapter/Shim Strategies

#### Type Safety Adapter

```typescript
// Create type-safe adapters for existing interfaces
interface GlobalInputsWithRequirements extends GlobalInputs {
  requirements: string;
}

// Use type guards for safe property access
function hasRequirements(
  inputs: GlobalInputs
): inputs is GlobalInputsWithRequirements {
  return "requirements" in inputs;
}
```

#### Validation State Adapter

```typescript
// Create adapter for enhanced validation state
interface EnhancedValidationState extends ValidationState {
  requirementsValid: boolean;
  tokenReplacementValid: boolean;
}

// Adapter function to convert existing state
function enhanceValidationState(
  state: ValidationState
): EnhancedValidationState {
  return {
    ...state,
    requirementsValid: true, // Will be implemented
    tokenReplacementValid: true, // Will be implemented
  };
}
```

#### Error Display Adapter

```typescript
// Create adapter for consistent error display
interface ErrorDisplayAdapter {
  getFieldError(fieldName: string): string;
  getFieldErrorId(fieldName: string): string;
  hasFieldError(fieldName: string): boolean;
}
```

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### 1. Add jest-axe for Accessibility Testing

**Rationale**: Current tests don't validate accessibility compliance. jest-axe would ensure error states are properly announced to screen readers.

**Minimal Diff**:

```diff
// package.json (PROPOSAL ONLY - NOT TO BE APPLIED)
{
  "devDependencies": {
+   "jest-axe": "^7.0.0"
  }
}
```

**Risk/Benefit**:

- **Risk**: Adds new dependency, requires test updates
- **Benefit**: Ensures accessibility compliance, prevents regressions
- **Mitigation**: Use existing test patterns, minimal integration required

### 2. Add Debouncing for Validation Performance

**Rationale**: Real-time validation could cause performance issues with large templates.

**Minimal Diff**:

```diff
// apps/builder/src/composables/useValidation.ts (PROPOSAL ONLY)
import { debounce } from 'lodash-es';

const debouncedValidation = debounce(validateAllInputs, 300);
```

**Risk/Benefit**:

- **Risk**: Adds lodash dependency, changes validation timing
- **Benefit**: Improves performance, better UX
- **Mitigation**: Use native debouncing, keep dependency minimal

### 3. Add Error Boundary Component

**Rationale**: Current app has no error boundaries, crashes could lose user data.

**Minimal Diff**:

```diff
// apps/builder/src/components/ErrorBoundary.vue (PROPOSAL ONLY)
<template>
  <div v-if="hasError" class="error-boundary">
    <h2>Something went wrong</h2>
    <p>{{ error.message }}</p>
    <button @click="retry">Try Again</button>
  </div>
  <slot v-else />
</template>
```

**Risk/Benefit**:

- **Risk**: Adds complexity, needs proper error handling
- **Benefit**: Prevents data loss, better error recovery
- **Mitigation**: Simple implementation, graceful degradation

## Type Guarantees

### No Unsafe Types

- **No `any`**: All types explicitly defined
- **No `unknown`**: Use proper type guards and assertions
- **No non-null `!`**: Use proper null checks and optional chaining
- **No `as any`**: Use proper type assertions with type guards

### Exhaustive Unions

```typescript
// All union types must be exhaustive
type TokenType = "global" | "phase" | "custom" | "unknown";
type ValidationSeverity = "error" | "warning" | "info";
type InputFieldType = "text" | "email" | "url" | "textarea" | "requirements";
```

### Precise Exported Types

```typescript
// All exported interfaces must be precisely typed
export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  owner: string;
  repoUrl?: string; // Optional with proper undefined handling
  stack: string;
  dateIso: string;
  requirements: string; // NEW: Required field
}

export interface TokenReplacementResult {
  originalTemplate: string;
  renderedTemplate: string;
  replacedTokens: string[];
  unreplacedTokens: string[];
  isValid: boolean;
  errors: ValidationError[];
}
```

### Type Guards and Assertions

```typescript
// Use type guards for safe property access
function isGlobalInputsWithRequirements(
  inputs: unknown
): inputs is GlobalInputsWithRequirements {
  return (
    typeof inputs === "object" &&
    inputs !== null &&
    "requirements" in inputs &&
    typeof (inputs as any).requirements === "string"
  );
}

// Use proper type assertions
function getTokenValue(token: string, inputs: Record<string, string>): string {
  const value = inputs[token];
  return value ?? ""; // Use nullish coalescing instead of !
}
```

## Implementation Plan

### Phase 1: Type System Updates (1-2 days)

1. Update `GlobalInputs` interface to include requirements
2. Add new validation and token replacement types
3. Create type guards and adapters
4. Update all type imports and exports

### Phase 2: Token Replacement Fixes (2-3 days)

1. Fix `useReplacements` composable logic
2. Update `tokenParser` utility functions
3. Ensure consistent regex patterns across all modules
4. Add comprehensive token replacement tests

### Phase 3: Validation System Fixes (2-3 days)

1. Fix validation logic in `validation.ts`
2. Update error reporting and state management
3. Ensure validation runs on all input changes
4. Add validation performance optimizations

### Phase 4: UI Component Updates (2-3 days)

1. Add requirements input to `GlobalInputs.vue`
2. Fix error state display in all components
3. Update `PhaseInputs.vue` error handling
4. Ensure consistent error styling across components

### Phase 5: Testing & Validation (1-2 days)

1. Update all existing tests
2. Add new tests for requirements functionality
3. Add accessibility tests with jest-axe
4. Ensure all tests pass

### Phase 6: Integration & Polish (1 day)

1. Test complete user workflows
2. Verify data persistence
3. Check export/import functionality
4. Final validation and bug fixes

## Validation Plan (Human-Runnable)

### Pre-Implementation Validation

```bash
# Ensure clean starting state
pnpm -w lint
pnpm -w typecheck
pnpm -w test
pnpm -w build
```

### Post-Implementation Validation

```bash
# Run all validation commands
pnpm -w lint
pnpm -w typecheck
pnpm -w test
pnpm -w build

# Additional validation
pnpm test -- --coverage
pnpm test -- --ui
```

### Manual Testing Checklist

- [ ] Token replacement works correctly for all input types
- [ ] Error states display properly with red borders and messages
- [ ] Requirements input accepts and stores multi-line text
- [ ] All validation errors are actionable and clear
- [ ] Preview matches actual output exactly
- [ ] Data persists across browser sessions
- [ ] Export/import includes all data including requirements
- [ ] Accessibility features work with screen readers
- [ ] All existing functionality remains intact

### Performance Validation

- [ ] Validation runs smoothly with large templates
- [ ] Token replacement is fast and responsive
- [ ] No memory leaks in long-running sessions
- [ ] Build time remains reasonable

## Risk Mitigation

### Technical Risks

1. **Type System Breaking Changes**: Use gradual migration with adapters
2. **Validation Performance**: Implement debouncing and memoization
3. **Data Migration**: Add graceful handling for missing requirements field
4. **Test Coverage**: Maintain high test coverage throughout changes

### User Experience Risks

1. **Breaking Existing Workflows**: Maintain backward compatibility
2. **Confusing New Features**: Clear labeling and help text
3. **Performance Degradation**: Monitor and optimize validation performance

### Implementation Risks

1. **Scope Creep**: Stick to defined requirements, defer enhancements
2. **Timeline Delays**: Use phased approach with early validation
3. **Integration Issues**: Test thoroughly at each phase

## Success Criteria

### Functional Success

- [ ] 100% token replacement accuracy
- [ ] All validation errors properly displayed
- [ ] Requirements input fully functional
- [ ] All tests passing
- [ ] Clean build and lint

### Performance Success

- [ ] Validation response time < 100ms
- [ ] Token replacement response time < 50ms
- [ ] No memory leaks detected
- [ ] Build time increase < 10%

### User Experience Success

- [ ] Error messages are clear and actionable
- [ ] All inputs are accessible via keyboard
- [ ] Screen readers can access error states
- [ ] Preview accurately reflects final output

## Conclusion

This implementation plan provides a comprehensive approach to fixing the three critical issues in the prompt builder application while maintaining the existing architecture and ensuring type safety. The phased approach allows for early validation and risk mitigation, while the zero-infra-change strategy ensures we work within existing constraints.

The plan prioritizes fixing core functionality over adding new features, ensuring the application becomes reliable and user-friendly for daily use.
