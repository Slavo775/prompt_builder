# RFC: Split Frontend and Backend Views Implementation Plan

## Scope & Files (Allowlist)

### Files to be Modified (App Code Only)

#### Core Application Files

```
apps/builder/src/types/index.ts                    # Add view-aware types
apps/builder/src/pages/Index.vue                   # Add tab navigation
apps/builder/src/App.vue                           # Update to handle view context
```

#### New Components

```
apps/builder/src/components/TabNavigation.vue      # New tab navigation component
apps/builder/src/components/ViewContainer.vue      # New view wrapper component
```

#### Enhanced Components

```
apps/builder/src/components/AppHeader.vue          # Add view-aware export/import
apps/builder/src/components/PhaseNavigation.vue    # Add view context support
apps/builder/src/components/PhaseView.vue          # Add view-aware phase handling
apps/builder/src/components/GlobalInputs.vue       # Ensure shared across views
```

#### New Composables

```
apps/builder/src/composables/useViewManagement.ts  # View switching logic
apps/builder/src/composables/useViewAwarePhases.ts # View-specific phase management
apps/builder/src/composables/useTabNavigation.ts   # Tab navigation logic
```

#### Enhanced Composables

```
apps/builder/src/composables/useLocalStorage.ts    # Add view-aware storage
apps/builder/src/composables/usePhases.ts          # Add view context parameter
apps/builder/src/composables/usePhaseConfig.ts     # Add backend phase support
```

#### Configuration Files

```
apps/builder/src/config/index.ts                   # Add backend phase configs
apps/builder/src/config/types.ts                   # Add backend phase types
apps/builder/src/config/phases/backend-phase-0.ts  # New backend phase 0
apps/builder/src/config/phases/backend-phase-1.ts  # New backend phase 1
apps/builder/src/config/phases/backend-phase-2.ts  # New backend phase 2
apps/builder/src/config/phases/backend-phase-3.ts  # New backend phase 3
```

#### Utility Files

```
apps/builder/src/utils/viewHelpers.ts              # New view utility functions
```

#### Test Files

```
apps/builder/src/__tests__/useViewManagement.spec.ts
apps/builder/src/__tests__/useViewAwarePhases.spec.ts
apps/builder/src/__tests__/useTabNavigation.spec.ts
apps/builder/src/components/__tests__/TabNavigation.spec.ts
apps/builder/src/components/__tests__/ViewContainer.spec.ts
```

#### Style Files

```
apps/builder/src/styles/index.scss                 # Add tab navigation styles
```

### Files NOT to be Modified (DN-T Compliance)

- `package.json` - No new dependencies
- `pnpm-lock.yaml` - No dependency changes
- `tsconfig*.json` - No TypeScript config changes
- `vite.config.ts` - No build config changes
- `eslint.config.js` - No linting config changes
- `.gitignore` - No git config changes
- Any other configuration or infrastructure files

## Zero-Infra-Change Plan

### Current Infrastructure Utilization

#### TypeScript Configuration

**Current**: Strict TypeScript with no `any`, `unknown`, or non-null assertions
**Strategy**: Leverage existing strict typing for all new view-aware types
**Implementation**:

- Extend existing interfaces with view context
- Use discriminated unions for view-specific types
- Maintain exhaustive type checking for all new enums

#### Vue 3 Composition API

**Current**: Composable-based architecture with reactive state management
**Strategy**: Extend existing composables with view awareness
**Implementation**:

- Add optional `viewType` parameter to existing composables
- Create view-specific composables that wrap existing ones
- Maintain backward compatibility through default parameters

#### SCSS Styling System

**Current**: BEM methodology with component-scoped styles
**Strategy**: Extend existing styling patterns for tab navigation
**Implementation**:

- Add `.tab-navigation` BEM block to existing styles
- Reuse existing color variables and spacing tokens
- Follow existing responsive design patterns

#### Vitest Testing Framework

