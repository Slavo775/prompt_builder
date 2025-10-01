# RFC: Configuration Validation Implementation

## Scope & Files (Allowlist)

### Files to be Modified (App Code, Tests, Docs ONLY)

**New Configuration Files:**

- `config/phases/phase-0.ts` - Phase 0 configuration
- `config/phases/phase-1.ts` - Phase 1 configuration
- `config/phases/phase-2.ts` - Phase 2 configuration
- `config/phases/phase-2.5.ts` - Phase 2.5 configuration
- `config/phases/phase-3.ts` - Phase 3 configuration
- `config/phases/phase-4.ts` - Phase 4 configuration
- `config/types.ts` - Validation and configuration types
- `config/index.ts` - Configuration exports

**New Utility Files:**

- `apps/builder/src/utils/tokenParser.ts` - Token parsing logic
- `apps/builder/src/utils/validation.ts` - Validation utilities
- `apps/builder/src/composables/useValidation.ts` - Validation composable
- `apps/builder/src/composables/usePhaseConfig.ts` - Configuration composable

**Modified Application Files:**

- `apps/builder/src/components/GlobalInputs.vue` - Add validation UI
- `apps/builder/src/components/PhaseInputs.vue` - Add validation UI
- `apps/builder/src/components/PhaseView.vue` - Pass validation props
- `apps/builder/src/pages/Index.vue` - Pass validation props
- `apps/builder/src/composables/usePhases.ts` - Integrate config system

**New Test Files:**

- `apps/builder/src/__tests__/tokenParser.spec.ts` - Token parsing tests
- `apps/builder/src/__tests__/validation.spec.ts` - Validation logic tests
- `apps/builder/src/__tests__/useValidation.spec.ts` - Validation composable tests
- `apps/builder/src/components/__tests__/GlobalInputs.spec.ts` - Component tests
- `apps/builder/src/components/__tests__/PhaseInputs.spec.ts` - Component tests

**Documentation Files:**

- `PRD_CONFIG_VALIDATION.md` - Product requirements
- `COMPREHENSIVE_ANALYSIS.md` - System analysis
- `REPO_CONSTRAINTS.md` - Repository constraints

## Zero-Infra-Change Plan

### Current Toolchain Integration

**ESLint Configuration:**

- Use existing `eslint.config.js` without modification
- Follow existing Vue.js and TypeScript rules
- No additional ESLint plugins or configurations needed

**TypeScript Configuration:**

- Use existing `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- No path mapping changes required
- Maintain strict type checking standards

**Vite Build System:**

- Use existing `vite.config.ts` without modification
- No additional plugins or configurations needed
- Build process remains unchanged

**Testing Framework:**

- Use existing Vitest configuration from `vitest.config.ts`
- Leverage existing `@testing-library/vue` setup
- Add `jest-axe` for accessibility testing (already in dependencies)

**Styling:**

- Use existing SCSS setup in `apps/builder/src/styles/index.scss`
- No additional styling frameworks or configurations
- Maintain existing CSS architecture

### Adapter/Shim Strategies

**Module Resolution Strategy:**

```typescript
// Use relative imports from apps/builder/src to config/
import type {PhaseConfig} from "../../../config/types";
import {PHASE_CONFIGS} from "../../../config";
```

**Type Safety Adapters:**

```typescript
// Create type-safe adapters for existing interfaces
interface GlobalInputsAdapter extends Record<string, string> {
  projectName: string;
  featureName: string;
  featureSlug: string;
  owner: string;
  repoUrl?: string;
  stack: string;
  dateIso: string;
}
```

**Validation Integration:**

```typescript
// Integrate with existing Vue composition API
export function useValidation(
  template: string,
  globalInputs: GlobalInputs,
  phaseInputs: Record<string, string>
): UseValidationReturn {
  // Reactive validation state
}
```

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

### 1. TypeScript Path Mapping (PROPOSAL ONLY)

**Rationale:** Simplify import paths and reduce relative path complexity.

**Minimal Diff Snippet (NOT to be applied):**

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/config/*": ["../../config/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

**Risk/Benefit:**

- ✅ Benefit: Cleaner imports, better maintainability
- ⚠️ Risk: Requires build system changes (REJECTED - violates DN-T constraint)

### 2. ESLint Vue Template Parser (PROPOSAL ONLY)

**Rationale:** Fix Vue template parsing errors in ESLint.

**Minimal Diff Snippet (NOT to be applied):**

```javascript
// eslint.config.js
export default [
  // ... existing config
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        parser: tsparser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
];
```

**Risk/Benefit:**

- ✅ Benefit: Fixes Vue template linting errors
- ⚠️ Risk: Modifies DN-T file (REJECTED - violates constraint)

### 3. Vitest Mock Configuration (PROPOSAL ONLY)

**Rationale:** Improve test mocking for better isolation.

**Minimal Diff Snippet (NOT to be applied):**

```typescript
// vitest.config.ts
export default defineConfig({
  // ... existing config
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./apps/builder/src/__tests__/setup.ts"],
  },
});
```

**Risk/Benefit:**

- ✅ Benefit: Better test isolation and mocking
- ⚠️ Risk: Modifies DN-T file (REJECTED - violates constraint)

## Type Guarantees

### Strict TypeScript Rules

**No Forbidden Types:**

```typescript
// ❌ FORBIDDEN
const value: any = getValue();
const result: unknown = processData();
const element = document.getElementById("test")!;
const casted = data as any;

// ✅ REQUIRED
const value: string = getValue();
const result: ProcessedData = processData();
const element = document.getElementById("test");
if (element) {
  /* safe usage */
}
const casted = data as ProcessedData;
```

**Exhaustive Union Types:**

```typescript
// ✅ REQUIRED - Exhaustive unions
type ValidationStatus = "idle" | "validating" | "valid" | "invalid" | "error";

