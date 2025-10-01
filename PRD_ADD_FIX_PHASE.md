# PRD: Add Phase 5 (Fix) with Specialized Inputs

## Background & Problem Statement

The prompt builder currently supports 6 phases (0-4) for project documentation workflows, but lacks a dedicated phase for bug fixing and issue resolution. Phase 5 has been defined in the configuration but requires specialized inputs and UI components to support the bug fixing workflow described in its template.

The current Phase 5 template includes 17 unique tokens that require specific input fields, making it the most complex phase in terms of required inputs. The existing generic PhaseInputs component cannot adequately handle the specialized nature of these bug-fixing inputs, which include technical details like commit SHA, browser/OS environment, severity levels, and PRD/RFC context.

## Goals and Non-Goals

### Goals

1. **Enable Bug Fixing Workflow**: Provide a dedicated phase for systematic bug fixing with all necessary context inputs
2. **Maintain Type Safety**: Ensure all Phase 5 inputs are properly typed and validated
3. **Preserve Existing Functionality**: Keep all current phases working without modification
4. **Follow Repository Constraints**: Adhere to all DN-T file restrictions and TypeScript strict mode
5. **Provide Specialized UI**: Create appropriate input components for Phase 5's complex requirements

### Non-Goals

1. **Modify Infrastructure**: No changes to package.json, tsconfig, vite.config, or other DN-T files
2. **Refactor Existing Phases**: Keep current phase implementations unchanged
3. **Add New Dependencies**: Work within existing dependency constraints
4. **Change Core Architecture**: Maintain composable-based architecture

## User Stories (INVEST) + Acceptance Criteria

### US-1: Bug Context Input

**As a** developer fixing bugs  
**I want to** input comprehensive bug context including title, commit SHA, and environment details  
**So that** the AI has all necessary information to understand and fix the issue

**Acceptance Criteria:**

- [ ] Input field for bug title (required)
- [ ] Input field for commit SHA or branch name (required)
- [ ] Input field for browser/OS environment (required)
- [ ] Input field for URL/Route where bug occurs (required)
- [ ] Input field for severity level with dropdown (blocker|critical|major|minor|trivial)
- [ ] All fields validate required status and format

### US-2: PRD Context Input

**As a** developer fixing bugs  
**I want to** reference relevant PRD sections and maintain scope alignment  
**So that** fixes stay within approved feature boundaries

**Acceptance Criteria:**

- [ ] Input field for PRD file name (auto-suggested format: PRD\_[FEATURE_SLUG].md)
- [ ] Input field for feature name (required)
- [ ] Textarea for relevant PRD goals (subset relevant to bug)
- [ ] Textarea for relevant PRD non-goals (ensure no drift)
- [ ] Input field for impacted functional requirement IDs (comma-separated)
- [ ] Input field for stable public UI/API types (comma-separated)

### US-3: RFC Context Input

**As a** developer fixing bugs  
**I want to** reference RFC implementation constraints and allowed file paths  
**So that** fixes comply with approved implementation scope

**Acceptance Criteria:**

- [ ] Input field for RFC file name (auto-suggested format: RFC\_[FEATURE_SLUG].md)
- [ ] Textarea for RFC allowlist paths (comma-separated)
- [ ] Textarea for zero-infra-change plan summary
- [ ] Textarea for proposed infra/config adjustments (read-only, proposal-only)

### US-4: Bug Reproduction Input

**As a** developer fixing bugs  
**I want to** provide clear reproduction steps and expected vs actual behavior  
**So that** the AI can understand the issue and verify the fix

**Acceptance Criteria:**

- [ ] Textarea for reproduction steps (numbered list format)
- [ ] Textarea for expected behavior
- [ ] Textarea for actual behavior
- [ ] Textarea for suspected root cause (optional)
- [ ] All textareas support proper formatting and validation

### US-5: Phase 5 Integration

**As a** user of the prompt builder  
**I want to** access Phase 5 through the existing navigation and workflow  
**So that** I can seamlessly use the bug fixing phase alongside other phases

**Acceptance Criteria:**

- [ ] Phase 5 appears in phase navigation
- [ ] Phase 5 uses specialized input components
- [ ] Phase 5 integrates with existing token replacement system
- [ ] Phase 5 supports template override functionality
- [ ] Phase 5 saves/loads state with other phases