**Current**: Component and composable testing with @testing-library/vue
**Strategy**: Extend existing test patterns for view-aware components
**Implementation**:

- Use existing test utilities and setup
- Add view context to existing component tests
- Create new test files following existing naming conventions

#### LocalStorage Persistence

**Current**: JSON-based localStorage with migration support
**Strategy**: Extend existing storage schema with view separation
**Implementation**:

- Nest current data under `views.frontend` key
- Add `views.backend` for backend-specific data
- Maintain backward compatibility with migration function

### Adapter/Shim Strategies

#### Backward Compatibility Shims

```typescript
// In usePhases.ts - maintain existing API
export function usePhases(
  phases: PhaseMap,
  globalInputs: GlobalInputs,
  viewType: ViewType = "frontend"
) {
  // Existing implementation with optional view context
}

// In useLocalStorage.ts - data migration
function migrateToViewAwareStorage(
  legacyData: PhaseBuilderState
): ViewAwarePhaseBuilderState {
  return {
    currentView: "frontend",
    views: {
      frontend: {
        phases: legacyData.phases,
        currentPhaseId: legacyData.currentPhaseId,
        lastModified: new Date().toISOString(),
      },
      backend: {
        phases: {},
        currentPhaseId: "backend-0",
        lastModified: new Date().toISOString(),
      },
    },
    globalInputs: legacyData.globalInputs,
  };
}
```

#### Component Wrapper Strategy

```typescript
// ViewContainer.vue - wraps existing components with view context
<template>
  <div class="view-container" :data-view="currentView">
    <slot :view-type="currentView" :view-state="currentViewState" />
  </div>
</template>
```

#### Phase Configuration Extension

```typescript
// Extend existing phase config system
export const BACKEND_PHASE_CONFIGS: Record<BackendPhaseId, BackendPhaseConfig> =
  {
    "backend-0": BACKEND_PHASE_0_CONFIG,
    "backend-1": BACKEND_PHASE_1_CONFIG,
    "backend-2": BACKEND_PHASE_2_CONFIG,
    "backend-3": BACKEND_PHASE_3_CONFIG,
  };

// Unified config access
export function getPhaseConfig(
  id: PhaseId | BackendPhaseId
): PhaseConfig | BackendPhaseConfig {
  if (id.startsWith("backend-")) {
    return BACKEND_PHASE_CONFIGS[id as BackendPhaseId];
  }
  return PHASE_CONFIGS[id as PhaseId];
}
```

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### 1. Bundle Optimization for View Splitting

**Rationale**: With dual views, bundle size may increase. Code splitting could improve performance.

**Minimal Diff Snippet** (NOT to be applied):

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "frontend-phases": [
            "src/config/phases/phase-0.ts",
            "src/config/phases/phase-1.ts",
          ],
          "backend-phases": [
            "src/config/phases/backend-phase-0.ts",
            "src/config/phases/backend-phase-1.ts",
          ],
        },
      },
    },
  },
});
```

**Risk**: Requires build configuration changes (DN-T violation)
**Benefit**: Reduced initial bundle size, faster loading for single-view users
**Decision**: Defer to future RFC if performance issues arise

### 2. Enhanced TypeScript Configuration for View Safety

**Rationale**: Additional type checking for view-specific code paths.

**Minimal Diff Snippet** (NOT to be applied):

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/views/*": ["src/views/*"],
      "@/backend/*": ["src/config/phases/backend-*"]
    }
  }
}
```

**Risk**: Requires TypeScript configuration changes (DN-T violation)
**Benefit**: Better IDE support and type safety for view-specific imports
**Decision**: Use relative imports instead, maintain current path resolution

### 3. ESLint Rules for View Consistency

**Rationale**: Enforce consistent patterns across frontend and backend views.

**Minimal Diff Snippet** (NOT to be applied):

