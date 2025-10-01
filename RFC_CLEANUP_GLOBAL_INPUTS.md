# RFC: Cleanup Global Inputs

## Scope & Files (Allowlist)

### Exact files/dirs to be changed (app code, tests, docs ONLY)

**Core Type Definitions:**

- `apps/builder/src/types/index.ts` - Update GlobalInputs interface

**Components:**

- `apps/builder/src/components/GlobalInputs.vue` - Remove unused input fields from template and script
- `apps/builder/src/components/PhaseInputs.vue` - Update default props

**Composables:**

- `apps/builder/src/composables/useReplacements.ts` - Remove unused tokens from replacement map
- `apps/builder/src/composables/useLocalStorage.ts` - Update default state and add migration logic
- `apps/builder/src/composables/useValidation.ts` - Update validation logic (if needed)

**Utils:**

- `apps/builder/src/utils/validation.ts` - Remove validation for unused fields

**Tests:**

- `apps/builder/src/__tests__/useValidation.spec.ts` - Update test data and expectations
- `apps/builder/src/__tests__/useReplacements.spec.ts` - Update test data and expectations
- `apps/builder/src/__tests__/validation.spec.ts` - Update test data and expectations
- `apps/builder/src/components/__tests__/GlobalInputs.spec.ts` - Update component tests
- `apps/builder/src/components/__tests__/PhaseInputs.spec.ts` - Update default props tests
- `apps/builder/src/__tests__/PhaseView.spec.ts` - Update any global inputs references

**Documentation:**

- `PRD_CLEANUP_GLOBAL_INPUTS.md` - Already created

## Zero-Infra-Change Plan

### How I will use current lint, tsconfig, Vue.js, styling, testing, a11y

**TypeScript Configuration:**

- Use existing `tsconfig.json` and `tsconfig.app.json` strict mode settings
- Maintain all existing type checking rules (no `any`, no `unknown`, no non-null `!`)
- Update interfaces to be precise and exhaustive

**Vue.js Framework:**

- Maintain Vue 3 Composition API patterns
- Preserve existing component structure and reactivity
- Keep all existing props, emits, and composable usage patterns
- Maintain existing accessibility attributes (ARIA labels, roles, etc.)

**Styling:**

- No changes to existing SCSS files or CSS classes
- Remove only the HTML elements for unused fields
- Preserve all existing styling patterns and BEM methodology

**Testing:**

- Use existing Vitest + @testing-library/vue setup
- Update test data to match new interface structure
- Maintain existing test patterns and assertions
- Preserve all accessibility testing with jest-axe

**Linting:**

- Follow existing ESLint configuration
- No new `eslint-disable` statements needed
- Maintain existing code style and formatting

**Accessibility:**

- Preserve all existing ARIA labels and error associations
- Maintain focus management and keyboard navigation
- Keep all existing screen reader support

### Adapter/shim strategies if needed to fit constraints

**Data Migration Strategy:**

```typescript
// Migration function for existing localStorage data
function migrateGlobalInputs(legacy: LegacyGlobalInputs): GlobalInputs {
  return {
    projectName: legacy.projectName || "",
    featureName: legacy.featureName || "",
    featureSlug: legacy.featureSlug || "",
    requirements: legacy.requirements || "",
  };
}
```

**Backward Compatibility:**

- Add migration logic in `useLocalStorage.ts` to handle existing data
- Gracefully handle missing fields in existing localStorage data
- Provide sensible defaults for all required fields

## Proposed Infra/Config Adjustments (Optional; Proposal-Only)

**No infrastructure or configuration changes required.**

This implementation can be completed entirely within the existing application code without touching any DN-T files. All changes are contained within the app code, tests, and documentation as specified in the allowlist.

## Type Guarantees

### No any, no unknown, no non-null !, no as any

**Updated GlobalInputs Interface:**

```typescript
export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  requirements: string;
}
```

**Updated Replacement Map:**

```typescript
const replacementMap = computed<ReplacementMap>(() => ({
  PROJECT_NAME: globalInputs.projectName,
  FEATURE_NAME: globalInputs.featureName,
  FEATURE_SLUG: globalInputs.featureSlug,
  REQUIREMENTS: globalInputs.requirements,
  ...phaseInputs,
}));
```

**Updated Validation Field Mapping:**

```typescript
const GLOBAL_FIELD_MAP: Record<string, string> = {
  PROJECT_NAME: "project-name",
  FEATURE_NAME: "feature-name",
  FEATURE_SLUG: "feature-slug",
  REQUIREMENTS: "requirements",
};
```

### Exhaustive unions; precise exported types

**Component Props:**

```typescript
interface Props {
  globalInputs: GlobalInputs;
  template?: string;
  phaseInputs?: Record<string, string>;
}

const emit = defineEmits<{
  "update:globalInputs": [globalInputs: GlobalInputs];
}>();
```

**Migration Types:**

```typescript
interface LegacyGlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  owner?: string;
  repoUrl?: string;
  stack?: string;
  dateIso?: string;
  requirements: string;
}
```

**Validation Error Types:**

```typescript
interface ValidationError {
  field: string;
  token: string;
  message: string;
  type: "required" | "format" | "custom";
}
```

## Validation Plan (Human-Runnable)

### Commands to run for validation:

```bash
# Type checking
pnpm -w typecheck

# Linting
pnpm -w lint

# Testing
pnpm -w test

# Build verification
pnpm -w build
```

### Expected outcomes:

1. **TypeScript Compilation**: ✅ 0 errors
2. **ESLint**: ✅ 0 errors, 0 warnings
3. **Tests**: ✅ All tests passing
4. **Build**: ✅ Successful production build

### Test Coverage Verification:

- All existing tests updated to use simplified GlobalInputs interface
- New migration tests added for localStorage data handling
- Component tests updated to reflect removed fields
- Validation tests updated to only check essential fields

### Manual Testing Checklist:

1. **Form Rendering**: Only 4 input fields visible (Project Name, Feature Name, Feature Slug, Requirements)
2. **Data Persistence**: Form data saves and loads correctly from localStorage
3. **Token Replacement**: All phase templates render correctly with simplified token set
4. **Validation**: Form validation works correctly for essential fields only
5. **Export/Import**: Data export/import functionality works with simplified structure
6. **Accessibility**: All form fields maintain proper ARIA labels and error associations

### Migration Testing:

1. **Existing Data**: Test with existing localStorage data containing removed fields
2. **New Data**: Test with fresh installation using only essential fields
3. **Mixed Data**: Test with partial data migration scenarios

---

**RFC Version**: 1.0  
**Status**: Ready for Implementation  
**Created**: Senior Frontend Developer  
**Next Steps**: Implementation following this RFC