## Functional Requirements (numbered, testable)

### FR-1: Phase Interface Update

**Requirement**: Update Phase interface to include Phase 5 ID

- **Test**: Verify Phase interface includes "5" in PhaseId union type
- **Test**: Verify Phase interface includes "5" in Phase type id field

### FR-2: Phase 5 Input Component

**Requirement**: Create Phase5Inputs component with specialized input fields

- **Test**: Component renders all 17 required input fields
- **Test**: Component validates required fields
- **Test**: Component emits update events for each field
- **Test**: Component integrates with existing validation system

### FR-3: Input Field Types

**Requirement**: Implement appropriate input types for each Phase 5 token

- **Test**: Bug title uses text input with required validation
- **Test**: Severity uses select dropdown with predefined options
- **Test**: Commit SHA uses text input with format validation
- **Test**: Environment uses text input with required validation
- **Test**: URL/Route uses text input with URL format validation
- **Test**: PRD/RFC file names use text input with auto-suggestion
- **Test**: Multi-line fields use textarea with proper sizing
- **Test**: Comma-separated fields use text input with parsing

### FR-4: Validation Rules

**Requirement**: Implement comprehensive validation for Phase 5 inputs

- **Test**: Required fields show error when empty
- **Test**: URL format validation works for URL_ROUTE field
- **Test**: Severity dropdown validates against allowed values
- **Test**: Comma-separated fields parse and validate correctly
- **Test**: All validation errors display with proper ARIA attributes

### FR-5: Token Replacement Integration

**Requirement**: Ensure Phase 5 inputs integrate with token replacement system

- **Test**: Phase 5 inputs populate replacement map correctly
- **Test**: Template rendering uses Phase 5 input values
- **Test**: Missing required inputs prevent template rendering
- **Test**: Token replacement validation works for Phase 5

### FR-6: State Management

**Requirement**: Phase 5 state integrates with existing state management

- **Test**: Phase 5 state persists to localStorage
- **Test**: Phase 5 state loads from localStorage
- **Test**: Phase 5 state updates trigger reactive updates
- **Test**: Phase 5 state exports/imports with other phases

### FR-7: Navigation Integration

**Requirement**: Phase 5 integrates with existing phase navigation

- **Test**: Phase 5 appears in phase navigation menu
- **Test**: Phase 5 navigation works correctly
- **Test**: Phase 5 shows as active when selected
- **Test**: Phase 5 maintains state when switching phases

## Technical Considerations

### Performance

- **Input Validation**: Debounced validation for real-time feedback without performance impact
- **State Updates**: Efficient state updates using Vue 3 reactivity
- **Template Rendering**: Memoized template rendering for complex Phase 5 template
- **LocalStorage**: Efficient serialization/deserialization of Phase 5 state

### Accessibility (a11y)

- **Form Labels**: All input fields have proper labels and ARIA attributes
- **Error Messages**: Error messages are properly associated with fields
- **Keyboard Navigation**: Full keyboard navigation support for all input types
- **Screen Readers**: Proper ARIA roles and descriptions for complex form layout
- **Focus Management**: Logical tab order and focus management

### Internationalization (i18n)

- **Not Applicable**: Phase 5 is English-only, consistent with existing phases
- **Future Consideration**: Input labels and validation messages could be externalized if i18n is added

### Analytics

- **Not Applicable**: No analytics requirements for Phase 5 inputs
- **Future Consideration**: Could track Phase 5 usage patterns if analytics are added

### State Management

- **Composable Pattern**: Use existing composable pattern for Phase 5 state
- **Reactivity**: Leverage Vue 3 reactivity for efficient updates
- **Persistence**: Integrate with existing localStorage persistence
- **Validation**: Use existing validation composable with Phase 5-specific rules

### Error/Empty/Loading States

- **Error States**: Clear error messages for validation failures
- **Empty States**: Helpful placeholder text and guidance for empty fields
- **Loading States**: Loading indicators for state persistence operations
- **Validation States**: Real-time validation feedback with appropriate styling

## Risks & Mitigations

### Risk 1: Complex Input Validation

**Risk**: Phase 5 has 17 different input fields with varying validation requirements
**Mitigation**: Create reusable validation composable with field-specific rules
**Impact**: Medium - requires careful validation design

### Risk 2: Type Safety Complexity

