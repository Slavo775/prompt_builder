# PRD: Native Prompts Selector with Unified Styling

**Version**: 2.0  
**Status**: Draft  
**Owner**: Product Manager  
**Created**: 2025-10-02  
**Supersedes**: PRD_PROMPTS_AS_SELECTOR.md v1.0

## Background & Problem Statement

### Current State Analysis

The current PhaseSelector implementation (v1.0) uses a custom dropdown component with Teleport rendering. While functional, it has several limitations:

1. **Non-Native Implementation**: Custom dropdown doesn't leverage browser accessibility features
2. **Styling Inconsistency**: PhaseSelector styling differs from GlobalInputs form controls
3. **Maintenance Overhead**: Custom dropdown requires additional JavaScript for positioning, focus management, and event handling
4. **Mobile Experience**: Custom implementation may not integrate well with mobile form controls

### Problem Statement

Users need a space-efficient phase selection interface that:

- Uses native HTML form controls for maximum accessibility and mobile compatibility
- Maintains visual consistency with existing GlobalInputs styling
- Reduces JavaScript complexity and maintenance burden
- Provides the same space savings as the custom dropdown (70%+ reduction)

### User Impact

- **Accessibility**: Native controls provide better screen reader support and keyboard navigation
- **Mobile UX**: Native selects integrate with mobile OS selection interfaces
- **Visual Consistency**: Unified styling creates a cohesive form experience
- **Performance**: Reduced JavaScript bundle size and complexity

## Goals and Non-Goals

### Goals

1. **Native Implementation**: Replace custom dropdown with native HTML `<select>` element
2. **Unified Styling**: Match GlobalInputs padding, borders, and visual design exactly
3. **Space Efficiency**: Maintain 70%+ space reduction from original PhaseNavigation
4. **Accessibility Excellence**: Leverage native accessibility features with WCAG 2.1 AA compliance
5. **Mobile Optimization**: Provide optimal mobile form experience with native controls
6. **Simplified Maintenance**: Reduce custom JavaScript and CSS complexity

### Non-Goals

1. **Advanced Dropdown Features**: No search, filtering, or custom option rendering
2. **Animation/Transitions**: Native selects don't support custom animations
3. **Custom Positioning**: Native selects handle their own positioning
4. **Multi-Select**: Single selection only (matches current behavior)

## User Stories & Acceptance Criteria

### Epic: Native Phase Selector Implementation

#### Story 1: Native Select Integration

**As a** prompt builder user  
**I want** a native HTML select for phase selection  
**So that** I get optimal accessibility and mobile experience

**Acceptance Criteria:**

- [ ] Phase selection uses native HTML `<select>` element
- [ ] All phases display as `<option>` elements with proper values
- [ ] Selection immediately updates current phase
- [ ] Native keyboard navigation works (Arrow keys, Enter, Escape)
- [ ] Mobile devices show native selection interface

#### Story 2: Unified Visual Design

**As a** prompt builder user  
**I want** the phase selector to match global input styling  
**So that** the interface feels cohesive and professional

**Acceptance Criteria:**

