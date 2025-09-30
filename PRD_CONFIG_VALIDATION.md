# Product Requirements Document: Configuration Validation

## Background & Problem Statement

### Current State

The prompt builder application currently stores phase templates as hardcoded constants in `types/index.ts`, making them difficult to modify and maintain. Users can create custom phase inputs, but there's no validation to ensure required tokens are provided when they appear in templates. This leads to incomplete prompts with unresolved tokens like `[MISSING_TOKEN]`.

### Problem

1. **Configuration Management**: Phase templates are embedded in TypeScript code, making them inaccessible to non-developers
2. **Missing Validation**: No validation exists for required inputs when tokens appear in templates
3. **Poor UX**: Users don't know which inputs are required for complete prompt generation
4. **Maintenance Burden**: Template changes require code deployment

### Opportunity

Implement a configuration-driven approach with validation that provides immediate feedback and ensures prompt completeness.

## Goals and Non-Goals

### Goals

1. **Configurable Templates**: Move phase templates to external configuration files
2. **Input Validation**: Validate required inputs based on template token usage
3. **Visual Feedback**: Provide clear validation states with red borders for invalid inputs
4. **Maintainability**: Enable template updates without code changes
5. **User Guidance**: Help users understand which inputs are required

### Non-Goals

1. **Template Editor UI**: Not building a visual template editor (keep text-based)
2. **Complex Validation Rules**: Only basic required field validation initially
3. **Multi-language Support**: English-only validation messages
4. **Backend Integration**: Keep configuration file-based approach
5. **Real-time Collaboration**: Single-user application

## User Stories (INVEST) + Acceptance Criteria

### Story 1: Configuration-Based Templates

**As a** product manager  
**I want** phase templates stored in configuration files  
**So that** I can update templates without developer involvement

**Acceptance Criteria:**

- [ ] Phase templates are stored in `config/phases/` directory
- [ ] Each phase has its own configuration file
- [ ] Templates are loaded from config files at runtime
- [ ] Default templates are preserved as fallbacks
- [ ] Configuration changes don't require code deployment

### Story 2: Required Input Validation

**As a** user  
**I want** to know which inputs are required for the current template  
**So that** I can complete my prompt without missing tokens

**Acceptance Criteria:**

- [ ] System analyzes template for `[TOKEN]` patterns
- [ ] Required inputs are identified from template tokens
- [ ] Missing required inputs are visually highlighted
- [ ] Validation occurs on template change and input change
- [ ] Clear error messages indicate which inputs are missing

### Story 3: Visual Validation Feedback

**As a** user  
**I want** clear visual feedback when inputs are invalid  
**So that** I can quickly identify and fix issues

**Acceptance Criteria:**

- [ ] Invalid input fields have red borders
- [ ] Valid input fields have normal styling
- [ ] Error messages appear below invalid inputs
- [ ] Validation state updates in real-time
- [ ] Preview section shows validation status

### Story 4: Template Configuration Management

**As a** developer  
**I want** easy access to phase configurations  
**So that** I can maintain and update templates efficiently

**Acceptance Criteria:**

- [ ] Each phase configuration is a separate constant
- [ ] Configuration files use TypeScript for type safety
- [ ] Configuration structure is well-documented
- [ ] Easy to add new phases or modify existing ones
- [ ] Configuration is type-checked at build time

## Functional Requirements (numbered, testable)

### FR1: Configuration File Structure

1.1. Create `config/phases/` directory in the repository root  
1.2. Each phase (0, 1, 2, 2.5, 3, 4) has a separate `.ts` file  
1.3. Each phase file exports a single constant with template content  
1.4. Configuration files are imported and loaded at application startup  
1.5. Fallback to hardcoded defaults if configuration files are missing

### FR2: Template Token Analysis

2.1. System parses templates for `[TOKEN_NAME]` patterns using regex  
2.2. Identifies required tokens from template content  
2.3. Cross-references tokens with available global and phase inputs  
2.4. Determines which inputs are missing or empty  
2.5. Updates validation state when template or inputs change

### FR3: Input Validation Logic

3.1. Global inputs are validated against global token requirements  
3.2. Phase inputs are validated against phase-specific token requirements  
3.3. Empty or undefined values are considered invalid  
3.4. Validation runs on input change, template change, and phase switch  
3.5. Validation state is computed reactively using Vue composables

### FR4: Visual Validation States