**Risk**: Complex input types may lead to type safety issues
**Mitigation**: Define comprehensive TypeScript interfaces for all Phase 5 inputs
**Impact**: Medium - requires thorough type definitions

### Risk 3: UI Complexity

**Risk**: Specialized input component may become too complex
**Mitigation**: Break down into smaller, focused sub-components
**Impact**: Low - can be managed with component composition

### Risk 4: State Management Complexity

**Risk**: Phase 5 state may complicate existing state management
**Mitigation**: Use existing patterns and ensure proper integration
**Impact**: Low - follows existing patterns

### Risk 5: Template Rendering Performance

**Risk**: Complex Phase 5 template may impact rendering performance
**Mitigation**: Implement memoization and efficient token replacement
**Impact**: Low - can be optimized if needed

## Success Criteria & Measurement

### Success Criteria

1. **Functional Completeness**: All 17 Phase 5 input fields are implemented and functional
2. **Type Safety**: All Phase 5 inputs are properly typed with no TypeScript errors
3. **Validation**: All Phase 5 inputs have appropriate validation rules
4. **Integration**: Phase 5 seamlessly integrates with existing workflow
5. **Accessibility**: Phase 5 meets accessibility standards
6. **Performance**: Phase 5 performs within acceptable limits

### Measurement

- **Test Coverage**: 100% test coverage for Phase 5 input components
- **Type Safety**: Zero TypeScript errors in strict mode
- **Accessibility**: Passes axe-core accessibility tests
- **Performance**: Template rendering completes within 100ms
- **User Experience**: All input fields are intuitive and easy to use

## Public UI/API Types (Design)

### Core Types

