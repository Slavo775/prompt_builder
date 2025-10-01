# PRD: Add Phase 6 (Fix TSC/ESLint/Tests)

## Background & Problem Statement

The prompt builder application currently supports 6 phases (0-5) for different stages of project development, but Phase 6 is only partially integrated. While the phase configuration exists in `phase-6.ts` and is imported in the config index, the application's type system and UI components do not fully recognize Phase 6, preventing users from accessing this critical "Fix TSC/ESLint/Tests" phase.

**Current State:**

- Phase 6 configuration exists with a comprehensive template for fixing TypeScript, ESLint, and test issues
- PhaseId type includes "6" but Phase interface only supports "0" through "5"
- Phase navigation and management logic hardcodes phase lists without including Phase 6
- Users cannot access or use Phase 6 through the UI

**Problem:**
Users cannot access the Phase 6 "Fix TSC/ESLint/Tests" functionality, which is essential for maintaining code quality and ensuring all linting, type checking, and testing passes before project completion.

## Goals and Non-Goals

### Goals

1. **Full Phase 6 Integration**: Complete the integration of Phase 6 into the application's type system and UI
2. **Seamless User Experience**: Users can access Phase 6 through the phase navigation and use all existing features
3. **Type Safety**: Ensure all TypeScript types properly support Phase 6 without breaking existing functionality
4. **Consistent Behavior**: Phase 6 behaves identically to other phases in terms of template editing, input management, and output generation

### Non-Goals

1. **New Phase 6 Features**: This PRD does not add new functionality specific to Phase 6 beyond what exists in other phases
2. **Template Modifications**: No changes to the existing Phase 6 template content
3. **UI/UX Changes**: No visual or interaction changes beyond making Phase 6 accessible
4. **Infrastructure Changes**: No modifications to build tools, configuration files, or dependencies

## User Stories & Acceptance Criteria

### US-1: Phase Navigation Access

**As a** user of the prompt builder  
**I want** to see Phase 6 in the phase navigation  
**So that** I can access the "Fix TSC/ESLint/Tests" functionality

**Acceptance Criteria:**

- [ ] Phase 6 appears in the phase navigation with title "Fix TSC/ESLint/Tests"
- [ ] Phase 6 can be selected and becomes the active phase
- [ ] Phase 6 displays with the same visual styling as other phases
- [ ] Phase 6 shows the correct phase number (6) in the navigation

### US-2: Phase 6 Template Access

**As a** user who has selected Phase 6  
**I want** to view and edit the Phase 6 template  
**So that** I can customize the TSC/ESLint/Tests fixing prompt

**Acceptance Criteria:**

- [ ] Phase 6 template loads and displays in the template editor
- [ ] Template can be edited when overrides are enabled
- [ ] Template changes are saved to localStorage
- [ ] Template reset functionality works for Phase 6

### US-3: Phase 6 Input Management

**As a** user working with Phase 6  
**I want** to add custom inputs and tokens  
**So that** I can customize the fixing prompt with project-specific information

**Acceptance Criteria:**

- [ ] Phase 6 supports custom input fields
- [ ] Input values are saved and restored from localStorage
- [ ] Token replacement works with Phase 6 inputs
- [ ] Input validation functions correctly

### US-4: Phase 6 Output Generation

**As a** user with Phase 6 selected  
**I want** to generate the final prompt output  
**So that** I can use the TSC/ESLint/Tests fixing instructions

**Acceptance Criteria:**

- [ ] Phase 6 generates output using token replacement
- [ ] Output can be copied to clipboard
- [ ] Output is saved as lastOutput in localStorage
- [ ] Preview updates in real-time as inputs change

### US-5: Phase 6 Export/Import

**As a** user managing project data  
**I want** Phase 6 data included in export/import operations  
**So that** I can share complete project configurations including Phase 6

**Acceptance Criteria:**

- [ ] Phase 6 data is included in export operations
- [ ] Phase 6 data is restored during import operations
- [ ] Phase 6 maintains its state across export/import cycles