4.1. Invalid input fields display red border (`border-color: #dc2626`)  
4.2. Valid input fields display normal border (`border-color: #d1d5db`)  
4.3. Error messages appear below invalid inputs  
4.4. Validation state is visually consistent across all input types  
4.5. Focus states are preserved with validation styling

### FR5: Error Messaging

5.1. Error messages specify which tokens are missing  
5.2. Messages use clear, actionable language  
5.3. Error messages appear below the invalid input field  
5.4. Multiple errors are displayed as a list  
5.5. Error messages are accessible to screen readers

### FR6: Testing Coverage

6.1. Unit tests for token parsing logic  
6.2. Unit tests for validation state computation  
6.3. Component tests for visual validation states  
6.4. Integration tests for configuration loading  
6.5. Accessibility tests for error messaging

## Technical Considerations

### Performance

- **Token Parsing**: Use memoized regex parsing to avoid repeated computation
- **Validation Updates**: Debounce validation to prevent excessive re-renders
- **Configuration Loading**: Load configurations once at startup, cache results
- **Reactive Updates**: Use Vue's computed properties for efficient reactivity

### Accessibility

- **Error Announcements**: Use `aria-describedby` to associate error messages with inputs
- **Color Contrast**: Ensure red validation borders meet WCAG AA contrast ratios
- **Screen Reader Support**: Error messages are properly announced
- **Keyboard Navigation**: Validation states don't interfere with keyboard navigation
- **Focus Management**: Focus remains on invalid inputs during validation

### Internationalization

- **English-Only**: All validation messages in English initially
- **Message Structure**: Use structured error messages for future i18n support
- **Token Format**: Maintain consistent `[TOKEN]` format across languages

### Analytics

- **Validation Events**: Track validation failures for UX insights
- **Template Usage**: Monitor which templates are most commonly used
- **Error Patterns**: Identify common validation failure patterns

### State Management

- **Validation State**: Store validation state in Vue reactive system
- **Configuration Cache**: Cache loaded configurations in composable
- **Error State**: Manage error messages and validation states reactively
- **Performance**: Use shallow refs for large validation state objects

### Error/Empty/Loading States

- **Configuration Loading**: Show loading state while configurations load
- **Parse Errors**: Handle malformed configuration files gracefully
- **Network Errors**: Handle configuration loading failures
- **Empty States**: Show helpful messages when no validation errors exist
- **Fallback Behavior**: Gracefully degrade when configuration is unavailable

## Risks & Mitigations

### Risk 1: Configuration File Complexity

**Risk**: Configuration files become too complex for non-developers  
**Mitigation**: Provide clear documentation and examples, consider future UI editor

### Risk 2: Performance Impact

**Risk**: Real-time validation impacts application performance  
**Mitigation**: Implement debouncing, memoization, and performance testing

### Risk 3: Breaking Changes

**Risk**: Configuration changes break existing functionality  
**Mitigation**: Maintain backward compatibility, comprehensive testing, staged rollout

### Risk 4: Validation Logic Complexity

**Risk**: Validation rules become too complex to maintain  
**Mitigation**: Keep validation simple initially, document extension points

### Risk 5: User Confusion

**Risk**: Validation feedback confuses users  
**Mitigation**: User testing, clear error messages, progressive disclosure

## Success Criteria & Measurement

### Success Metrics

1. **Template Update Frequency**: Non-developers can update templates independently
2. **Validation Accuracy**: 95% of validation errors are correctly identified
3. **User Completion Rate**: 90% of users complete prompts without missing tokens
4. **Performance Impact**: Validation adds <50ms to input response time
5. **Error Resolution**: Users resolve validation errors within 30 seconds

### Measurement Methods

- **Analytics**: Track validation events and user interactions
- **User Testing**: Observe users completing prompt generation tasks
- **Performance Monitoring**: Measure validation computation time
- **Error Logging**: Track validation failures and resolution patterns

## Public UI/API Types (Design)

### Core Types

