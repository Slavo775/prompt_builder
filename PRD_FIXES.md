# PRD: Prompt Builder Critical Fixes

**Product Manager**: AI Assistant  
**Version**: 1.0  
**Date**: 2024-01-01  
**Status**: Draft

## Background & Problem Statement

The prompt builder application currently suffers from three critical issues that significantly impact user experience and functionality:

### 1. **Token Replacement Not Working**

- **Problem**: Input values and rendered results do not match due to broken token replacement logic
- **Impact**: Users cannot trust the preview output, making the tool unreliable for actual use
- **Root Cause**: Token replacement system has inconsistencies between validation and rendering logic

### 2. **Error States Not Working**

- **Problem**: Error states and validation feedback are not properly displayed to users
- **Impact**: Users cannot identify what's wrong with their inputs or templates
- **Root Cause**: Validation system exists but UI components don't properly display error states

### 3. **Missing Requirements Input**

- **Problem**: No dedicated text area for users to input project requirements
- **Impact**: Users cannot capture detailed requirements that should be incorporated into generated prompts
- **Root Cause**: Current system only supports basic global inputs, missing requirements capture

## Goals and Non-Goals

### Goals

1. **Fix token replacement** - Ensure input values correctly replace tokens in templates
2. **Implement error states** - Display clear validation errors and warnings to users
3. **Add requirements input** - Provide a dedicated text area for project requirements
4. **Improve user experience** - Make the tool reliable and intuitive for daily use
5. **Maintain data integrity** - Ensure all user inputs are properly validated and stored

### Non-Goals

- Complete UI/UX redesign (focus on fixing existing functionality)
- Adding new phase types or major feature additions
- Performance optimization (address after core fixes)
- Mobile responsiveness improvements
- Advanced template features (focus on core functionality)

## User Stories (INVEST) + Acceptance Criteria

### US1: Token Replacement Accuracy

**As a** user building prompts  
**I want** my input values to correctly replace tokens in the template  
**So that** the preview accurately reflects what will be generated

**Acceptance Criteria:**

- [ ] When I enter "My Project" in Project Name, all `[PROJECT_NAME]` tokens show "My Project"
- [ ] When I add custom phase inputs, they replace corresponding tokens
- [ ] Token replacement happens in real-time as I type
- [ ] Preview always matches the actual output when copied
- [ ] No tokens remain unreplaced when valid inputs are provided

### US2: Clear Error Feedback

**As a** user filling out forms  
**I want** to see clear error messages when something is wrong  
**So that** I can fix issues and complete my work

**Acceptance Criteria:**

- [ ] Invalid input fields show red borders
- [ ] Error messages appear below invalid fields
- [ ] Error messages are specific and actionable
- [ ] Validation runs in real-time as I type
- [ ] Error states clear when issues are fixed
- [ ] Screen readers can access error messages

### US3: Requirements Capture

**As a** project manager creating documentation  
**I want** to input detailed project requirements  
**So that** they can be incorporated into generated prompts

**Acceptance Criteria:**

- [ ] Large text area for requirements input
- [ ] Requirements are saved with the project
- [ ] Requirements can be referenced in templates via `[REQUIREMENTS]` token
- [ ] Text area supports multi-line input with proper formatting
- [ ] Requirements are included in export/import functionality

### US4: Reliable Preview

**As a** user working with templates  
**I want** the preview to always show the final output  
**So that** I can trust what I'm generating

**Acceptance Criteria:**

- [ ] Preview updates immediately when inputs change
- [ ] Preview shows exactly what will be copied
- [ ] No discrepancies between preview and actual output
- [ ] Preview handles all token types correctly
- [ ] Preview shows proper formatting and line breaks

## Functional Requirements (numbered, testable)

### FR1: Token Replacement System

1. **FR1.1** - Token replacement must use consistent regex pattern `/\[([A-Z_]+)\]/g`
2. **FR1.2** - Global inputs must map to uppercase token names (e.g., `projectName` → `PROJECT_NAME`)
3. **FR1.3** - Phase inputs must override global inputs when both exist
4. **FR1.4** - Unknown tokens must remain unchanged in output
5. **FR1.5** - Token replacement must be case-sensitive and exact match only

