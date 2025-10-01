# RFC: Add Phase 6 (Fix TSC/ESLint/Tests) Integration

## Scope & Files (Allowlist)

### Files to be Modified (App Code, Tests, Docs ONLY)

**Core Type Definitions:**

- `apps/builder/src/types/index.ts` - Update Phase interface to include "6"
- `apps/builder/src/config/types.ts` - Update PHASE_CONFIG_SCHEMA enum

**Phase Management Logic:**

- `apps/builder/src/composables/usePhases.ts` - Update hardcoded phasesList array

**Test Files:**

- `apps/builder/src/__tests__/PhaseView.spec.ts` - Update mock phase ID if needed

**Documentation:**

- `PRD_ADD_PHASE_SIX.md` - Already created (reference only)

### Files NOT Modified (DN-T Compliance)

- `package.json` - No dependency changes needed
- `tsconfig*.json` - No TypeScript config changes needed
- `vite.config.ts` - No build config changes needed
- `eslint.config.js` - No linting config changes needed
- All other DN-T files per REPO_CONSTRAINTS.md

## Zero-Infra-Change Plan

### Current Tooling Utilization

- **TypeScript**: Use existing strict mode configuration, no changes needed
- **ESLint**: Use existing rules, no new rules or config changes
- **Vue 3**: Use existing Composition API patterns, no framework changes
- **Vite**: Use existing build system, no configuration changes
- **Vitest**: Use existing test setup, no test config changes
- **SCSS**: Use existing styling approach, no CSS framework changes

### Implementation Strategy

1. **Type-First Approach**: Update TypeScript interfaces first to ensure type safety
2. **Configuration-Driven**: Use existing phase configuration system
3. **Minimal Changes**: Only modify hardcoded arrays and type definitions
4. **Backward Compatibility**: Ensure all existing functionality remains intact
5. **Test Coverage**: Update tests to include Phase 6 scenarios

### Adapter/Shim Strategies

- **Phase List Generation**: Replace hardcoded array with configuration-driven approach
- **Type Safety**: Use existing PhaseId type that already includes "6"
- **Phase Creation**: Use existing getPhase() logic that handles missing phases
- **Template System**: Use existing template loading and replacement system

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### No Infrastructure Changes Required

This implementation requires **zero infrastructure changes**. All existing tooling and configuration is sufficient:

- **TypeScript**: Current strict mode handles Phase 6 types correctly
- **ESLint**: Current rules work with Phase 6 code
- **Vite**: Current build system handles Phase 6 without issues
- **Testing**: Current Vitest setup works with Phase 6 tests
- **Styling**: Current SCSS approach works with Phase 6 UI

### Rationale for No Changes

Phase 6 integration is purely a data/type change that leverages existing infrastructure. The application architecture already supports dynamic phase management through the configuration system.

## Type Guarantees

### Strict TypeScript Compliance

- **No `any`**: All types are explicitly defined
- **No `unknown`**: Use specific types or proper type guards
- **No non-null `!`**: Use proper null checks and optional chaining
- **No `as any`**: Use proper type assertions or type guards
- **Exhaustive unions**: All union types include Phase 6
- **Precise exported types**: All exported types are precisely defined

### Type Safety Measures

```typescript
// Phase interface includes Phase 6
export interface Phase {
  id: "0" | "1" | "2" | "2.5" | "3" | "4" | "5" | "6";
  // ... other properties
}

// PhaseId type already includes "6"
export type PhaseId = "0" | "1" | "2" | "2.5" | "3" | "4" | "5" | "6";

// Configuration schema includes Phase 6
export const PHASE_CONFIG_SCHEMA = {
  properties: {
    id: {type: "string", enum: ["0", "1", "2", "2.5", "3", "4", "5", "6"]},
    // ... other properties
  },
} as const;
```

### Type Validation

- All type changes are compile-time checked
- No runtime type assertions needed
- Existing type guards work with Phase 6
- Union types are exhaustive and type-safe

## Implementation Details

### 1. Update Phase Interface

**File**: `apps/builder/src/types/index.ts`
**Change**: Add "6" to Phase interface id union type

```typescript
export interface Phase {
  id: "0" | "1" | "2" | "2.5" | "3" | "4" | "5" | "6";
  // ... rest unchanged
}
```

### 2. Update Configuration Schema

**File**: `apps/builder/src/config/types.ts`
**Change**: Add "6" to PHASE_CONFIG_SCHEMA enum

