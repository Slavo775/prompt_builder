# RFC: Prompts as Selector/Dropdown Interface

**Version**: 1.0  
**Status**: Draft  
**Author**: Senior Frontend Developer  
**Created**: 2025-10-02  
**Related PRD**: [PRD_PROMPTS_AS_SELECTOR.md](./PRD_PROMPTS_AS_SELECTOR.md)

## Scope & Files (Allowlist)

### Files to be Modified

#### Component Files

```
apps/builder/src/components/PhaseSelector.vue          [NEW - Replace PhaseNavigation.vue]
apps/builder/src/components/PhaseNavigation.vue       [DELETE - After migration complete]
```

#### Composable Files

```
apps/builder/src/composables/usePhaseSelector.ts      [NEW - Dropdown logic]
```

#### Type Definition Files

```
apps/builder/src/types/index.ts                       [MODIFY - Add PhaseSelector types]
```

#### Parent Component Files

```
apps/builder/src/pages/Index.vue                      [MODIFY - Import PhaseSelector]
```

#### Test Files

```
apps/builder/src/components/__tests__/PhaseSelector.spec.ts     [NEW - Component tests]
apps/builder/src/composables/__tests__/usePhaseSelector.spec.ts [NEW - Composable tests]
```

#### Style Files

```
apps/builder/src/styles/index.scss                    [MODIFY - Add dropdown styles]
```

### Files NOT Modified

- All configuration files (DN-T list compliance)
- Existing composables (`usePhases`, `useViewAwarePhases`, etc.)
- Phase configuration files
- Global state management
- localStorage persistence logic

## Zero-Infra-Change Plan

### Current Architecture Compatibility

#### 1. Vue 3 Composition API Integration

**Current Pattern**: All components use `<script setup>` with TypeScript
**Adaptation Strategy**:

- PhaseSelector will follow identical pattern
- Reuse existing reactive patterns and computed properties
- Maintain prop/emit interfaces for seamless integration

#### 2. TypeScript Strict Mode Compliance

**Current Standard**: `tsconfig.json` enforces strict mode
**Adaptation Strategy**:

- All new types will be precisely defined
- No `any`, `unknown`, or non-null assertion operators
- Exhaustive union types for all enums
- Proper generic constraints and type guards

#### 3. SCSS/BEM Styling Integration

**Current Pattern**: BEM methodology with scoped styles
**Adaptation Strategy**:

- Reuse existing CSS custom properties and design tokens
- Follow `.phase-selector__element--modifier` naming convention
- Leverage existing color palette and spacing variables

#### 4. Testing Framework Integration

**Current Setup**: Vitest + @testing-library/vue + jsdom
**Adaptation Strategy**:

- Follow existing test patterns from `PhaseInputs.spec.ts`
- Use component mocking for child components
- Maintain 100% test coverage for new components

#### 5. Accessibility Framework Integration

**Current Standard**: ARIA attributes and keyboard navigation
**Adaptation Strategy**:

- Implement WCAG 2.1 AA compliance
- Use existing screen reader patterns
- Leverage `axe-core` for automated a11y testing

### Existing Composable Reuse Strategy

#### 1. Phase Management (`useViewAwarePhases`)

```typescript
// Current usage in Index.vue - NO CHANGES
const {phasesList, currentPhaseId, handlePhaseChange} = useViewAwarePhases();

// PhaseSelector will consume identical interface
<PhaseSelector
  :phases-list="phasesList"
  :current-phase-id="currentPhaseId"
  @phase-change="handlePhaseChange"
/>
```

#### 2. Validation Integration (`useValidation`)

```typescript
// PhaseSelector will NOT modify validation logic
// Existing validation composable remains unchanged
// Phase switching validation handled by parent components
```

#### 3. Local Storage Integration (`useLocalStorage`)

```typescript
// NO CHANGES to persistence layer
// PhaseSelector emits same events as PhaseNavigation
// Parent components handle state persistence identically
```

### Event Interface Compatibility

#### Current PhaseNavigation Interface

```typescript
// EXACT SAME interface maintained
interface PhaseNavigationProps {
  phasesList: (Phase | BackendPhase)[];
  currentPhaseId: AnyPhaseId;
  viewType?: ViewType;
}

interface PhaseNavigationEmits {
  "phase-change": [phaseId: AnyPhaseId];
}
```

#### PhaseSelector Interface (Drop-in Replacement)

```typescript
// IDENTICAL interface - zero breaking changes
interface PhaseSelectorProps {
  phasesList: (Phase | BackendPhase)[];
  currentPhaseId: AnyPhaseId;
  viewType?: ViewType;
  // Optional new props for enhanced functionality
  disabled?: boolean;
  "aria-label"?: string;
}

interface PhaseSelectorEmits {
  "phase-change": [phaseId: AnyPhaseId];
  // Optional new events for analytics
  "dropdown-open"?: [];
  "dropdown-close"?: [];
}
```

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### 1. Jest-Axe Integration for A11y Testing