## Functional Requirements

### FR-1: Type System Updates

**Requirement**: Update TypeScript interfaces to fully support Phase 6

- Update `Phase` interface to include "6" in the id union type
- Ensure all Phase-related types support Phase 6
- Maintain backward compatibility with existing phases

### FR-2: Phase Management Integration

**Requirement**: Integrate Phase 6 into the phase management system

- Update `phasesList` computed property to include Phase 6
- Ensure Phase 6 is included in all phase iteration operations
- Maintain consistent phase ordering (0, 1, 2, 2.5, 3, 4, 5, 6)

### FR-3: Navigation Component Updates

**Requirement**: Update phase navigation to display Phase 6

- Phase 6 appears in the navigation component
- Phase 6 can be selected and becomes active
- Phase 6 displays with correct styling and accessibility attributes

### FR-4: Template System Integration

**Requirement**: Ensure Phase 6 works with the template system

- Phase 6 template loads from configuration
- Template editing works for Phase 6
- Template reset functionality works for Phase 6

### FR-5: Input Management Integration

**Requirement**: Ensure Phase 6 works with the input management system

- Phase 6 supports custom inputs
- Input values persist in localStorage
- Input validation works for Phase 6

### FR-6: Token Replacement Integration

**Requirement**: Ensure Phase 6 works with token replacement

- Global inputs work with Phase 6 templates
- Phase 6 custom inputs work with token replacement
- Token replacement validation works for Phase 6

### FR-7: Output Generation Integration

**Requirement**: Ensure Phase 6 works with output generation

- Phase 6 generates output using token replacement
- Output can be copied and saved
- Preview updates in real-time

### FR-8: Export/Import Integration

**Requirement**: Ensure Phase 6 works with export/import

- Phase 6 data is included in exports
- Phase 6 data is restored during imports
- Phase 6 state persists across sessions

## Technical Considerations

### Performance

- **No Performance Impact**: Adding Phase 6 to existing arrays and types has negligible performance impact
- **Memory Usage**: Minimal increase in memory usage due to one additional phase object
- **Rendering**: No impact on rendering performance as Phase 6 uses existing component patterns

### Accessibility

- **ARIA Support**: Phase 6 navigation button includes proper ARIA attributes (`aria-current="page"`)
- **Keyboard Navigation**: Phase 6 is accessible via keyboard navigation
- **Screen Reader Support**: Phase 6 title and number are properly announced
- **Focus Management**: Phase 6 selection follows existing focus management patterns

### Internationalization

- **No i18n Impact**: Phase 6 uses the same text content patterns as other phases
- **Future i18n Ready**: Phase 6 configuration follows the same structure for future i18n implementation

### Analytics

- **No Analytics Changes**: Phase 6 uses existing analytics patterns
- **Event Tracking**: Phase 6 selection and usage can be tracked using existing event systems

### State Management

- **LocalStorage Integration**: Phase 6 state persists using existing localStorage patterns
- **Reactive Updates**: Phase 6 state changes trigger reactive updates using Vue's reactivity system
- **State Consistency**: Phase 6 state management follows the same patterns as other phases

### Error Handling

- **Configuration Loading**: Phase 6 configuration loading follows existing error handling patterns
- **Input Validation**: Phase 6 input validation uses existing validation systems
- **Template Processing**: Phase 6 template processing uses existing error handling

### Empty States

- **Default State**: Phase 6 starts with default configuration and empty inputs
- **Template Override**: Phase 6 shows template override controls when enabled
- **Input Management**: Phase 6 shows input management interface consistent with other phases

### Loading States

- **Configuration Loading**: Phase 6 configuration loads synchronously with other phases
- **No Async Operations**: Phase 6 does not introduce new async operations
- **Consistent Loading**: Phase 6 loading behavior matches other phases

## Risks & Mitigations

### Risk 1: Type System Breaking Changes