```typescript
export const PHASE_CONFIG_SCHEMA = {
  properties: {
    id: {type: "string", enum: ["0", "1", "2", "2.5", "3", "4", "5", "6"]},
    // ... rest unchanged
  },
} as const;
```

### 3. Update Phase List Generation

**File**: `apps/builder/src/composables/usePhases.ts`
**Change**: Replace hardcoded array with configuration-driven approach

```typescript
const phasesList = computed(() => {
  return ["0", "1", "2", "2.5", "3", "4", "5", "6"].map((id) =>
    getPhase(id as PhaseId)
  );
});
```

### 4. Update Test Files (if needed)

**File**: `apps/builder/src/__tests__/PhaseView.spec.ts`
**Change**: Update mock phase ID to use Phase 6 for testing

```typescript
const mockPhase: Phase = {
  id: "6", // Test Phase 6 specifically
  title: "Fix TSC/ESLint/Tests",
  // ... rest unchanged
};
```

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
# Type checking - should pass with Phase 6 types
pnpm -w typecheck

# Linting - should pass with no new violations
pnpm -w lint

# Testing - should pass with Phase 6 tests
pnpm -w test

# Build - should complete successfully
pnpm -w build

# Manual testing - verify Phase 6 appears in navigation and works
npm run dev
```

### Expected Results

- **TypeScript**: 0 errors, all Phase 6 types properly recognized
- **ESLint**: 0 errors, 0 warnings, no new violations
- **Tests**: All tests pass, including Phase 6 scenarios
- **Build**: Successful build with Phase 6 included
- **Runtime**: Phase 6 appears in navigation and functions correctly

### Validation Checklist

- [ ] Phase 6 appears in phase navigation
- [ ] Phase 6 can be selected and becomes active
- [ ] Phase 6 template loads and displays correctly
- [ ] Phase 6 supports template editing when overrides enabled
- [ ] Phase 6 supports custom input management
- [ ] Phase 6 generates output with token replacement
- [ ] Phase 6 data persists in localStorage
- [ ] Phase 6 data is included in export/import operations
- [ ] All existing phases continue to work unchanged
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes with no errors
- [ ] All tests pass
- [ ] Build completes successfully

## Risk Assessment

### Low Risk Changes

- **Type Updates**: Adding "6" to union types is low risk
- **Array Updates**: Adding "6" to hardcoded arrays is low risk
- **Configuration**: Phase 6 config already exists and works

### Mitigation Strategies

- **Type Safety**: TypeScript will catch any type mismatches
- **Testing**: Existing tests will catch any functional regressions
- **Incremental**: Changes are minimal and isolated
- **Rollback**: Easy to revert by removing "6" from arrays/types

### No Breaking Changes

- **API Compatibility**: No public API changes
- **Data Compatibility**: Existing data remains valid
- **UI Compatibility**: No visual or interaction changes
- **Performance**: No performance impact

## Success Criteria

### Functional Success

- Phase 6 is fully accessible through the UI
- Phase 6 behaves identically to other phases
- All existing functionality remains intact
- Phase 6 data persists across sessions

### Technical Success

- TypeScript compilation succeeds
- ESLint passes with no errors
- All tests pass
- Build completes successfully
- No runtime errors

### User Experience Success

- Phase 6 appears in navigation
- Phase 6 can be selected and used
- Phase 6 template editing works
- Phase 6 input management works
- Phase 6 output generation works

## Implementation Timeline

### Phase 1: Type Updates (5 minutes)

1. Update Phase interface in `types/index.ts`
2. Update PHASE_CONFIG_SCHEMA in `config/types.ts`
3. Run typecheck to verify

### Phase 2: Logic Updates (5 minutes)

1. Update phasesList in `usePhases.ts`
2. Run tests to verify functionality
3. Run build to verify compilation

### Phase 3: Testing (10 minutes)

1. Update test files if needed
2. Run full test suite
3. Manual testing in browser

### Phase 4: Validation (5 minutes)

1. Run all validation commands
2. Verify Phase 6 functionality
3. Confirm no regressions

**Total Estimated Time**: 25 minutes

## Conclusion

This RFC proposes a minimal, low-risk implementation of Phase 6 integration that leverages existing infrastructure and patterns. The changes are purely additive and maintain full backward compatibility while providing complete Phase 6 functionality.

The implementation follows the established patterns in the codebase and requires no infrastructure changes, making it a safe and straightforward enhancement to the prompt builder application.

---

**RFC Version**: 1.0  
**Created**: Senior Frontend Developer  
**Status**: Ready for Implementation  
**Estimated Effort**: 25 minutes  
**Risk Level**: Low
