# RFC: Add Phase 5 (Fix) with Specialized Inputs

## Scope & Files (Allowlist)

### Files to be Modified

**App Code:**

- `apps/builder/src/types/index.ts` - Update Phase interface and PhaseId type
- `apps/builder/src/composables/usePhases.ts` - Add Phase 5 to phasesList
- `apps/builder/src/components/PhaseView.vue` - Add conditional rendering for Phase 5 inputs
- `apps/builder/src/components/Phase5Inputs.vue` - **NEW** - Specialized input component for Phase 5
- `apps/builder/src/components/Phase5InputField.vue` - **NEW** - Reusable input field component
- `apps/builder/src/components/Phase5SeveritySelect.vue` - **NEW** - Severity dropdown component
- `apps/builder/src/composables/usePhase5Inputs.ts` - **NEW** - Phase 5 specific composable
- `apps/builder/src/utils/phase5Validation.ts` - **NEW** - Phase 5 validation utilities

**Tests:**

- `apps/builder/src/components/__tests__/Phase5Inputs.spec.ts` - **NEW** - Phase 5 inputs component tests
- `apps/builder/src/components/__tests__/Phase5InputField.spec.ts` - **NEW** - Input field component tests
- `apps/builder/src/components/__tests__/Phase5SeveritySelect.spec.ts` - **NEW** - Severity select tests
- `apps/builder/src/composables/__tests__/usePhase5Inputs.spec.ts` - **NEW** - Composable tests
- `apps/builder/src/utils/__tests__/phase5Validation.spec.ts` - **NEW** - Validation utility tests
- `apps/builder/src/components/__tests__/PhaseView.spec.ts` - Update existing tests for Phase 5

**Documentation:**

- `apps/builder/src/config/types.ts` - Add Phase 5 specific types (if needed)

### Files NOT to be Modified (DN-T)

- `package.json` - No new dependencies
- `tsconfig*.json` - No TypeScript config changes
- `vite.config.ts` - No build config changes
- `eslint.config.js` - No linting rule changes
- `vitest.config.ts` - No test config changes
- Any other DN-T files as per REPO_CONSTRAINTS.md

## Zero-Infra-Change Plan

### Current Stack Utilization

**Linting & TypeScript:**

- Use existing ESLint rules and TypeScript strict mode
- Leverage existing `@typescript-eslint` rules for type safety
- Follow existing naming conventions and code style

**Vue.js & Composition API:**

- Use Vue 3 Composition API patterns consistent with existing code
- Leverage existing `ref`, `computed`, `watch` patterns
- Follow existing component composition structure

**Styling:**

- Use existing SCSS patterns and BEM methodology
- Leverage existing CSS classes and design tokens
- Follow existing responsive design patterns

**Testing:**

- Use existing Vitest + @testing-library/vue setup
- Follow existing test patterns and mocking strategies
- Use existing `vi.mock()` patterns for composable mocking

**Accessibility:**

- Follow existing ARIA patterns and accessibility standards
- Use existing screen reader utilities and focus management
- Maintain existing keyboard navigation patterns

### Adapter/Shim Strategies

**Phase Interface Extension:**

- Extend existing Phase interface to include "5" in PhaseId union
- Use conditional rendering in PhaseView to show Phase5Inputs for Phase 5
- Maintain backward compatibility with existing phases

**Validation Integration:**

- Extend existing validation composable pattern
- Create Phase 5 specific validation rules that integrate with existing system
- Use existing error handling and display patterns

**State Management:**

- Integrate with existing localStorage persistence
- Use existing phase update patterns and event emission
- Maintain existing state synchronization

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### No Infrastructure Changes Required

**Rationale:** The implementation can be completed using existing infrastructure without any modifications to DN-T files.

**Current Infrastructure Sufficient:**

- TypeScript strict mode already enforces type safety
- Existing Vue 3 + Vite setup supports component composition
- Current testing infrastructure supports all required test patterns
- Existing ESLint rules provide adequate code quality enforcement
- Current build process handles all required file types

**Risk/Benefit Analysis:**

- **Risk:** None - no infrastructure changes needed
- **Benefit:** Faster implementation, no approval process required
- **Maintenance:** No additional configuration to maintain

## Type Guarantees

### Strict TypeScript Compliance

**No `any` Types:**

```typescript
// ✅ Allowed - specific type definitions
export interface Phase5Inputs {
  bugTitle: string;
  severity: BugSeverity;
  // ... other fields
}

// ❌ Forbidden - no any types
const data: any = {};
```

**No `unknown` Types:**

```typescript
// ✅ Allowed - specific type guards
function isValidPhase5Input(value: unknown): value is Phase5Inputs {
  return typeof value === "object" && value !== null && "bugTitle" in value;
}

// ❌ Forbidden - no unknown in public APIs
function processInput(input: unknown): string;
```

**No Non-null Assertions:**

```typescript
// ✅ Allowed - proper null checks
const element = document.getElementById("input");
if (element) {
  element.value = "test";
}

// ❌ Forbidden - no non-null assertions
const element = document.getElementById("input")!;
```

**No `as any` Casts:**