```javascript
// eslint.config.js
{
  rules: {
    "custom/view-type-consistency": "error",
    "custom/backend-phase-naming": "error"
  }
}
```

**Risk**: Requires ESLint configuration changes (DN-T violation)
**Benefit**: Automated enforcement of view-specific coding patterns
**Decision**: Use code review and documentation instead

## Type Guarantees

### Strict TypeScript Compliance

#### No Forbidden Types

```typescript
// ✅ Allowed - Precise typing
export interface ViewAwarePhaseBuilderState {
  currentView: ViewType;
  views: Record<ViewType, ViewState>;
  globalInputs: GlobalInputs;
}

// ❌ Forbidden - No any
export interface BadState {
  data: any; // NEVER
}

// ❌ Forbidden - No unknown
export interface BadUnknown {
  payload: unknown; // NEVER
}

// ❌ Forbidden - No non-null assertion
const viewState = getViewState()!; // NEVER

// ❌ Forbidden - No as any
const data = response as any; // NEVER
```

#### Exhaustive Union Types

```typescript
// ✅ Exhaustive view type handling
export type ViewType = "frontend" | "backend";

export function switchView(viewType: ViewType): void {
  switch (viewType) {
    case "frontend":
      // Handle frontend
      break;
    case "backend":
      // Handle backend
      break;
    // No default case needed - TypeScript ensures exhaustiveness
  }
}

// ✅ Exhaustive backend phase handling
export type BackendPhaseId =
  | "backend-0"
  | "backend-1"
  | "backend-2"
  | "backend-3";

export function getBackendPhaseTitle(id: BackendPhaseId): string {
  switch (id) {
    case "backend-0":
      return "API Design & Documentation";
    case "backend-1":
      return "Database Schema & Data Modeling";
    case "backend-2":
      return "Business Logic & Service Architecture";
    case "backend-3":
      return "System Architecture & Performance";
  }
}
```

#### Precise Exported Types

```typescript
// ✅ All public APIs have precise types
export interface TabNavigationProps {
  readonly currentView: ViewType;
  readonly disabled?: boolean;
  readonly "aria-label"?: string;
}

export interface TabNavigationEvents {
  readonly "view-change": [viewType: ViewType];
}

// ✅ Component props are strictly typed
export interface ViewContainerProps {
  readonly viewType: ViewType;
  readonly viewState: ViewState;
  readonly disabled?: boolean;
}

// ✅ Composable return types are complete
export interface UseViewManagementReturn {
  readonly currentView: Ref<ViewType>;
  readonly viewStates: ComputedRef<Record<ViewType, ViewState>>;
  readonly switchView: (viewType: ViewType) => void;
  readonly getCurrentViewState: () => ViewState;
  readonly updateCurrentViewState: (updates: Partial<ViewState>) => void;
  readonly hasUnsavedChanges: ComputedRef<boolean>;
}
```

#### Type Guards and Validation

```typescript
// ✅ Runtime type validation
export function isViewType(value: unknown): value is ViewType {
  return typeof value === "string" && ["frontend", "backend"].includes(value);
}

export function isBackendPhaseId(value: unknown): value is BackendPhaseId {
  return (
    typeof value === "string" &&
    value.startsWith("backend-") &&
    ["backend-0", "backend-1", "backend-2", "backend-3"].includes(value)
  );
}

// ✅ Safe type narrowing
export function getViewSpecificData(
  viewType: ViewType,
  data: ViewAwarePhaseBuilderState
): ViewState {
  if (!isViewType(viewType)) {
    throw new Error(`Invalid view type: ${viewType}`);
  }
  return data.views[viewType];
}
```

### Component Type Safety

#### Vue Component Props

```typescript
// ✅ Strict component prop typing
export interface TabNavigationProps {
  currentView: ViewType;
  disabled?: boolean;
  "aria-label"?: string;
}

// Component definition with strict props
export default defineComponent({
  props: {
    currentView: {
      type: String as PropType<ViewType>,
      required: true,
      validator: (value: string): value is ViewType => isViewType(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    "aria-label": {
      type: String,
      required: false,
    },
  },
});
```

