# RFC: Native Prompts Selector Implementation

**Version**: 2.0  
**Status**: Draft  
**Author**: Senior Frontend Developer  
**Created**: 2025-10-02  
**Related PRD**: [PRD_PROMPTS_AS_SELECTOR_V2.md](./PRD_PROMPTS_AS_SELECTOR_V2.md)  
**Supersedes**: RFC_PROMPTS_AS_SELECTOR.md v1.0

## Scope & Files (Allowlist)

### Files to be Modified

#### Component Files

```
apps/builder/src/components/NativePhaseSelector.vue    [NEW - Native HTML select implementation]
apps/builder/src/components/PhaseSelector.vue         [DEPRECATE - Keep for rollback, mark deprecated]
```

#### Composable Files

```
apps/builder/src/composables/useNativePhaseSelector.ts [NEW - Simplified native logic]
```

#### Type Definition Files

```
apps/builder/src/types/index.ts                       [MODIFY - Add native selector types]
```

#### Parent Component Files

```
apps/builder/src/pages/Index.vue                      [MODIFY - Import NativePhaseSelector]
```

#### Test Files

```
apps/builder/src/components/__tests__/NativePhaseSelector.spec.ts     [NEW - Native component tests]
apps/builder/src/composables/__tests__/useNativePhaseSelector.spec.ts [NEW - Native composable tests]
```

#### Style Files

```
apps/builder/src/styles/index.scss                    [MODIFY - Add unified form control tokens]
```

### Files NOT Modified

- All configuration files (DN-T list compliance)
- Existing PhaseSelector implementation (kept for rollback)
- Phase configuration files
- Global state management composables
- localStorage persistence logic

## Zero-Infra-Change Plan

### Current Architecture Compatibility

#### 1. Vue 3 Native Form Integration

**Current Pattern**: Vue 3 with v-model and reactive form handling
**Adaptation Strategy**:

- NativePhaseSelector uses standard v-model binding
- Leverages Vue's native form control support
- Maintains existing reactive patterns with computed properties
- No custom event handling beyond standard @change

#### 2. TypeScript Strict Mode Compliance

**Current Standard**: Strict TypeScript with precise typing
**Adaptation Strategy**:

- All native selector types precisely defined
- Event types use native HTMLSelectElement events
- Form validation types align with existing patterns
- No `any`, `unknown`, or non-null assertions

#### 3. SCSS/BEM Styling Integration

**Current Pattern**: BEM methodology with CSS custom properties
**Adaptation Strategy**:

- Reuse existing GlobalInputs CSS custom properties
- Follow `.native-phase-selector__element` BEM naming
- Leverage existing form control design tokens
- Minimal custom CSS (native selects are largely unstyled)

#### 4. Testing Framework Integration

**Current Setup**: Vitest + @testing-library/vue + jest-axe
**Adaptation Strategy**:

- Simplified testing (no custom dropdown behavior)
- Focus on form integration and accessibility
- Native select behavior testing with user events
- Reduced test complexity vs custom dropdown

#### 5. Accessibility Framework Integration

**Current Standard**: WCAG 2.1 AA with ARIA attributes
**Adaptation Strategy**:

- Leverage native select accessibility features
- Proper label association with `for` attribute
- Native screen reader announcements
- Standard keyboard navigation (no custom handling)

### Existing Composable Reuse Strategy

#### 1. Phase Management (useViewAwarePhases)

```typescript
// Current usage - NO CHANGES to parent logic
const {phasesList, currentPhaseId, handlePhaseChange} = useViewAwarePhases();

// NativePhaseSelector consumes identical interface
<NativePhaseSelector
  :phases-list="phasesList"
  :current-phase-id="currentPhaseId"
  @phase-change="handlePhaseChange"
/>
```

#### 2. Form Validation Integration

```typescript
// Native selects integrate with existing validation
// No changes to useValidation composable
// Standard HTML5 validation attributes supported
```

#### 3. Local Storage Integration

```typescript
// NO CHANGES to persistence layer
// NativePhaseSelector emits same phase-change events
// Parent components handle state persistence identically
```

