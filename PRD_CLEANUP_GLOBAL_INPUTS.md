# PRD: Cleanup Global Inputs

## Background & Problem Statement

The current global inputs section in the prompt builder application contains 7 fields, but only 4 are essential for the core functionality. The current fields include:

**Current Fields:**

- ✅ Project Name (essential)
- ✅ Feature Name (essential)
- ✅ Feature Slug (essential)
- ✅ Project Requirements (essential)
- ❌ Owner (not used in templates)
- ❌ Repo URL (not used in templates)
- ❌ Stack (not used in templates)
- ❌ Date (not used in templates)

**Problem:**
The presence of unused fields creates unnecessary complexity and cognitive load for users. Analysis of all phase templates shows that only `[PROJECT_NAME]`, `[FEATURE_NAME]`, `[FEATURE_SLUG]`, and `[REQUIREMENTS]` tokens are actually used in the default templates. The other fields (Owner, Repo URL, Stack, Date) are not referenced in any phase templates, making them redundant.

**Impact:**

- Users waste time filling out irrelevant fields
- UI appears cluttered and confusing
- Validation logic unnecessarily complex
- Maintenance overhead for unused functionality

## Goals and Non-Goals

### Goals

1. **Simplify User Experience**: Remove unused global input fields to reduce cognitive load
2. **Streamline Validation**: Eliminate validation logic for unused fields
3. **Improve Performance**: Reduce form complexity and validation overhead
4. **Maintain Functionality**: Preserve all existing core features and token replacement system
5. **Clean Codebase**: Remove dead code and unused interfaces

### Non-Goals

- Adding new global input fields
- Modifying the token replacement system architecture
- Changing the phase template system
- Altering the export/import functionality
- Modifying the localStorage persistence mechanism

## User Stories (INVEST) + Acceptance Criteria

### US-1: Simplified Global Inputs Form

**As a** user of the prompt builder  
**I want** to see only the essential global input fields  
**So that** I can focus on the important information without distraction

**Acceptance Criteria:**

- [ ] Global inputs form displays only 4 fields: Project Name, Feature Name, Feature Slug, Project Requirements
- [ ] All removed fields (Owner, Repo URL, Stack, Date) are no longer visible in the UI
- [ ] Form maintains proper accessibility attributes and validation styling
- [ ] Form layout remains clean and intuitive

### US-2: Streamlined Validation

**As a** developer  
**I want** validation logic to only check essential fields  
**So that** the codebase is simpler and more maintainable

**Acceptance Criteria:**

- [ ] Validation only checks the 4 essential global input fields
- [ ] No validation errors are generated for removed fields
- [ ] Token replacement system works correctly with simplified field set
- [ ] All existing validation tests pass with updated field set

### US-3: Preserved Core Functionality

**As a** user  
**I want** all existing features to continue working  
**So that** my workflow is not disrupted

**Acceptance Criteria:**

- [ ] Token replacement works correctly for all phase templates
- [ ] Export/import functionality preserves all data correctly
- [ ] Phase navigation and editing work as before
- [ ] Copy functionality works for all generated prompts

## Functional Requirements (numbered, testable)

### FR-1: Remove Unused Global Input Fields

**Requirement**: Remove Owner, Repo URL, Stack, and Date fields from the GlobalInputs interface and UI components.

**Test Cases:**

1. GlobalInputs component renders only 4 input fields
2. GlobalInputs interface contains only essential fields
3. No TypeScript errors related to removed fields

### FR-2: Update Token Replacement System

**Requirement**: Remove unused tokens from the replacement map and validation logic.

**Test Cases:**

1. Replacement map contains only essential tokens: PROJECT_NAME, FEATURE_NAME, FEATURE_SLUG, REQUIREMENTS
2. Token validation only checks for essential tokens
3. Template processing works correctly with simplified token set

### FR-3: Update Validation Logic

**Requirement**: Remove validation rules and error handling for removed fields.

**Test Cases:**

1. Validation functions only validate essential fields
2. No validation errors are generated for removed tokens
3. Error display components work correctly with simplified field set

### FR-4: Update Default Values

**Requirement**: Update all default value objects to only include essential fields.

**Test Cases:**

1. Default GlobalInputs objects contain only essential fields
2. PhaseInputs default values are updated accordingly
3. LocalStorage migration handles existing data gracefully

### FR-5: Update Type Definitions

**Requirement**: Update TypeScript interfaces to reflect the simplified field structure.