```typescript
// Configuration Types
export interface PhaseConfig {
  id: PhaseId;
  title: string;
  template: string;
  description?: string;
}

export interface ValidationRule {
  token: string;
  required: boolean;
  message?: string;
}

export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  token: string;
  message: string;
  type: "required" | "format" | "custom";
}

export interface ValidationWarning {
  field: string;
  token: string;
  message: string;
  type: "suggestion" | "deprecation";
}

// Component Props
export interface PhaseConfigProviderProps {
  phases: Record<PhaseId, PhaseConfig>;
  fallbackTemplates?: Record<PhaseId, string>;
}

export interface ValidationProviderProps {
  globalInputs: GlobalInputs;
  phaseInputs: Record<string, string>;
  template: string;
  onValidationChange?: (state: ValidationState) => void;
}

export interface ValidatedInputProps {
  modelValue: string;
  isValid: boolean;
  errorMessage?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  "aria-describedby"?: string;
}

// Composable Return Types
export interface UseValidationReturn {
  validationState: ComputedRef<ValidationState>;
  validateInput: (field: string, value: string) => ValidationError[];
  validateAll: () => ValidationState;
  clearValidation: (field?: string) => void;
}

export interface UsePhaseConfigReturn {
  phaseConfigs: ComputedRef<Record<PhaseId, PhaseConfig>>;
  getPhaseConfig: (id: PhaseId) => PhaseConfig;
  updatePhaseConfig: (id: PhaseId, config: Partial<PhaseConfig>) => void;
  loadConfigurations: () => Promise<void>;
  isLoading: Ref<boolean>;
}

// Token Analysis Types
export interface TokenAnalysis {
  tokens: string[];
  requiredTokens: string[];
  availableTokens: string[];
  missingTokens: string[];
  unusedTokens: string[];
}

export interface TokenParseResult {
  tokens: string[];
  positions: Array<{start: number; end: number; token: string}>;
  hasUnclosedTokens: boolean;
  hasInvalidTokens: boolean;
}

// Event Types
export interface ValidationEvent {
  type: "validation_start" | "validation_complete" | "validation_error";
  field?: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface ConfigLoadEvent {
  type: "config_load_start" | "config_load_success" | "config_load_error";
  phaseId?: PhaseId;
  timestamp: number;
  error?: Error;
}

// Utility Types
export type ValidationStatus =
  | "idle"
  | "validating"
  | "valid"
  | "invalid"
  | "error";

export type ConfigLoadStatus = "idle" | "loading" | "loaded" | "error";

export type TokenType = "global" | "phase" | "custom" | "unknown";

// Extended Phase Interface
export interface PhaseWithValidation extends Phase {
  validationState: ValidationState;
  requiredInputs: string[];
  tokenAnalysis: TokenAnalysis;
}
```

### Component Interfaces

```typescript
// Validation Components
export interface ValidationIndicatorProps {
  status: ValidationStatus;
  message?: string;
  compact?: boolean;
}

export interface ValidationSummaryProps {
  validationState: ValidationState;
  showWarnings?: boolean;
  compact?: boolean;
}

// Input Components
export interface ValidatedGlobalInputProps extends ValidatedInputProps {
  field: keyof GlobalInputs;
  globalInputs: GlobalInputs;
}

export interface ValidatedPhaseInputProps extends ValidatedInputProps {
  token: string;
  phaseInputs: Record<string, string>;
}

// Configuration Components
export interface PhaseConfigEditorProps {
  phaseId: PhaseId;
  config: PhaseConfig;
  onUpdate: (config: Partial<PhaseConfig>) => void;
  readOnly?: boolean;
}
```

### Error Handling Types

```typescript
export interface ConfigLoadError extends Error {
  phaseId?: PhaseId;
  fileName?: string;
  cause?: Error;
}

export interface ValidationError extends Error {
  field: string;
  token: string;
  code: string;
  context?: Record<string, unknown>;
}

export interface TokenParseError extends Error {
  template: string;
  position?: number;
  token?: string;
}
```

### Configuration Schema

```typescript
// Phase Configuration Schema
export const PHASE_CONFIG_SCHEMA = {
  type: "object",
  required: ["id", "title", "template"],
  properties: {
    id: {type: "string", enum: ["0", "1", "2", "2.5", "3", "4"]},
    title: {type: "string", minLength: 1},
    template: {type: "string", minLength: 1},
    description: {type: "string"},
  },
} as const;

// Validation Rule Schema
export const VALIDATION_RULE_SCHEMA = {
  type: "object",
  required: ["token", "required"],
  properties: {
    token: {type: "string", pattern: "^[A-Z_]+$"},
    required: {type: "boolean"},
    message: {type: "string"},
  },
} as const;
```

---

**PRD Version**: 1.0  
**Created**: Staff Engineer  
**Status**: Ready for Implementation  
**Next Steps**: Technical design review, implementation planning, user testing preparation