### Event Interface Compatibility

#### Current PhaseSelector Interface (Maintained)

```typescript
// EXACT SAME interface maintained for drop-in replacement
interface PhaseSelectorProps {
  phasesList: (Phase | BackendPhase)[];
  currentPhaseId: AnyPhaseId;
  viewType?: ViewType;
}

interface PhaseSelectorEmits {
  "phase-change": [phaseId: AnyPhaseId];
}
```

#### NativePhaseSelector Interface (Enhanced)

```typescript
// IDENTICAL core interface + native enhancements
interface NativePhaseSelectorProps {
  phasesList: ReadonlyArray<Phase | BackendPhase>;
  currentPhaseId: AnyPhaseId;
  viewType?: ViewType;
  // Native-specific enhancements
  disabled?: boolean;
  label?: string;
  id?: string;
  required?: boolean;
}

interface NativePhaseSelectorEmits {
  "phase-change": [phaseId: AnyPhaseId];
  // Native form events (optional for enhanced integration)
  focus?: [event: FocusEvent];
  blur?: [event: FocusEvent];
}
```

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### 1. CSS Custom Properties Enhancement

**Rationale**: Centralized form control theming for consistency
**Risk**: Very Low - CSS-only changes, no breaking changes
**Benefit**: Unified design system, easier maintenance

```diff
// apps/builder/src/styles/index.scss (PROPOSAL ONLY - NOT TO BE APPLIED)
:root {
  /* Existing variables... */
+
+ /* Unified Form Control Design Tokens */
+ --form-control-padding: 0.5rem;
+ --form-control-border: 1px solid #d1d5db;
+ --form-control-border-radius: 0.375rem;
+ --form-control-font-size: 0.875rem;
+ --form-control-focus-border: #3b82f6;
+ --form-control-focus-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
+
+ /* Form Label Design Tokens */
+ --form-label-font-size: 0.875rem;
+ --form-label-font-weight: 500;
+ --form-label-color: #374151;
+ --form-label-margin-bottom: 0.5rem;
}
```

### 2. Form Validation Enhancement

**Rationale**: Leverage native HTML5 validation for better UX
**Risk**: Low - Progressive enhancement only
**Benefit**: Better form validation, reduced JavaScript

```diff
// vite.config.ts (PROPOSAL ONLY - NOT TO BE APPLIED)
export default defineConfig({
  plugins: [
    vue({
+     template: {
+       compilerOptions: {
+         // Enable native form validation attributes
+         isNativeTag: (tag) => ['select', 'option', 'label'].includes(tag)
+       }
+     }
    })
  ]
});
```

### 3. Accessibility Testing Enhancement

**Rationale**: Enhanced a11y testing for native form controls
**Risk**: Low - Development-only enhancement
**Benefit**: Better accessibility validation

```diff
// vitest.config.ts (PROPOSAL ONLY - NOT TO BE APPLIED)
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [
      "./apps/builder/src/__tests__/setup.ts",
+     "./apps/builder/src/__tests__/native-forms-setup.ts"
    ],
    globals: true,
  },
});
```

## Type Guarantees

### 1. Strict TypeScript Compliance

All native selector types follow repository standards:

```typescript
// ✅ COMPLIANT: Precise native form types
export interface NativePhaseSelectorProps {
  readonly phasesList: ReadonlyArray<Phase | BackendPhase>;
  readonly currentPhaseId: AnyPhaseId;
  readonly viewType?: ViewType;
  readonly disabled?: boolean;
  readonly label?: string;
  readonly id?: string;
  readonly required?: boolean;
}

// ✅ COMPLIANT: Native event types
export interface NativePhaseSelectorEmits {
  "phase-change": [phaseId: AnyPhaseId];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}

// ✅ COMPLIANT: Form field configuration
export interface PhaseFormField {
  readonly id: string;
  readonly name: string;
  readonly value: AnyPhaseId;
  readonly required: boolean;
  readonly valid: boolean;
}

// ❌ FORBIDDEN: No any, unknown, or non-null assertions
// export interface BadExample {
//   selectRef: HTMLSelectElement!;  // ❌ Forbidden
//   options: any[];                 // ❌ Forbidden
//   event: unknown;                 // ❌ Forbidden
// }
```