```typescript
// ✅ Allowed - proper type assertions
const phase = data as Phase5Inputs;

// ❌ Forbidden - no as any casts
const phase = data as any;
```

### Exhaustive Union Types

```typescript
// ✅ Allowed - exhaustive union with all cases
export type BugSeverity =
  | "blocker"
  | "critical"
  | "major"
  | "minor"
  | "trivial";

// ✅ Allowed - exhaustive phase input field types
export type Phase5InputFieldType =
  | "text"
  | "textarea"
  | "select"
  | "url"
  | "commit-sha";
```

### Precise Exported Types

```typescript
// ✅ Allowed - precise component props
export interface Phase5InputsProps {
  modelValue: Phase5Inputs;
  disabled?: boolean;
  showValidation?: boolean;
  compact?: boolean;
  "aria-label"?: string;
}

// ✅ Allowed - precise composable return types
export interface UsePhase5InputsReturn {
  inputs: Ref<Phase5Inputs>;
  validationState: ComputedRef<Phase5ValidationState>;
  updateInput: (field: keyof Phase5Inputs, value: string) => void;
  validateInput: (field: keyof Phase5Inputs) => ValidationError[];
  validateAll: () => Phase5ValidationState;
  resetInputs: () => void;
  getFieldError: (field: keyof Phase5Inputs) => string;
}
```

## Validation Plan (Human-Runnable)

### Pre-Implementation Validation

```bash
# 1. Verify current state is clean
pnpm -w lint
pnpm -w typecheck
pnpm -w test
pnpm -w build
```

**Expected Result:** All commands pass without errors

### Implementation Validation

```bash
# 2. After implementing Phase 5 types
pnpm -w typecheck
```

**Expected Result:** TypeScript compilation succeeds with Phase 5 types

```bash
# 3. After implementing Phase 5 components
pnpm -w lint
```

**Expected Result:** ESLint passes with no new violations

```bash
# 4. After implementing Phase 5 tests
pnpm -w test
```

**Expected Result:** All tests pass including new Phase 5 tests

```bash
# 5. After full implementation
pnpm -w build
```

**Expected Result:** Production build succeeds

### Post-Implementation Validation

```bash
# 6. Final validation
pnpm -w lint
pnpm -w typecheck
pnpm -w test
pnpm -w build
```

**Expected Result:** All commands pass, no regressions

### Manual Testing Checklist

- [ ] Phase 5 appears in navigation
- [ ] Phase 5 inputs render correctly
- [ ] All 17 input fields are functional
- [ ] Validation works for all fields
- [ ] Token replacement works with Phase 5 inputs
- [ ] State persists to localStorage
- [ ] Export/import includes Phase 5 data
- [ ] Accessibility features work (keyboard nav, screen readers)
- [ ] Error states display correctly
- [ ] Loading states work properly

## Implementation Strategy

### Phase 1: Type System Updates

1. Update `Phase` interface to include "5" in PhaseId union
2. Add Phase 5 specific types and interfaces
3. Update `usePhases` composable to include Phase 5

### Phase 2: Core Components

1. Create `Phase5InputField` component
2. Create `Phase5SeveritySelect` component
3. Create `Phase5Inputs` main component
4. Create `usePhase5Inputs` composable

### Phase 3: Validation System

1. Create Phase 5 validation utilities
2. Integrate with existing validation system
3. Add field-specific validation rules

### Phase 4: Integration

1. Update `PhaseView` to conditionally render Phase 5 inputs
2. Integrate with existing state management
3. Add Phase 5 to navigation

### Phase 5: Testing

1. Write comprehensive unit tests
2. Add integration tests
3. Test accessibility features
4. Validate error handling

### Phase 6: Documentation & Polish

1. Add JSDoc comments
2. Update component documentation
3. Final validation and testing

## Risk Mitigation

### Type Safety Risks

**Risk:** Complex Phase 5 types may introduce type errors
**Mitigation:** Incremental type development with strict validation at each step

### Component Complexity Risks

**Risk:** Phase5Inputs component may become too complex
**Mitigation:** Break into smaller, focused sub-components

### Integration Risks

**Risk:** Phase 5 may not integrate smoothly with existing system
**Mitigation:** Follow existing patterns and test integration thoroughly

### Performance Risks

**Risk:** 17 input fields may impact performance
**Mitigation:** Use Vue 3 reactivity efficiently and debounce validation

## Success Criteria

### Functional Requirements

- [ ] All 17 Phase 5 input fields implemented and functional
- [ ] Phase 5 integrates seamlessly with existing workflow
- [ ] All validation rules work correctly
- [ ] State management works properly
- [ ] Token replacement works with Phase 5 inputs

### Technical Requirements

- [ ] Zero TypeScript errors in strict mode
- [ ] All ESLint rules pass
- [ ] 100% test coverage for new components
- [ ] All accessibility requirements met
- [ ] Performance within acceptable limits

### Quality Requirements

- [ ] Code follows existing patterns and conventions
- [ ] Components are reusable and maintainable
- [ ] Documentation is complete and accurate
- [ ] No regressions in existing functionality

---

**RFC Version:** 1.0  
**Status:** Ready for Implementation  
**Next Steps:** Begin Phase 1 implementation (Type System Updates)