**Rationale**: Automated accessibility testing for dropdown component
**Risk**: Low - additive dependency only
**Benefit**: Prevents accessibility regressions

```diff
// package.json (PROPOSAL ONLY - NOT TO BE APPLIED)
{
  "devDependencies": {
+   "jest-axe": "^8.0.0",
    "axe-core": "^4.10.3"
  }
}
```

```diff
// vitest.config.ts (PROPOSAL ONLY - NOT TO BE APPLIED)
export default defineConfig({
  test: {
    environment: "jsdom",
-   setupFiles: ["./apps/builder/src/__tests__/setup.ts"],
+   setupFiles: [
+     "./apps/builder/src/__tests__/setup.ts",
+     "./apps/builder/src/__tests__/axe-setup.ts"
+   ],
    globals: true,
  },
});
```

### 2. CSS Custom Properties Enhancement

**Rationale**: Centralized design tokens for dropdown theming
**Risk**: Very Low - CSS-only changes
**Benefit**: Consistent theming and easier maintenance

```diff
// apps/builder/src/styles/index.scss (PROPOSAL ONLY - NOT TO BE APPLIED)
:root {
  /* Existing variables... */
+
+ /* Dropdown-specific design tokens */
+ --dropdown-trigger-padding: 0.75rem;
+ --dropdown-border-radius: 0.375rem;
+ --dropdown-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
+ --dropdown-max-height: 16rem;
+ --dropdown-z-index: 50;
}
```

### 3. Bundle Size Monitoring

**Rationale**: Track bundle impact of new dropdown component
**Risk**: Low - development-only tooling
**Benefit**: Performance monitoring and optimization

```diff
// vite.config.ts (PROPOSAL ONLY - NOT TO BE APPLIED)
export default defineConfig({
  plugins: [vue()],
+ build: {
+   rollupOptions: {
+     output: {
+       manualChunks: {
+         'phase-selector': ['./src/components/PhaseSelector.vue']
+       }
+     }
+   }
+ }
});
```

## Type Guarantees

### 1. Strict TypeScript Compliance

All new types follow repository standards:

```typescript
// ✅ COMPLIANT: Precise union types
export type DropdownPlacement = "top" | "bottom";
export type DropdownState = "closed" | "opening" | "open" | "closing";

// ✅ COMPLIANT: Exhaustive interfaces
export interface PhaseOption {
  readonly id: AnyPhaseId;
  readonly label: string;
  readonly title: string;
  readonly selected: boolean;
  readonly disabled: boolean;
}

// ✅ COMPLIANT: Generic constraints
export interface DropdownConfig<T extends string = string> {
  readonly placement: DropdownPlacement;
  readonly maxHeight: number;
  readonly itemHeight: number;
  readonly searchable: boolean;
}

// ❌ FORBIDDEN: No any, unknown, or non-null assertions
// export interface BadExample {
//   data: any;                    // ❌ Forbidden
//   value: unknown;               // ❌ Forbidden
//   element: HTMLElement!;        // ❌ Forbidden
// }
```

### 2. Exhaustive Union Handling

```typescript
// ✅ COMPLIANT: Exhaustive switch with never check
function getDropdownAriaLabel(state: DropdownState): string {
  switch (state) {
    case "closed":
      return "Select phase";
    case "opening":
    case "open":
      return "Phase selector expanded";
    case "closing":
      return "Phase selector collapsing";
    default:
      // TypeScript ensures this is never reached
      const _exhaustive: never = state;
      throw new Error(`Unhandled dropdown state: ${_exhaustive}`);
  }
}
```

### 3. Precise Event Types

```typescript
// ✅ COMPLIANT: Strongly typed event handlers
export interface KeyboardHandlers {
  readonly onArrowDown: (event: KeyboardEvent) => void;
  readonly onArrowUp: (event: KeyboardEvent) => void;
  readonly onEnter: (event: KeyboardEvent) => void;
  readonly onEscape: (event: KeyboardEvent) => void;
  readonly onTab: (event: KeyboardEvent) => void;
}

// ✅ COMPLIANT: Precise component props
export interface PhaseSelectorProps {
  readonly phasesList: ReadonlyArray<Phase | BackendPhase>;
  readonly currentPhaseId: AnyPhaseId;
  readonly viewType?: ViewType;
  readonly disabled?: boolean;
  readonly "aria-label"?: string;
  readonly class?: string;
}
```

### 4. Type Guards and Validation