### 2. Exhaustive Union Handling

```typescript
// ✅ COMPLIANT: Exhaustive phase ID validation
export function isValidPhaseId(value: string): value is AnyPhaseId {
  const validIds: AnyPhaseId[] = ["0", "1", "2", "2.5", "3", "4", "5", "6"];
  return validIds.includes(value as AnyPhaseId);
}

// ✅ COMPLIANT: Exhaustive view type handling
export function getValidPhasesForView(
  phases: ReadonlyArray<Phase | BackendPhase>,
  viewType: ViewType
): ReadonlyArray<Phase | BackendPhase> {
  switch (viewType) {
    case "frontend":
      return phases.filter((phase) => isPhaseId(phase.id));
    case "backend":
      return phases.filter((phase) => isBackendPhaseId(phase.id));
    default:
      // TypeScript ensures this is never reached
      const _exhaustive: never = viewType;
      throw new Error(`Unhandled view type: ${_exhaustive}`);
  }
}
```

### 3. Precise Form Integration Types

```typescript
// ✅ COMPLIANT: Native HTML element types
export interface NativeSelectElement extends HTMLSelectElement {
  readonly value: AnyPhaseId;
  readonly selectedIndex: number;
  readonly options: HTMLOptionsCollection;
}

// ✅ COMPLIANT: Form validation result
export interface FormValidationResult {
  readonly valid: boolean;
  readonly valueMissing: boolean;
  readonly customError: boolean;
  readonly validationMessage: string;
}

// ✅ COMPLIANT: Option formatting function
export type PhaseOptionFormatter = (
  phase: Phase | BackendPhase,
  maxLength?: number
) => {
  readonly value: AnyPhaseId;
  readonly text: string;
  readonly selected: boolean;
};
```

### 4. Composable Return Types

```typescript
// ✅ COMPLIANT: Simplified composable interface
export interface UseNativePhaseSelectorReturn {
  readonly formattedOptions: ComputedRef<ReadonlyArray<NativePhaseOption>>;
  readonly selectedOption: ComputedRef<NativePhaseOption | undefined>;
  readonly fieldConfig: ComputedRef<PhaseFormField>;
  readonly handlers: {
    readonly onChange: (event: Event) => void;
    readonly onFocus: (event: FocusEvent) => void;
    readonly onBlur: (event: FocusEvent) => void;
  };
  readonly validation: ComputedRef<FormValidationResult>;
}
```

## Validation Plan (Human-Runnable)

### 1. Linting Validation

```bash
# Command: pnpm lint
# Expected: Zero linting errors
# Validates: ESLint rules, Vue component standards, TypeScript compliance

# New files must pass:
# - @typescript-eslint/no-explicit-any
# - @typescript-eslint/no-non-null-assertion
# - @typescript-eslint/no-unsafe-assignment
# - vue/component-definition-name-casing
# - vue/prop-name-casing
# - vue/require-prop-types (for native form props)
```

### 2. Type Checking Validation

```bash
# Command: pnpm typecheck
# Expected: Zero TypeScript errors
# Validates: Strict mode compliance, native form type safety

# Must validate:
# - Native HTMLSelectElement integration
# - Form event type safety
# - Option value type constraints
# - Label association type safety
# - Proper generic constraints for phase types
```

### 3. Test Suite Validation

```bash
# Command: pnpm test:run
# Expected: All tests pass, simplified test coverage
# Validates: Native form behavior, accessibility, integration

# Test Coverage Requirements:
# - NativePhaseSelector.spec.ts: 100% line coverage
# - useNativePhaseSelector.spec.ts: 100% line coverage
# - Form integration tests
# - Native accessibility tests
# - Mobile interaction simulation
# - Cross-browser form behavior
```

### 4. Build Validation