**Test Cases:**

1. GlobalInputs interface contains only essential fields
2. All component props are updated to match new interface
3. No TypeScript compilation errors

## Technical Considerations

### Performance

- **Reduced Bundle Size**: Removing unused fields and validation logic will slightly reduce bundle size
- **Faster Validation**: Simplified validation logic will improve form validation performance
- **Reduced Memory Usage**: Less data stored in localStorage and component state

### Accessibility (a11y)

- **Maintained ARIA Labels**: All remaining fields retain proper ARIA labels and error associations
- **Focus Management**: Form focus flow remains logical with fewer fields
- **Screen Reader Support**: Simplified form structure improves screen reader navigation

### Internationalization (i18n)

- **No Impact**: No i18n considerations as the application is English-only

### Analytics

- **No Impact**: No analytics tracking currently implemented

### State Management

- **Simplified State**: Reduced complexity in GlobalInputs state management
- **LocalStorage**: Existing data migration strategy needed for users with stored data
- **Reactivity**: Vue 3 reactivity system continues to work with simplified state

### Error/Empty/Loading States

- **Error States**: Simplified error handling for fewer fields
- **Empty States**: Form validation provides clear guidance for required fields
- **Loading States**: No loading states currently implemented

## Risks & Mitigations

### Risk 1: Breaking Existing User Data

**Impact**: High - Users with existing localStorage data may experience issues
**Mitigation**: Implement data migration strategy to handle existing data gracefully
**Probability**: Medium

### Risk 2: Template Compatibility

**Impact**: Medium - Custom templates using removed tokens may break
**Mitigation**: Add deprecation warnings for removed tokens in custom templates
**Probability**: Low

### Risk 3: Test Coverage Gaps

**Impact**: Medium - Existing tests may fail after field removal
**Mitigation**: Update all test files to reflect new field structure
**Probability**: High

### Risk 4: TypeScript Compilation Errors

**Impact**: Medium - Interface changes may cause compilation errors
**Mitigation**: Systematic update of all type references
**Probability**: Medium

## Success Criteria & Measurement

### Success Criteria

1. **Functional**: All 4 essential global input fields work correctly
2. **Performance**: Form validation completes in <100ms
3. **Quality**: All existing tests pass with updated field set
4. **User Experience**: Form is 40% smaller (7 fields → 4 fields)
5. **Code Quality**: No TypeScript errors or ESLint warnings

### Measurement

- **Test Coverage**: Maintain 100% test coverage for modified components
- **Bundle Size**: Measure before/after bundle size reduction
- **Validation Performance**: Benchmark form validation speed
- **User Feedback**: Monitor for any user-reported issues

## Public UI/API Types (Design)

### Updated GlobalInputs Interface

```typescript
export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  requirements: string;
}
```

### Updated Replacement Map Type

```typescript
export interface ReplacementMap {
  PROJECT_NAME: string;
  FEATURE_NAME: string;
  FEATURE_SLUG: string;
  REQUIREMENTS: string;
  [key: string]: string; // For phase-specific inputs
}
```

### Updated Component Props

```typescript
// GlobalInputs.vue props
interface Props {
  globalInputs: GlobalInputs;
  template?: string;
  phaseInputs?: Record<string, string>;
}

// PhaseInputs.vue default props
const defaultGlobalInputs = (): GlobalInputs => ({
  projectName: "",
  featureName: "",
  featureSlug: "",
  requirements: "",
});
```

### Updated Validation Types

```typescript
// Field name mapping for validation
const GLOBAL_FIELD_MAP: Record<string, string> = {
  PROJECT_NAME: "project-name",
  FEATURE_NAME: "feature-name",
  FEATURE_SLUG: "feature-slug",
  REQUIREMENTS: "requirements",
};

// Validation error types remain the same
interface ValidationError {
  field: string;
  token: string;
  message: string;
  type: "required" | "format" | "custom";
}
```

### Migration Strategy Types

```typescript
// For handling existing localStorage data
interface LegacyGlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  owner?: string; // To be removed
  repoUrl?: string; // To be removed
  stack?: string; // To be removed
  dateIso?: string; // To be removed
  requirements: string;
}

// Migration function signature
function migrateGlobalInputs(legacy: LegacyGlobalInputs): GlobalInputs;
```

---

**Document Version**: 1.0  
**Status**: Ready for Implementation  
**Last Updated**: Generated by Product Manager  
**Next Steps**: Create RFC for implementation approach