- [ ] Phase selector padding matches GlobalInputs (0.5rem)
- [ ] Border styling identical to GlobalInputs (1px solid #d1d5db)
- [ ] Border radius matches GlobalInputs (0.375rem)
- [ ] Focus states identical (blue border + shadow)
- [ ] Font size and weight consistent (0.875rem)

#### Story 3: Compact Space Usage

**As a** prompt builder user  
**I want** minimal vertical space usage for phase selection  
**So that** I have more room for content editing

**Acceptance Criteria:**

- [ ] Phase selector height ≤3rem (vs original ~30rem)
- [ ] Maintains current phase context in label
- [ ] Shows phase number and abbreviated title
- [ ] Responsive design works on all screen sizes

#### Story 4: Enhanced Accessibility

**As a** screen reader user  
**I want** proper semantic markup and announcements  
**So that** I can efficiently navigate phase selection

**Acceptance Criteria:**

- [ ] Proper `<label>` association with select element
- [ ] Screen reader announces current selection
- [ ] Option text provides clear phase identification
- [ ] Focus management follows web standards
- [ ] High contrast mode compatibility

## Functional Requirements

### FR1: Native Select Implementation

**Requirement**: Replace PhaseSelector.vue with native HTML select element

- **Input**: List of phases, current phase ID, view type
- **Output**: Phase selection change events
- **Behavior**: Standard HTML select with immediate value updates

### FR2: Option Formatting

**Requirement**: Format select options for optimal readability

- **Format**: `Phase {number}: {title}` (e.g., "Phase 0: Create/refresh REPO_CONSTRAINTS.md")
- **Truncation**: Titles truncated to fit mobile screens (≤40 characters)
- **Value**: Use phase ID as option value for form submission

### FR3: Unified Styling System

**Requirement**: Match GlobalInputs visual design exactly

- **Padding**: 0.5rem (matching GlobalInputs)
- **Border**: 1px solid #d1d5db with 0.375rem radius
- **Focus**: Blue border (#3b82f6) with 3px shadow
- **Typography**: 0.875rem font size, consistent weight

### FR4: Label Integration

**Requirement**: Provide proper form labeling

- **Label Text**: "Current Phase" or "Select Phase"
- **Association**: Proper `for` attribute linking to select ID
- **Styling**: Match GlobalInputs label styling

### FR5: View-Aware Options

**Requirement**: Show appropriate phases based on current view

- **Frontend View**: Display phases 0-6
- **Backend View**: Display backend phases 0-3
- **Dynamic Updates**: Options update when view changes

## Technical Considerations

### Architecture

- **Component Simplification**: Replace PhaseSelector.vue with NativePhaseSelector.vue
- **Reduced Dependencies**: Remove usePhaseSelector composable complexity
- **Form Integration**: Leverage native form validation and submission
- **Event Compatibility**: Maintain same `phase-change` event signature

### Implementation Approach

1. **Native HTML**: Use `<select>` with `<option>` elements
2. **CSS-Only Styling**: No JavaScript for visual behavior
3. **Vue Integration**: v-model for reactive value binding
4. **Event Handling**: Standard @change event for selection

### Browser Support

- **Universal Support**: Native selects work in all browsers
- **Mobile Optimization**: Native mobile selection interfaces
- **Accessibility**: Built-in screen reader support
- **Performance**: Zero JavaScript overhead for dropdown behavior

## Performance, Accessibility, i18n, Analytics, State Management

### Performance

- **Bundle Size**: ~80% reduction in JavaScript (remove custom dropdown logic)
- **Runtime**: Zero JavaScript execution for dropdown behavior
- **Memory**: Reduced DOM complexity and event listeners
- **Rendering**: Native browser optimization for select elements

### Accessibility (a11y)

- **Native Support**: Built-in screen reader announcements
- **Keyboard Navigation**: Standard browser keyboard handling
- **Focus Management**: Native focus behavior
- **ARIA**: Implicit ARIA roles and properties
- **High Contrast**: Native high contrast mode support
- **Mobile**: Native mobile accessibility features

### Internationalization (i18n)

- **Current State**: Application is English-only
- **Future Preparation**:
  - Externalize label text ("Current Phase", "Select Phase")
  - Support RTL layouts for label positioning
  - Locale-aware phase title formatting

### Analytics

- **Events to Track**:
  - `native_phase_selected` - Phase changed via native select
  - `phase_selector_focused` - Select element focused
  - `mobile_selection_used` - Native mobile interface used
- **Properties**: `phase_id`, `view_type`, `device_type`

### State Management

- **Simplified**: Direct v-model binding to currentPhaseId
- **No Local State**: Native select manages its own state
- **Global State**: Same phase management composables
- **Persistence**: No changes to localStorage behavior

### Error Handling

- **Invalid Phase**: Default to Phase 0 with console warning
- **Missing Phases**: Show "No phases available" option
- **View Switching**: Graceful fallback when phase not available in new view

### Empty States

- **No Phases**: Disabled select with "No phases available" option
- **Loading**: Select shows current phase immediately (no loading state needed)

### Loading States

- **Immediate**: Native selects render synchronously
- **Phase Switch**: Instant UI update, no loading indicators

## Risks & Mitigations

### Risk 1: Limited Customization

**Impact**: Medium - Cannot customize native select appearance extensively  
**Probability**: High - Browser limitations on select styling  
**Mitigation**:

- Focus on consistent padding, borders, and typography
- Use CSS custom properties for theme consistency
- Accept browser-specific select arrow styling

### Risk 2: Mobile UX Differences

**Impact**: Low - Different mobile selection interfaces  
**Probability**: Medium - iOS/Android have different native UIs  
**Mitigation**:

- Test on multiple mobile platforms
- Ensure option text is readable on all devices
- Leverage native mobile advantages (haptic feedback, etc.)

### Risk 3: Reduced Visual Appeal

**Impact**: Low - Less visually distinctive than custom dropdown  
**Probability**: Medium - Native selects are more basic  
**Mitigation**:

- Ensure excellent typography and spacing
- Use consistent visual hierarchy
- Focus on usability over visual complexity

### Risk 4: Option Text Limitations

**Impact**: Low - Limited formatting options for option text  
**Probability**: High - Native options only support plain text  
**Mitigation**:

- Optimize option text format for clarity
- Use consistent phase numbering
- Ensure truncation doesn't lose important information

## Success Criteria & Measurement

### Primary Metrics

1. **Space Efficiency**: Sidebar height reduction ≥70% maintained
2. **Accessibility Score**: Lighthouse accessibility score improves to 100
3. **Bundle Size**: JavaScript reduction ≥80% for phase selection
4. **Mobile Usability**: Mobile form completion rate increase ≥15%

### Secondary Metrics

1. **Development Velocity**: Reduced maintenance overhead
2. **Cross-Browser Consistency**: Zero browser-specific issues
3. **User Satisfaction**: Improved form interaction feedback
4. **Performance**: Faster initial render and interaction response

### Success Timeline

- **Week 1**: Native implementation complete, styling unified
- **Week 2**: Cross-browser and mobile testing
- **Week 3**: Accessibility audit and deployment
- **Week 4**: Success metrics evaluation

## Public UI/API Types (Design)

### Core Component Types

```typescript
// Native Phase Selector Component Props
export interface NativePhaseSelectorProps {
  /** List of available phases for current view */
  readonly phasesList: ReadonlyArray<Phase | BackendPhase>;
  /** Currently selected phase ID */
  readonly currentPhaseId: AnyPhaseId;
  /** Current view type (frontend/backend) */
  readonly viewType?: ViewType;
  /** Whether selector is disabled */
  readonly disabled?: boolean;
  /** Custom label text */
  readonly label?: string;
  /** Custom CSS classes */
  readonly class?: string;
  /** Form field ID for label association */
  readonly id?: string;
}

// Native Phase Selector Events
export interface NativePhaseSelectorEmits {
  /** Emitted when user selects a different phase */
  "phase-change": [phaseId: AnyPhaseId];
  /** Emitted when select element gains focus */
  focus: [event: FocusEvent];
  /** Emitted when select element loses focus */
  blur: [event: FocusEvent];
}

// Phase Option Data for Native Select
export interface NativePhaseOption {
  /** Phase ID used as option value */
  readonly value: AnyPhaseId;
  /** Display text for option */
  readonly text: string;
  /** Whether this option is selected */
  readonly selected: boolean;
  /** Whether this option is disabled */
  readonly disabled?: boolean;
}

// Form Integration Types
export interface PhaseFormField {
  /** Field identifier */
  readonly id: string;
  /** Field name for form submission */
  readonly name: string;
  /** Current field value */
  readonly value: AnyPhaseId;
  /** Whether field is required */
  readonly required: boolean;
  /** Field validation state */
  readonly valid: boolean;
}
```

### Styling & Theme Types

```typescript
// Unified Form Control Styling
export interface FormControlTheme {
  /** Input/select padding */
  readonly padding: string;
  /** Border styling */
  readonly border: string;
  /** Border radius */
  readonly borderRadius: string;
  /** Font size */
  readonly fontSize: string;
  /** Font weight */
  readonly fontWeight: string;
  /** Text color */
  readonly color: string;
  /** Background color */
  readonly backgroundColor: string;
}

// Focus State Styling
export interface FocusStateTheme {
  /** Focus border color */
  readonly borderColor: string;
  /** Focus box shadow */
  readonly boxShadow: string;
  /** Focus outline (should be none for custom styling) */
  readonly outline: string;
}

// Label Styling Configuration
export interface LabelTheme {
  /** Label font size */
  readonly fontSize: string;
  /** Label font weight */
  readonly fontWeight: string;
  /** Label text color */
  readonly color: string;
  /** Label margin bottom */
  readonly marginBottom: string;
}
```

### Utility & Helper Types

```typescript
// Phase Option Formatter
export type PhaseOptionFormatter = (
  phase: Phase | BackendPhase,
  maxLength?: number
) => string;

// Form Validation Result
export interface ValidationResult {
  /** Whether the selection is valid */
  readonly valid: boolean;
  /** Error message if validation failed */
  readonly error?: string;
}

// Native Select Configuration
export interface NativeSelectConfig {
  /** Maximum option text length */
  readonly maxOptionLength: number;
  /** Whether to show phase numbers */
  readonly showPhaseNumbers: boolean;
  /** Text truncation strategy */
  readonly truncationStrategy: "ellipsis" | "word-break" | "none";
}
```

### Integration & Composable Types

```typescript
// Simplified Composable for Native Select
export interface UseNativePhaseSelectorReturn {
  /** Formatted options for native select */
  readonly options: ComputedRef<NativePhaseOption[]>;
  /** Currently selected option */
  readonly selectedOption: ComputedRef<NativePhaseOption | undefined>;
  /** Form field configuration */
  readonly fieldConfig: ComputedRef<PhaseFormField>;
  /** Event handlers */
  readonly handlers: {
    readonly onChange: (event: Event) => void;
    readonly onFocus: (event: FocusEvent) => void;
    readonly onBlur: (event: FocusEvent) => void;
  };
}

// Component Registration
export interface NativePhaseSelectorComponent {
  readonly name: "NativePhaseSelector";
  readonly props: NativePhaseSelectorProps;
  readonly emits: NativePhaseSelectorEmits;
  readonly setup: (
    props: NativePhaseSelectorProps,
    context: SetupContext<NativePhaseSelectorEmits>
  ) => UseNativePhaseSelectorReturn;
}
```

### CSS Custom Properties

```typescript
// Design Token Definitions
export interface PhaseSelectTokens {
  /** Form control padding */
  readonly "--phase-select-padding": "0.5rem";
  /** Border styling */
  readonly "--phase-select-border": "1px solid #d1d5db";
  /** Border radius */
  readonly "--phase-select-border-radius": "0.375rem";
  /** Font size */
  readonly "--phase-select-font-size": "0.875rem";
  /** Focus border color */
  readonly "--phase-select-focus-border": "#3b82f6";
  /** Focus shadow */
  readonly "--phase-select-focus-shadow": "0 0 0 3px rgba(59, 130, 246, 0.1)";
}
```

### Accessibility Types

```typescript
// Accessibility Configuration
export interface A11yConfig {
  /** Label text for the select element */
  readonly labelText: string;
  /** Help text for screen readers */
  readonly helpText?: string;
  /** Error message format */
  readonly errorMessageFormat: string;
  /** Selection announcement format */
  readonly selectionAnnouncementFormat: string;
}

// Screen Reader Support
export interface ScreenReaderSupport {
  /** Whether to announce option count */
  readonly announceOptionCount: boolean;
  /** Whether to announce current selection */
  readonly announceCurrentSelection: boolean;
  /** Custom aria-label format */
  readonly ariaLabelFormat: string;
}
```

---

**Document Status**: Ready for Implementation  
**Next Steps**: Native Implementation, Unified Styling, Mobile Testing  
**Dependencies**: None (pure UI enhancement)  
**Estimated Effort**: 0.5-1 sprint (4-8 story points)  
**Key Benefits**: Reduced complexity, improved accessibility, unified design