type PhaseId = "0" | "1" | "2" | "2.5" | "3" | "4";
```

**Precise Exported Types:**

```typescript
// ✅ REQUIRED - Precise component props
export interface ValidatedInputProps {
  modelValue: string;
  isValid: boolean;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  "aria-describedby"?: string;
}

// ✅ REQUIRED - Composable return types
export interface UseValidationReturn {
  validationState: ComputedRef<ValidationState>;
  validateInput: (field: string, value: string) => ValidationError[];
  validateAll: () => ValidationState;
  clearValidation: (field?: string) => void;
}
```

### Type Safety Implementation

**Generic Type Constraints:**

```typescript
// ✅ REQUIRED - Generic constraints
function createValidationError<T extends ValidationErrorType>(
  field: string,
  token: string,
  message: string,
  type: T
): ValidationError & {type: T} {
  return {field, token, message, type};
}
```

**Utility Types:**

```typescript
// ✅ REQUIRED - Utility types
type RequiredFields<T> = {
  [K in keyof T]-?: T[K];
};

type ValidationResult<T> = {
  isValid: boolean;
  errors: ValidationError[];
  data?: T;
};
```

## Validation Plan (Human-Runnable)

### Pre-Implementation Checklist

1. **Verify Current State:**

   ```bash
   cd /Users/ssedlak/Documents/personal_projects/prompt_builder
   npm run lint
   npm run typecheck
   npm run test:run
   npm run build
   ```

2. **Create Configuration Structure:**

   ```bash
   mkdir -p config/phases
   touch config/types.ts
   touch config/index.ts
   ```

3. **Create Utility Structure:**
   ```bash
   mkdir -p apps/builder/src/utils
   mkdir -p apps/builder/src/composables
   ```

### Implementation Steps

1. **Phase 1: Core Types and Configuration**

   - Create `config/types.ts` with all validation interfaces
   - Create `config/phases/phase-*.ts` files with phase configurations
   - Create `config/index.ts` with exports

2. **Phase 2: Utility Functions**

   - Create `apps/builder/src/utils/tokenParser.ts`
   - Create `apps/builder/src/utils/validation.ts`
   - Implement token parsing and validation logic

3. **Phase 3: Vue Composables**

   - Create `apps/builder/src/composables/useValidation.ts`
   - Create `apps/builder/src/composables/usePhaseConfig.ts`
   - Implement reactive validation state

4. **Phase 4: Component Integration**

   - Update `GlobalInputs.vue` with validation UI
   - Update `PhaseInputs.vue` with validation UI
   - Update parent components to pass validation props

5. **Phase 5: Testing**
   - Create unit tests for all utility functions
   - Create component tests with proper mocking
   - Add accessibility tests with jest-axe

### Validation Commands

**After Each Implementation Phase:**

```bash
# Type checking
npm run typecheck

# Linting (will show Vue template errors - expected)
npm run lint

# Testing
npm run test:run

# Build verification
npm run build
```

**Final Validation:**

```bash
# Complete validation suite
npm run lint && npm run typecheck && npm run test:run && npm run build
```

### Expected Outcomes

**TypeScript Compilation:**

- ✅ Zero TypeScript errors
- ✅ All imports resolve correctly
- ✅ Strict type checking passes

**ESLint Validation:**

- ⚠️ Vue template parsing errors (expected - cannot modify DN-T files)
- ✅ All TypeScript/JavaScript linting passes
- ✅ No unused variables or imports

**Test Suite:**

- ✅ All unit tests pass
- ✅ All component tests pass
- ✅ Accessibility tests with jest-axe pass

**Build Process:**

- ✅ Successful TypeScript compilation
- ✅ Successful Vite build
- ✅ All assets generated correctly

## Risk Mitigation

### High-Risk Areas

1. **Module Resolution Issues**

   - Risk: Import path failures
   - Mitigation: Use relative paths, test imports early

2. **Type Safety Violations**

   - Risk: Implicit any types
   - Mitigation: Explicit type annotations, strict checking

3. **Test Mocking Complexity**

   - Risk: Component test failures
   - Mitigation: Simple mock strategies, avoid complex mocking

4. **Vue Template Linting**
   - Risk: ESLint Vue template errors
   - Mitigation: Accept as known limitation, focus on TS/JS linting

### Rollback Strategy

If implementation fails:

1. Remove all new files
2. Revert component modifications
3. Restore original functionality
4. Document lessons learned for future RFC

## Success Criteria

### Functional Requirements

- ✅ Configuration-driven phase templates
- ✅ Real-time input validation with visual feedback
- ✅ Token analysis and validation logic
- ✅ Accessible error messaging

### Technical Requirements

- ✅ Zero TypeScript compilation errors
- ✅ All tests passing
- ✅ No DN-T file modifications
- ✅ Strict type safety maintained

### Quality Requirements

- ✅ Comprehensive test coverage
- ✅ Accessibility compliance
- ✅ Clean, maintainable code
- ✅ Documentation complete

## Implementation Timeline

**Estimated Duration:** 2-3 hours

**Phase 1 (30 min):** Core types and configuration
**Phase 2 (45 min):** Utility functions and logic
**Phase 3 (30 min):** Vue composables
**Phase 4 (45 min):** Component integration
**Phase 5 (30 min):** Testing and validation

**Total:** ~3 hours for complete implementation

## Conclusion

This RFC provides a comprehensive plan for implementing configuration validation while respecting all repository constraints. The implementation will deliver the required functionality without modifying any DN-T files, maintaining strict type safety, and providing comprehensive testing coverage.

The proposed approach uses existing tooling and infrastructure, ensuring compatibility and maintainability while delivering the requested validation features.