**Risk**: Updating Phase interface could break existing code that doesn't expect Phase 6
**Mitigation**:

- Use union type extension that maintains backward compatibility
- Ensure all existing code continues to work with Phase 6
- Add comprehensive type checking to catch any issues

### Risk 2: Hardcoded Phase Lists

**Risk**: Some code might have hardcoded phase lists that don't include Phase 6
**Mitigation**:

- Audit all phase iteration code to ensure Phase 6 is included
- Use computed properties and configuration-driven phase lists
- Add tests to verify Phase 6 is included in all relevant operations

### Risk 3: LocalStorage Data Migration

**Risk**: Existing localStorage data might not include Phase 6
**Mitigation**:

- Ensure Phase 6 is created with default values when missing
- Use existing phase creation logic that handles missing phases
- Maintain backward compatibility with existing data

### Risk 4: UI Layout Issues

**Risk**: Adding Phase 6 might cause UI layout issues in phase navigation
**Mitigation**:

- Test phase navigation with all phases including Phase 6
- Ensure responsive design works with additional phase
- Use existing styling patterns that accommodate variable phase counts

### Risk 5: Performance Degradation

**Risk**: Adding Phase 6 might impact application performance
**Mitigation**:

- Phase 6 uses existing patterns with minimal overhead
- No new async operations or complex computations
- Existing performance optimizations apply to Phase 6

## Success Criteria & Measurement

### Success Criteria

1. **Functional Completeness**: Phase 6 is fully accessible and functional through the UI
2. **Type Safety**: All TypeScript types properly support Phase 6 without errors
3. **User Experience**: Phase 6 behaves identically to other phases in terms of functionality
4. **Data Persistence**: Phase 6 data persists across browser sessions
5. **Export/Import**: Phase 6 data is included in export/import operations

### Measurement

- **TypeScript Compilation**: `npm run typecheck` passes without errors
- **Linting**: `npm run lint` passes without errors
- **Testing**: `npm run test` passes with all existing tests
- **Build**: `npm run build` completes successfully
- **Manual Testing**: All Phase 6 functionality works as expected

### Key Metrics

- **Phase 6 Accessibility**: Phase 6 appears in navigation and can be selected
- **Template Functionality**: Phase 6 template loads, edits, and resets correctly
- **Input Management**: Phase 6 inputs save, load, and validate correctly
- **Output Generation**: Phase 6 generates output with token replacement
- **Data Persistence**: Phase 6 data persists across browser sessions

## Public UI/API Types (Design)

### Core Phase Types

```typescript
// Updated Phase interface to include Phase 6
export interface Phase {
  id: "0" | "1" | "2" | "2.5" | "3" | "4" | "5" | "6";
  title: string;
  template: string;
  overridesEnabled: boolean;
  inputs: Record<string, string>;
  lastOutput: string;
}

// PhaseId type already includes "6" - no changes needed
export type PhaseId = "0" | "1" | "2" | "2.5" | "3" | "4" | "5" | "6";

// PhaseMap interface supports Phase 6 through PhaseId
export interface PhaseMap {
  [phaseId: string]: Phase;
}
```

### Phase Configuration Types

```typescript
// PhaseConfig interface already supports Phase 6 through PhaseId
export interface PhaseConfig {
  id: PhaseId;
  title: string;
  template: string;
  description: string;
}

// Phase configuration record supports Phase 6
export const PHASE_CONFIGS: Record<PhaseId, PhaseConfig> = {
  "0": PHASE_0_CONFIG,
  "1": PHASE_1_CONFIG,
  "2": PHASE_2_CONFIG,
  "2.5": PHASE_2_5_CONFIG,
  "3": PHASE_3_CONFIG,
  "4": PHASE_4_CONFIG,
  "5": PHASE_5_CONFIG,
  "6": PHASE_6_CONFIG,
};
```

### Component Props Types