```typescript
// Phase 5 specific input types
export interface Phase5Inputs {
  // Bug Context
  bugTitle: string;
  commitSha: string;
  browserOs: string;
  urlRoute: string;
  severity: BugSeverity;

  // PRD Context
  prdFile: string;
  featureName: string;
  prdGoalsRelevant: string;
  prdNongoalsRelevant: string;
  prdFrIds: string;
  prdTypesStable: string;

  // RFC Context
  rfcFile: string;
  rfcAllowlistPaths: string;
  rfcZeroInfraSummary: string;
  rfcOptionalAdjustments: string;

  // Bug Reproduction
  reproSteps: string;
  expectedBehavior: string;
  actualBehavior: string;
  suspectedRootCause: string;
}

// Bug severity levels
export type BugSeverity =
  | "blocker"
  | "critical"
  | "major"
  | "minor"
  | "trivial";

// Phase 5 input field types
export type Phase5InputFieldType =
  | "text"
  | "textarea"
  | "select"
  | "url"
  | "commit-sha";

// Phase 5 input field configuration
export interface Phase5InputFieldConfig {
  key: keyof Phase5Inputs;
  label: string;
  type: Phase5InputFieldType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: ValidationRule;
  options?: string[]; // For select fields
}

// Phase 5 validation rules
export interface Phase5ValidationRule {
  field: keyof Phase5Inputs;
  required: boolean;
  pattern?: RegExp;
  message?: string;
  customValidator?: (value: string) => ValidationError[];
}

// Phase 5 component props
export interface Phase5InputsProps {
  modelValue: Phase5Inputs;
  disabled?: boolean;
  showValidation?: boolean;
  compact?: boolean;
}

// Phase 5 input field props
export interface Phase5InputFieldProps {
  modelValue: string;
  fieldConfig: Phase5InputFieldConfig;
  disabled?: boolean;
  errorMessage?: string;
  "aria-describedby"?: string;
}

// Phase 5 validation state
export interface Phase5ValidationState {
  isValid: boolean;
  errors: Phase5ValidationError[];
  warnings: Phase5ValidationWarning[];
}

// Phase 5 specific validation error
export interface Phase5ValidationError {
  field: keyof Phase5Inputs;
  message: string;
  type: "required" | "format" | "custom";
}

// Phase 5 specific validation warning
export interface Phase5ValidationWarning {
  field: keyof Phase5Inputs;
  message: string;
  type: "suggestion" | "deprecation";
}

// Phase 5 composable return type
export interface UsePhase5InputsReturn {
  inputs: Ref<Phase5Inputs>;
  validationState: ComputedRef<Phase5ValidationState>;
  updateInput: (field: keyof Phase5Inputs, value: string) => void;
  validateInput: (field: keyof Phase5Inputs) => ValidationError[];
  validateAll: () => Phase5ValidationState;
  resetInputs: () => void;
  getFieldError: (field: keyof Phase5Inputs) => string;
}

// Phase 5 field configurations
export const PHASE_5_FIELD_CONFIGS: Phase5InputFieldConfig[] = [
  {
    key: "bugTitle",
    label: "Bug Title",
    type: "text",
    required: true,
    placeholder: "Brief description of the bug",
    helpText: "A concise title describing the issue",
  },
  {
    key: "commitSha",
    label: "Commit SHA or Branch",
    type: "commit-sha",
    required: true,
    placeholder: "abc1234 or feature-branch",
    helpText: "The commit or branch where the bug occurs",
  },
  {
    key: "browserOs",
    label: "Browser/OS Environment",
    type: "text",
    required: true,
    placeholder: "Chrome 120 on macOS 14",
    helpText: "Browser and operating system where bug was observed",
  },
  {
    key: "urlRoute",
    label: "URL/Route",
    type: "url",
    required: true,
    placeholder: "https://example.com/page",
    helpText: "The URL or route where the bug occurs",
  },
  {
    key: "severity",
    label: "Severity",
    type: "select",
    required: true,
    options: ["blocker", "critical", "major", "minor", "trivial"],
    helpText: "Impact level of the bug",
  },
  {
    key: "prdFile",
    label: "PRD File",
    type: "text",
    required: true,
    placeholder: "PRD_feature_slug.md",
    helpText: "Name of the PRD file (format: PRD_[FEATURE_SLUG].md)",
  },
  {
    key: "featureName",
    label: "Feature Name",
    type: "text",
    required: true,
    placeholder: "User Authentication",
    helpText: "Name of the feature being worked on",
  },
  {
    key: "prdGoalsRelevant",
    label: "Relevant PRD Goals",
    type: "textarea",
    required: true,
    placeholder:
      "• Goal 1: Improve user experience\n• Goal 2: Increase security",
    helpText: "PRD goals relevant to this bug (bullet points)",
  },
  {
    key: "prdNongoalsRelevant",
    label: "Relevant PRD Non-Goals",
    type: "textarea",
    required: true,
    placeholder:
      "• Non-Goal 1: Complete redesign\n• Non-Goal 2: New infrastructure",
    helpText: "PRD non-goals to ensure no scope drift (bullet points)",
  },
  {
    key: "prdFrIds",
    label: "Impacted Functional Requirements",
    type: "text",
    required: true,
    placeholder: "FR-1, FR-3, FR-5",
    helpText: "Comma-separated list of functional requirement IDs",
  },
  {
    key: "prdTypesStable",
    label: "Stable Public Types",
    type: "text",
    required: true,
    placeholder: "User, AuthState, LoginForm",
    helpText:
      "Comma-separated list of public UI/API types that must remain stable",
  },
  {
    key: "rfcFile",
    label: "RFC File",
    type: "text",
    required: true,
    placeholder: "RFC_feature_slug.md",
    helpText: "Name of the RFC file (format: RFC_[FEATURE_SLUG].md)",
  },
  {
    key: "rfcAllowlistPaths",
    label: "RFC Allowlist Paths",
    type: "textarea",
    required: true,
    placeholder: "src/components/\nsrc/utils/\ntests/",
    helpText: "File paths allowed for modification (one per line)",
  },
  {
    key: "rfcZeroInfraSummary",
    label: "Zero-Infra-Change Plan",
    type: "textarea",
    required: true,
    placeholder:
      "Summary of changes that require no infrastructure modifications",
    helpText: "Brief summary of the zero-infrastructure-change approach",
  },
  {
    key: "rfcOptionalAdjustments",
    label: "Proposed Infra Adjustments",
    type: "textarea",
    required: false,
    placeholder: "Optional infrastructure changes (proposal only)",
    helpText:
      "Proposed infrastructure adjustments (read-only, for reference only)",
  },
  {
    key: "reproSteps",
    label: "Reproduction Steps",
    type: "textarea",
    required: true,
    placeholder:
      "1) Navigate to login page\n2) Enter invalid credentials\n3) Click submit",
    helpText: "Numbered steps to reproduce the bug",
  },
  {
    key: "expectedBehavior",
    label: "Expected Behavior",
    type: "textarea",
    required: true,
    placeholder: "User should see error message and remain on login page",
    helpText: "What should happen when following the reproduction steps",
  },
  {
    key: "actualBehavior",
    label: "Actual Behavior",
    type: "textarea",
    required: true,
    placeholder: "User is redirected to dashboard without authentication",
    helpText: "What actually happens when following the reproduction steps",
  },
  {
    key: "suspectedRootCause",
    label: "Suspected Root Cause",
    type: "textarea",
    required: false,
    placeholder: "Authentication middleware not properly validating tokens",
    helpText: "Your hypothesis about what's causing the bug (optional)",
  },
] as const;

// Phase 5 validation rules
export const PHASE_5_VALIDATION_RULES: Phase5ValidationRule[] = [
  {
    field: "bugTitle",
    required: true,
    message: "Bug title is required",
  },
  {
    field: "commitSha",
    required: true,
    message: "Commit SHA or branch is required",
  },
  {
    field: "browserOs",
    required: true,
    message: "Browser/OS environment is required",
  },
  {
    field: "urlRoute",
    required: true,
    pattern: /^https?:\/\/.+/,
    message: "URL must be a valid HTTP/HTTPS URL",
  },
  {
    field: "severity",
    required: true,
    message: "Severity level is required",
  },
  {
    field: "prdFile",
    required: true,
    pattern: /^PRD_[a-z0-9_]+\.md$/,
    message: "PRD file must follow format: PRD_[feature_slug].md",
  },
  {
    field: "featureName",
    required: true,
    message: "Feature name is required",
  },
  {
    field: "prdGoalsRelevant",
    required: true,
    message: "Relevant PRD goals are required",
  },
  {
    field: "prdNongoalsRelevant",
    required: true,
    message: "Relevant PRD non-goals are required",
  },
  {
    field: "prdFrIds",
    required: true,
    message: "Impacted functional requirements are required",
  },
  {
    field: "prdTypesStable",
    required: true,
    message: "Stable public types are required",
  },
  {
    field: "rfcFile",
    required: true,
    pattern: /^RFC_[a-z0-9_]+\.md$/,
    message: "RFC file must follow format: RFC_[feature_slug].md",
  },
  {
    field: "rfcAllowlistPaths",
    required: true,
    message: "RFC allowlist paths are required",
  },
  {
    field: "rfcZeroInfraSummary",
    required: true,
    message: "Zero-infra-change plan is required",
  },
  {
    field: "reproSteps",
    required: true,
    message: "Reproduction steps are required",
  },
  {
    field: "expectedBehavior",
    required: true,
    message: "Expected behavior is required",
  },
  {
    field: "actualBehavior",
    required: true,
    message: "Actual behavior is required",
  },
] as const;
```