#### Event Type Safety

```typescript
// ✅ Strictly typed events
export interface ViewChangeEvent {
  type: "view_change";
  previousView: ViewType;
  currentView: ViewType;
  timestamp: number;
}

// Component emit definitions
defineEmits<{
  "view-change": [viewType: ViewType];
  "phase-change": [phaseId: PhaseId | BackendPhaseId];
}>();
```

## Validation Plan (Human-Runnable)

### Pre-Implementation Validation

```bash
# Ensure clean starting state
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Development Phase Validation

#### After Each Component Implementation

```bash
# Type safety validation
pnpm typecheck

# Code quality validation
pnpm lint

# Unit test validation
pnpm test src/components/__tests__/TabNavigation.spec.ts
pnpm test src/components/__tests__/ViewContainer.spec.ts
```

#### After Each Composable Implementation

```bash
# Type safety validation
pnpm typecheck

# Unit test validation
pnpm test src/__tests__/useViewManagement.spec.ts
pnpm test src/__tests__/useViewAwarePhases.spec.ts
pnpm test src/__tests__/useTabNavigation.spec.ts
```

#### After Backend Phase Configuration

```bash
# Type safety validation
pnpm typecheck

# Configuration validation
pnpm test src/config/__tests__/backendPhases.spec.ts
```

### Integration Validation

#### After View Integration

```bash
# Full type checking
pnpm typecheck

# All tests pass
pnpm test

# No linting errors
pnpm lint

# Application builds successfully
pnpm build
```

#### Accessibility Validation

```bash
# Run accessibility tests
pnpm test -- --grep "accessibility"

# Manual testing checklist:
# - Tab navigation works with keyboard
# - Screen reader announces view changes
# - Focus management is correct
# - ARIA labels are present
```

### Final Validation Commands

#### Complete Test Suite

```bash
# All tests must pass
pnpm test

# Coverage should remain above 80%
pnpm test -- --coverage

# No type errors
pnpm typecheck

# No linting errors or warnings
pnpm lint

# Production build succeeds
pnpm build

# Bundle size analysis (optional)
pnpm build -- --analyze
```

#### Manual Testing Scenarios

1. **Tab Navigation**: Switch between frontend and backend views
2. **State Preservation**: Verify phase selection is preserved per view
3. **Global Inputs**: Confirm shared inputs work across views
4. **Export/Import**: Test data export includes both views
5. **Backward Compatibility**: Import old format data works correctly
6. **Accessibility**: Test with screen reader and keyboard navigation
7. **Performance**: Verify view switching is under 100ms

### Continuous Validation During Development

#### Git Pre-commit Hooks (if available)

```bash
# These should pass before each commit
pnpm lint
pnpm typecheck
pnpm test -- --run
```

#### Development Server Validation

```bash
# Start development server
pnpm dev

# Verify in browser:
# - No console errors
# - Tab switching works
# - All existing functionality preserved
# - New backend phases load correctly
```

### Error Handling Validation

#### Edge Cases to Test

1. **Invalid View Type**: Handle unknown view types gracefully
2. **Missing Backend Data**: Handle missing backend phase data
3. **Corrupted LocalStorage**: Handle corrupted view data
4. **Import Validation**: Handle invalid import data format
5. **Network Issues**: Handle any async operations gracefully

#### Error Recovery Testing

```bash
# Test error boundaries and recovery
pnpm test src/__tests__/errorHandling.spec.ts

# Test data migration edge cases
pnpm test src/__tests__/dataMigration.spec.ts
```

---

**RFC Version**: 1.0  
**Created**: 2025-10-02  
**Status**: Ready for Implementation  
**Author**: Senior Frontend Developer  
**Reviewers**: Engineering Team, Product Manager