```typescript
// PhaseNavigation component props support Phase 6
export interface PhaseNavigationProps {
  phasesList: Phase[];
  currentPhaseId: PhaseId;
}

// PhaseView component props support Phase 6
export interface PhaseViewProps {
  phase: Phase;
  globalInputs: GlobalInputs;
  onPhaseUpdate: (phaseId: string, updates: Partial<Phase>) => void;
  onInputUpdate: (phaseId: string, key: string, value: string) => void;
}

// PhasePreview component props support Phase 6
export interface PhasePreviewProps {
  template: string;
  replacements: ReplacementMap;
  onOutputUpdate: (output: string) => void;
}
```

### Composable Return Types

```typescript
// usePhases composable return type supports Phase 6
export interface UsePhasesReturn {
  currentPhaseId: Ref<PhaseId>;
  getPhase: (id: PhaseId) => Phase;
  updatePhase: (id: string, updates: Partial<Omit<Phase, "id">>) => void;
  updatePhaseInput: (phaseId: string, key: string, value: string) => void;
  removePhaseInput: (phaseId: string, key: string) => void;
  resetPhaseToDefault: (id: string) => void;
  phasesList: ComputedRef<Phase[]>;
  currentPhase: ComputedRef<Phase>;
  hasUnsavedChanges: ComputedRef<boolean>;
  exportPhases: () => ExportData;
  importPhases: (data: ImportData) => void;
}

// usePhaseConfig composable return type supports Phase 6
export interface UsePhaseConfigReturn {
  phaseConfigs: ComputedRef<Record<PhaseId, PhaseConfig>>;
  getPhaseConfig: (id: PhaseId) => PhaseConfig;
  updatePhaseConfig: (id: PhaseId, config: Partial<PhaseConfig>) => void;
  loadConfigurations: () => Promise<void>;
  isLoading: Ref<boolean>;
}
```

### Event Types

```typescript
// Phase change events support Phase 6
export interface PhaseChangeEvent {
  type: "phase-change";
  phaseId: PhaseId;
  timestamp: number;
}

// Phase update events support Phase 6
export interface PhaseUpdateEvent {
  type: "phase-update";
  phaseId: PhaseId;
  updates: Partial<Phase>;
  timestamp: number;
}
```

### Validation Types

```typescript
// Phase validation supports Phase 6
export interface PhaseValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  phaseId: PhaseId;
}

// Template validation supports Phase 6
export interface TemplateValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  phaseId: PhaseId;
  template: string;
}
```

### Export/Import Types

```typescript
// Export data includes Phase 6
export interface ExportData {
  phases: Phase[];
  globalInputs: GlobalInputs;
  exportedAt: string;
  version: string;
}

// Import data supports Phase 6
export interface ImportData {
  phases: Phase[];
  globalInputs: GlobalInputs;
  importedAt?: string;
  version?: string;
}
```

### Constants and Enums

```typescript
// Phase titles include Phase 6
export const DEFAULT_PHASE_TITLES: Record<PhaseId, string> = {
  "0": "Discovery",
  "1": "Planning",
  "2": "Implementation",
  "2.5": "Review",
  "3": "Testing",
  "4": "Deployment",
  "5": "Fix Report",
  "6": "Fix TSC/ESLint/Tests",
} as const;

// Phase templates include Phase 6
export const DEFAULT_PHASE_TEMPLATES: Record<PhaseId, string> = {
  "0": PHASE_CONFIGS[0].template,
  "1": PHASE_CONFIGS[1].template,
  "2": PHASE_CONFIGS[2].template,
  "2.5": PHASE_CONFIGS[2.5].template,
  "3": PHASE_CONFIGS[3].template,
  "4": PHASE_CONFIGS[4].template,
  "5": PHASE_CONFIGS[5].template,
  "6": PHASE_CONFIGS[6].template,
} as const;
```

---

**Document Version**: 1.0  
**Created**: Generated by Product Manager  
**Status**: Ready for Implementation  
**Next Steps**: Create RFC for implementation details and begin development