### Component Props

```typescript
// Phase5Inputs component props
export interface Phase5InputsProps {
  modelValue: Phase5Inputs;
  disabled?: boolean;
  showValidation?: boolean;
  compact?: boolean;
  "aria-label"?: string;
}

// Phase5InputField component props
export interface Phase5InputFieldProps {
  modelValue: string;
  fieldConfig: Phase5InputFieldConfig;
  disabled?: boolean;
  errorMessage?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

// Phase5ValidationSummary component props
export interface Phase5ValidationSummaryProps {
  validationState: Phase5ValidationState;
  showWarnings?: boolean;
  compact?: boolean;
}

// Phase5SeveritySelect component props
export interface Phase5SeveritySelectProps {
  modelValue: BugSeverity;
  disabled?: boolean;
  errorMessage?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}
```

### Event Types

```typescript
// Phase 5 input events
export interface Phase5InputEvent {
  field: keyof Phase5Inputs;
  value: string;
  isValid: boolean;
}

// Phase 5 validation events
export interface Phase5ValidationEvent {
  type: "validation_start" | "validation_complete" | "validation_error";
  field?: keyof Phase5Inputs;
  timestamp: number;
  data?: Record<string, unknown>;
}

// Phase 5 state events
export interface Phase5StateEvent {
  type: "inputs_updated" | "validation_updated" | "state_reset";
  timestamp: number;
  data?: Phase5Inputs;
}
```

---

**Document Version**: 1.0  
**Last Updated**: Generated by Product Manager  
**Status**: Ready for Implementation  
**Next Steps**: Begin implementation of Phase5Inputs component and related types