```typescript
// ✅ COMPLIANT: Runtime type validation
export function isValidPhaseId(value: unknown): value is AnyPhaseId {
  return (
    typeof value === "string" && (isPhaseId(value) || isBackendPhaseId(value))
  );
}

export function assertPhaseOption(
  value: unknown
): asserts value is PhaseOption {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid phase option: not an object");
  }

  const option = value as Record<string, unknown>;

  if (!isValidPhaseId(option.id)) {
    throw new Error(`Invalid phase option: invalid id ${option.id}`);
  }

  if (typeof option.label !== "string") {
    throw new Error("Invalid phase option: label must be string");
  }
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
```

### 2. Type Checking Validation

```bash
# Command: pnpm typecheck
# Expected: Zero TypeScript errors
# Validates: Strict mode compliance, type safety, interface compatibility

# Must validate:
# - All new interfaces compile without errors
# - No implicit any types
# - Exhaustive union type checking
# - Proper generic constraints
# - Component prop type safety
```

### 3. Test Suite Validation

```bash
# Command: pnpm test:run
# Expected: All tests pass, coverage maintained
# Validates: Component behavior, accessibility, integration

# Test Coverage Requirements:
# - PhaseSelector.spec.ts: 100% line coverage
# - usePhaseSelector.spec.ts: 100% line coverage
# - Integration tests with existing components
# - Accessibility tests with jest-axe
# - Keyboard navigation tests
# - Mobile interaction tests
```

### 4. Build Validation

```bash
# Command: pnpm build
# Expected: Successful production build
# Validates: Bundle integrity, tree-shaking, optimization

# Build Requirements:
# - No build errors or warnings
# - Bundle size increase <3KB
# - Proper tree-shaking of unused code
# - CSS optimization and minification
# - TypeScript compilation success
```

### 5. Integration Testing Checklist

#### Manual Testing Requirements

```bash
# 1. Component Replacement Test
# - Replace PhaseNavigation with PhaseSelector in Index.vue
# - Verify identical functionality
# - Test all phase switching scenarios
# - Validate view-aware behavior (frontend/backend)

# 2. Accessibility Testing
# - Screen reader navigation (VoiceOver/NVDA)
# - Keyboard-only navigation
# - High contrast mode compatibility
# - Focus management validation

# 3. Cross-Browser Testing
# - Chrome 90+ (desktop/mobile)
# - Firefox 88+ (desktop/mobile)
# - Safari 14+ (desktop/mobile)
# - Edge 90+ (desktop)

# 4. Performance Testing
# - Bundle size analysis
# - Runtime performance profiling
# - Memory usage validation
# - Interaction responsiveness
```

#### Automated Testing Coverage

```typescript
// PhaseSelector.spec.ts - Required test scenarios
describe("PhaseSelector", () => {
  // ✅ Component rendering and props
  it("should render with correct props");
  it("should display current phase in trigger");
  it("should show phase options in dropdown");

  // ✅ User interactions
  it("should open dropdown on trigger click");
  it("should close dropdown on outside click");
  it("should select phase on option click");

  // ✅ Keyboard navigation
  it("should handle arrow key navigation");
  it("should select on Enter key");
  it("should close on Escape key");

  // ✅ Accessibility
  it("should have proper ARIA attributes");
  it("should announce phase changes");
  it("should pass axe accessibility tests");

  // ✅ Edge cases
  it("should handle empty phases list");
  it("should handle invalid current phase");
  it("should handle disabled state");
});
```

### 6. Rollback Plan

#### Phase 1: Feature Flag Implementation

```typescript
// Temporary feature flag for gradual rollout
const USE_PHASE_SELECTOR = import.meta.env.VITE_USE_PHASE_SELECTOR === "true";

// In Index.vue
<PhaseSelector v-if="USE_PHASE_SELECTOR" />
<PhaseNavigation v-else />
```

#### Phase 2: A/B Testing

```typescript
// User-based rollout for validation
const shouldUsePhaseSelector = (userId: string) => {
  return parseInt(userId.slice(-1), 16) % 2 === 0; // 50% rollout
};
```

#### Phase 3: Full Migration

```bash
# After validation, remove PhaseNavigation completely
rm apps/builder/src/components/PhaseNavigation.vue
# Update all imports to PhaseSelector
# Remove feature flag logic
```

### 7. Success Criteria Validation

#### Quantitative Metrics

```bash
# Bundle Size: <3KB increase
# Performance: No regression in Core Web Vitals
# Accessibility: Lighthouse score maintains 100
# Test Coverage: 100% for new components
```

#### Qualitative Metrics

```bash
# Code Review: Senior developer approval
# Design Review: UI/UX team approval
# Accessibility Review: A11y specialist approval
# Product Review: Product manager acceptance
```

---

**Implementation Status**: Ready for Development  
**Estimated Effort**: 8-12 story points (1 sprint)  
**Dependencies**: None (pure UI enhancement)  
**Risk Level**: Low (non-breaking change with rollback plan)