```bash
# Command: pnpm build
# Expected: Successful production build with reduced bundle size
# Validates: Bundle optimization, native form compilation

# Build Requirements:
# - No build errors or warnings
# - Bundle size reduction ≥80% for phase selection logic
# - Native form control optimization
# - CSS custom property compilation
# - TypeScript native form type compilation
```

### 5. Integration Testing Checklist

#### Manual Testing Requirements

```bash
# 1. Native Form Integration Test
# - Replace PhaseSelector with NativePhaseSelector
# - Verify identical functionality with native controls
# - Test form submission behavior
# - Validate mobile native selection interfaces

# 2. Cross-Browser Native Testing
# - Chrome: Native select styling and behavior
# - Firefox: Form control consistency
# - Safari: iOS native selection interface
# - Edge: Windows native form integration

# 3. Accessibility Testing (Enhanced)
# - Screen reader: Native announcements
# - Keyboard: Standard tab/arrow navigation
# - High contrast: Native form control support
# - Mobile: Native accessibility features

# 4. Performance Testing
# - Bundle size analysis (expect 80% reduction)
# - Form interaction performance
# - Native rendering performance
# - Memory usage validation
```

#### Automated Testing Coverage

```typescript
// NativePhaseSelector.spec.ts - Required test scenarios
describe("NativePhaseSelector", () => {
  // ✅ Native form rendering
  it("should render native select element");
  it("should generate proper option elements");
  it("should bind value with v-model");

  // ✅ Form integration
  it("should emit change events on selection");
  it("should support form validation attributes");
  it("should integrate with form submission");

  // ✅ Accessibility (Native)
  it("should have proper label association");
  it("should support native keyboard navigation");
  it("should announce selections to screen readers");

  // ✅ Mobile behavior
  it("should trigger native mobile selection UI");
  it("should handle touch interactions properly");

  // ✅ Edge cases
  it("should handle empty options gracefully");
  it("should validate option values");
  it("should support disabled state");
});
```

### 6. Migration Strategy

#### Phase 1: Parallel Implementation

```typescript
// Feature flag for gradual migration
const USE_NATIVE_SELECTOR = import.meta.env.VITE_USE_NATIVE_SELECTOR === "true";

// In Index.vue
<NativePhaseSelector v-if="USE_NATIVE_SELECTOR" />
<PhaseSelector v-else />
```

#### Phase 2: A/B Testing

```typescript
// Progressive rollout based on user preference
const preferNativeControls = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const useNativeSelector = preferNativeControls || Math.random() < 0.5;
```

#### Phase 3: Full Migration

```bash
# After validation, deprecate PhaseSelector
# Keep PhaseSelector.vue for rollback capability
# Update all imports to NativePhaseSelector
# Remove feature flag logic
```

### 7. Success Criteria Validation

#### Quantitative Metrics

```bash
# Bundle Size: 80%+ reduction in phase selection JavaScript
# Performance: Native form rendering performance
# Accessibility: Lighthouse score improvement
# Mobile: Native selection interface usage
```

#### Qualitative Metrics

```bash
# Code Review: Simplified implementation approval
# Design Review: Unified styling validation
# Accessibility Review: Native a11y compliance
# Mobile Review: Native mobile UX validation
```

### 8. Rollback Plan

#### Immediate Rollback

```typescript
// Simple component swap for immediate rollback
const USE_LEGACY_SELECTOR = true; // Emergency flag

<PhaseSelector v-if="USE_LEGACY_SELECTOR" />
<NativePhaseSelector v-else />
```

#### Gradual Rollback

```typescript
// User-preference based rollback
const userPrefersCustom =
  localStorage.getItem("prefer-custom-controls") === "true";
```

#### Complete Rollback

```bash
# Revert to PhaseSelector.vue
# Remove NativePhaseSelector files
# Restore original imports
# No data migration needed (same event interface)
```

---

**Implementation Status**: Ready for Development  
**Estimated Effort**: 4-6 story points (0.5 sprint)  
**Dependencies**: None (pure UI simplification)  
**Risk Level**: Very Low (native implementation, rollback available)  
**Key Benefits**: 80% code reduction, improved accessibility, unified design