### FR2: Error State Display

6. **FR2.1** - Invalid input fields must display red border (`border-color: #dc2626`)
7. **FR2.2** - Error messages must appear below invalid fields
8. **FR2.3** - Error messages must be associated with inputs via `aria-describedby`
9. **FR2.4** - Validation must run on input change, template change, and phase switch
10. **FR2.5** - Error states must clear when validation passes

### FR3: Requirements Input

11. **FR3.1** - Requirements input must be a textarea with minimum 6 rows
12. **FR3.2** - Requirements must be stored in `GlobalInputs` interface
13. **FR3.3** - Requirements must support `[REQUIREMENTS]` token in templates
14. **FR3.4** - Requirements must be included in export/import functionality
15. **FR3.5** - Requirements input must have proper label and accessibility attributes

### FR4: Validation System

16. **FR4.1** - Global input validation must check required fields
17. **FR4.2** - Phase input validation must check template-specific tokens
18. **FR4.3** - Template validation must identify missing tokens
19. **FR4.4** - Validation must provide specific, actionable error messages
20. **FR4.5** - Validation state must be reactive and update automatically

### FR5: Data Persistence

21. **FR5.1** - All input changes must auto-save to localStorage
22. **FR5.2** - Requirements must persist across browser sessions
23. **FR5.3** - Export must include all user inputs including requirements
24. **FR5.4** - Import must restore all data including requirements
25. **FR5.5** - Data migration must handle missing requirements field gracefully

## Technical Considerations

### Performance

- **Token Replacement**: Use computed properties for efficient reactivity
- **Validation**: Debounce validation to prevent excessive re-renders
- **Large Text Areas**: Use proper textarea sizing for requirements input
- **Memory Usage**: Monitor localStorage usage with requirements data

### Accessibility

- **Error Announcements**: Use `aria-describedby` and `role="alert"` for errors
- **Keyboard Navigation**: Ensure all inputs are keyboard accessible
- **Screen Reader Support**: Proper labeling and error association
- **Focus Management**: Focus on invalid inputs when validation fails
- **Color Contrast**: Ensure error states meet WCAG AA standards

### Internationalization

- **English-Only**: All error messages and labels in English initially
- **Structured Messages**: Use consistent message structure for future i18n
- **Token Format**: Maintain `[TOKEN]` format across all languages

### Analytics

- **Validation Events**: Track validation failures for UX insights
- **Token Usage**: Monitor which tokens are most commonly used
- **Error Patterns**: Identify common validation failure patterns
- **Requirements Usage**: Track how often requirements are filled

### State Management

- **Reactive Validation**: Use Vue computed properties for validation state
- **Input Binding**: Proper two-way binding for all form inputs
- **Error State**: Centralized error state management
- **Persistence**: Automatic localStorage sync for all inputs

### Error/Empty/Loading States

- **Loading States**: Show loading during initial data load
- **Empty States**: Helpful messages when no data exists
- **Error Boundaries**: Graceful handling of unexpected errors
- **Validation States**: Clear visual feedback for all validation states

## Risks & Mitigations

### Risk 1: Token Replacement Complexity

**Risk**: Token replacement logic becomes complex with multiple input sources  
**Mitigation**: Use clear separation between global and phase inputs, comprehensive testing

### Risk 2: Validation Performance

**Risk**: Real-time validation causes performance issues  
**Mitigation**: Implement debouncing, use computed properties efficiently

### Risk 3: Data Migration

**Risk**: Adding requirements field breaks existing data  
**Mitigation**: Implement graceful migration with default empty values

### Risk 4: User Experience Confusion

**Risk**: Multiple input types confuse users  
**Mitigation**: Clear labeling, help text, and consistent UI patterns

### Risk 5: Browser Compatibility

**Risk**: New features don't work in older browsers  
**Mitigation**: Use standard web APIs, test across browsers

## Success Criteria & Measurement

### Success Metrics

1. **Token Replacement Accuracy**: 100% of tokens correctly replaced when valid inputs provided
2. **Error Detection**: 100% of validation errors properly displayed to users
3. **User Completion Rate**: >90% of users can complete a full prompt generation workflow
4. **Error Resolution Time**: <30 seconds average time to resolve validation errors
5. **Data Persistence**: 100% of user inputs saved and restored correctly

### Measurement Methods

- **Automated Testing**: Unit tests for all token replacement scenarios
- **User Testing**: Manual testing of complete user workflows
- **Error Tracking**: Monitor validation error patterns and resolution
- **Performance Monitoring**: Track validation and rendering performance
- **Data Integrity**: Verify all inputs persist across sessions

## Public UI/API Types (Design)

### Core Interfaces

```typescript
// Enhanced GlobalInputs with requirements
export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  owner: string;
  repoUrl?: string;
  stack: string;
  dateIso: string;
  requirements: string; // NEW: Requirements input
}

// Token replacement result
export interface TokenReplacementResult {
  originalTemplate: string;
  renderedTemplate: string;
  replacedTokens: string[];
  unreplacedTokens: string[];
  isValid: boolean;
}

// Enhanced validation error
export interface ValidationError {
  field: string;
  token: string;
  message: string;
  type: "required" | "format" | "custom";
  severity: "error" | "warning";
  position?: {start: number; end: number};
}

// Requirements input component props
export interface RequirementsInputProps {
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  errorMessage?: string;
  helpText?: string;
}

// Enhanced validation state
export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  requirementsValid: boolean;
  tokenReplacementValid: boolean;
}

// Token replacement service
export interface TokenReplacementService {
  replaceTokens(
    template: string,
    inputs: Record<string, string>
  ): TokenReplacementResult;
  validateTokens(
    template: string,
    inputs: Record<string, string>
  ): ValidationError[];
  getAvailableTokens(inputs: Record<string, string>): string[];
  getTokenType(
    token: string,
    inputs: Record<string, string>
  ): "global" | "phase" | "custom" | "unknown";
}
```

### Component Props

```typescript
// RequirementsInput component
export interface RequirementsInputProps {
  modelValue: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  errorMessage?: string;
  helpText?: string;
  label?: string;
  id?: string;
  ariaDescribedBy?: string;
}

// Enhanced PhaseView component
export interface PhaseViewProps {
  phase: Phase;
  globalInputs: GlobalInputs;
  validationState: ValidationState;
  onUpdatePhase: (phase: Phase) => void;
  onUpdateGlobalInputs: (inputs: GlobalInputs) => void;
}

// Enhanced PhaseTemplateEditor component
export interface PhaseTemplateEditorProps {
  phase: Phase;
  validationErrors: ValidationError[];
  onUpdateTemplate: (template: string) => void;
  onValidateTemplate: (template: string) => ValidationError[];
}
```

### Union Types

```typescript
// Token types
export type TokenType = "global" | "phase" | "custom" | "unknown";

// Validation severity levels
export type ValidationSeverity = "error" | "warning" | "info";

// Input field types
export type InputFieldType =
  | "text"
  | "email"
  | "url"
  | "textarea"
  | "requirements";

// Template validation states
export type TemplateValidationState =
  | "valid"
  | "invalid"
  | "warning"
  | "loading";
```

### Enums

```typescript
// Validation error types
export enum ValidationErrorType {
  REQUIRED = "required",
  FORMAT = "format",
  CUSTOM = "custom",
  TOKEN_MISSING = "token_missing",
  TOKEN_INVALID = "token_invalid",
}

// Token replacement status
export enum TokenReplacementStatus {
  SUCCESS = "success",
  PARTIAL = "partial",
  FAILED = "failed",
  VALIDATING = "validating",
}

// Input field validation states
export enum InputValidationState {
  VALID = "valid",
  INVALID = "invalid",
  WARNING = "warning",
  PENDING = "pending",
}
```

---

**This PRD serves as the single source of truth for implementing the critical fixes to the prompt builder application. All implementation must align with these requirements and maintain the existing architecture while fixing the identified issues.**
