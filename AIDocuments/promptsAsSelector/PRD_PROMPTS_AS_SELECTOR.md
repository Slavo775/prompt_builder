# PRD: Prompts as Selector/Dropdown Interface

**Version**: 1.0  
**Status**: Draft  
**Owner**: Product Manager  
**Created**: 2025-10-02

## Background & Problem Statement

### Current State

The prompt builder application currently displays phase selection through a vertical list of buttons in the sidebar navigation (`PhaseNavigation.vue`). Each phase is represented as a full-width button containing:

- Phase number in a circular badge
- Full phase title text
- Active/inactive visual states

### Problem

The current phase navigation takes up significant vertical space in the sidebar, especially with 8+ phases (0, 1, 2, 2.5, 3, 4, 5, 6) across frontend and backend views. This creates several UX issues:

1. **Space Inefficiency**: Each phase button requires ~3.5rem height + margins, consuming ~30rem total vertical space
2. **Scrolling Required**: On smaller screens, users must scroll within the sidebar to access all phases
3. **Visual Clutter**: The large button list dominates the sidebar, reducing focus on global inputs
4. **Scalability Issues**: Adding more phases (future Phase 7, 8, etc.) will worsen the space problem

### User Impact

- **Reduced Productivity**: Users spend time scrolling to find phases
- **Poor Mobile Experience**: Limited screen real estate makes navigation cumbersome
- **Cognitive Load**: Large navigation list creates visual noise

## Goals and Non-Goals

### Goals

1. **Space Optimization**: Reduce phase navigation footprint by 70%+
2. **Improved Accessibility**: Maintain keyboard navigation and screen reader support
3. **Enhanced UX**: Provide quick phase switching with visual context
4. **Scalability**: Support future phase additions without UI degradation
5. **Consistency**: Align with modern dropdown/selector patterns

### Non-Goals

1. **Phase Reordering**: Not changing phase sequence or IDs
2. **Phase Management**: Not adding/removing/editing phase configurations
3. **Template Changes**: Not modifying phase template structures
4. **Backend Logic**: Not changing phase state management or persistence

## User Stories & Acceptance Criteria

### Epic: Phase Selection Redesign

#### Story 1: Compact Phase Selector

**As a** prompt builder user  
**I want** a compact dropdown selector for phases  
**So that** I can quickly switch between phases without scrolling

**Acceptance Criteria:**

- [ ] Phase navigation displays as a single dropdown/select element
- [ ] Dropdown shows current phase with number and abbreviated title
- [ ] All phases are accessible via dropdown options
- [ ] Selection immediately switches to chosen phase
- [ ] Dropdown takes ≤5rem vertical space (vs current ~30rem)

#### Story 2: Enhanced Phase Context

**As a** prompt builder user  
**I want** clear visual indication of the current phase  
**So that** I always know which phase I'm working on

**Acceptance Criteria:**

- [ ] Selected phase displays prominently in dropdown trigger
- [ ] Phase number badge remains visible in selector
- [ ] Current phase title shown in main content area
- [ ] Visual consistency with existing design system

#### Story 3: Keyboard Accessibility

**As a** keyboard user  
**I want** full keyboard navigation of the phase selector  
**So that** I can efficiently navigate without a mouse

**Acceptance Criteria:**

- [ ] Tab navigation focuses on phase selector
- [ ] Arrow keys navigate through phase options
- [ ] Enter/Space selects highlighted phase
- [ ] Escape closes dropdown without selection
- [ ] Screen reader announces phase changes

#### Story 4: Mobile Optimization

**As a** mobile user  
**I want** an optimized phase selection experience  
**So that** I can effectively use the app on small screens

**Acceptance Criteria:**

- [ ] Dropdown renders appropriately on mobile devices
- [ ] Touch interactions work smoothly
- [ ] Options remain readable on small screens
- [ ] No horizontal scrolling required

## Functional Requirements

### FR1: Phase Selector Component

**Requirement**: Replace `PhaseNavigation.vue` with a dropdown-based selector component

- **Input**: List of phases, current phase ID, view type
- **Output**: Phase selection events
- **Behavior**: Single-select dropdown with immediate phase switching

### FR2: Dropdown Option Rendering

**Requirement**: Each dropdown option displays phase context

- **Format**: `{number} - {abbreviated_title}`
- **Length**: Phase titles truncated to ≤30 characters
- **Styling**: Consistent with existing button styles

### FR3: Current Phase Display

**Requirement**: Selected phase prominently displayed in dropdown trigger

- **Format**: `Phase {number}: {title}`
- **Truncation**: Title truncated with ellipsis if >25 characters
- **Badge**: Circular number badge matching current design

### FR4: State Preservation

**Requirement**: Maintain all existing phase state management

- **Persistence**: No changes to localStorage behavior
- **Events**: Same phase-change event structure
- **Props**: Compatible with existing parent component interfaces

### FR5: View-Aware Behavior

**Requirement**: Support frontend/backend view switching

- **Frontend**: Show phases 0-6
- **Backend**: Show backend phases 0-3
- **Switching**: Dropdown options update when view changes

## Technical Considerations

### Architecture

- **Component Replacement**: `PhaseNavigation.vue` → `PhaseSelector.vue`
- **Composable Reuse**: Leverage existing `useViewAwarePhases` composable
- **Event Compatibility**: Maintain `phase-change` event signature
- **Props Interface**: Backward-compatible with `PhaseNavigationProps`

### Implementation Approach

1. **Native HTML Select**: Use `<select>` element for maximum accessibility
2. **Custom Dropdown**: Vue-based dropdown for enhanced styling control
3. **Hybrid Approach**: Native select on mobile, custom on desktop

**Recommended**: Custom dropdown with proper ARIA implementation for design consistency

### Performance Impact

- **Bundle Size**: +2-3KB for dropdown component
- **Runtime**: Minimal impact, fewer DOM nodes than current buttons
- **Memory**: Reduced by eliminating multiple button event listeners

### Browser Support

- **Modern Browsers**: Full feature support (Chrome 90+, Firefox 88+, Safari 14+)
- **Legacy Support**: Graceful degradation to native select
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

## Performance, Accessibility, i18n, Analytics, State Management

### Performance

- **Rendering**: Dropdown renders only visible options (no virtualization needed for <10 items)
- **Event Handling**: Single event listener vs 8+ button listeners
- **Memory**: ~60% reduction in DOM nodes
- **Bundle Impact**: <3KB additional JavaScript

### Accessibility (a11y)

- **ARIA Labels**: `aria-label="Select phase"` on dropdown trigger
- **ARIA Expanded**: `aria-expanded` state for dropdown visibility
- **ARIA Selected**: `aria-selected` for current option
- **Role**: `role="combobox"` on trigger, `role="listbox"` on options
- **Keyboard**: Full keyboard navigation (Tab, Arrow keys, Enter, Escape)
- **Screen Reader**: Announces phase changes and dropdown state
- **Focus Management**: Proper focus trapping within dropdown

### Internationalization (i18n)

- **Current State**: Application is English-only
- **Future Preparation**:
  - Externalize dropdown labels ("Select phase", "Phase")
  - Support RTL layouts for dropdown positioning
  - Locale-aware phase title truncation

### Analytics

- **Events to Track**:
  - `phase_selector_opened` - Dropdown opened
  - `phase_selected` - Phase changed via dropdown
  - `phase_selector_keyboard_used` - Keyboard navigation used
- **Properties**: `phase_id`, `view_type`, `interaction_method`

### State Management

- **No Changes**: Existing composable-based state management preserved
- **Local State**: Dropdown open/closed state only
- **Global State**: Phase selection continues using existing patterns
- **Persistence**: No impact on localStorage behavior

### Error Handling

- **Invalid Phase**: Graceful fallback to Phase 0
- **Missing Phases**: Skip undefined phases in dropdown
- **Network Issues**: N/A (client-side only)

### Empty States

- **No Phases**: Show disabled dropdown with "No phases available"
- **Loading**: Show skeleton dropdown during initialization

### Loading States

- **Initial Load**: Dropdown shows current phase immediately
- **Phase Switch**: Immediate UI update, no loading indicators needed

## Risks & Mitigations

### Risk 1: Accessibility Regression

**Impact**: High - Could break keyboard/screen reader navigation  
**Probability**: Medium  
**Mitigation**:

- Comprehensive a11y testing with jest-axe
- Manual testing with screen readers
- Keyboard navigation test coverage

### Risk 2: Mobile UX Issues

**Impact**: Medium - Poor mobile experience  
**Probability**: Low  
**Mitigation**:

- Responsive design testing
- Touch interaction testing
- Native select fallback option

### Risk 3: Design Inconsistency

**Impact**: Medium - Visual disconnect from existing UI  
**Probability**: Low  
**Mitigation**:

- Reuse existing design tokens
- Match current button styling
- Design review process

### Risk 4: Performance Degradation

**Impact**: Low - Slower phase switching  
**Probability**: Very Low  
**Mitigation**:

- Performance testing during development
- Bundle size monitoring
- Lazy loading if needed

### Risk 5: Breaking Changes

**Impact**: High - Existing functionality broken  
**Probability**: Low  
**Mitigation**:

- Maintain exact prop/event interfaces
- Comprehensive regression testing
- Feature flag for gradual rollout

## Success Criteria & Measurement

### Primary Metrics

1. **Space Efficiency**: Sidebar height reduction ≥70% (target: 30rem → 8rem)
2. **User Satisfaction**: Post-deployment user feedback score ≥4.5/5
3. **Accessibility Score**: Lighthouse accessibility score maintains 100
4. **Performance**: No regression in Core Web Vitals

### Secondary Metrics

1. **Phase Switch Frequency**: Increase in phase switching by 20%+
2. **Mobile Usage**: Increase in mobile session duration by 15%+
3. **Error Rate**: Zero increase in JavaScript errors
4. **Support Tickets**: No increase in navigation-related issues

### Success Timeline

- **Week 1**: Implementation complete, tests passing
- **Week 2**: Internal testing, accessibility audit
- **Week 3**: Deployment, monitoring setup
- **Week 4**: Success metrics evaluation

## Public UI/API Types (Design)

### Core Component Types

```typescript
// Phase Selector Component Props
export interface PhaseSelectorProps {
  /** List of available phases for current view */
  phasesList: readonly (Phase | BackendPhase)[];
  /** Currently selected phase ID */
  currentPhaseId: AnyPhaseId;
  /** Current view type (frontend/backend) */
  viewType?: ViewType;
  /** Whether selector is disabled */
  disabled?: boolean;
  /** Custom aria-label for accessibility */
  "aria-label"?: string;
  /** Custom CSS classes */
  class?: string;
}

// Phase Selector Events
export interface PhaseSelectorEmits {
  /** Emitted when user selects a different phase */
  "phase-change": [phaseId: AnyPhaseId];
  /** Emitted when dropdown opens */
  "dropdown-open": [];
  /** Emitted when dropdown closes */
  "dropdown-close": [];
}

// Phase Option Display Data
export interface PhaseOption {
  /** Unique phase identifier */
  id: AnyPhaseId;
  /** Display label for dropdown option */
  label: string;
  /** Full phase title */
  title: string;
  /** Whether this option is currently selected */
  selected: boolean;
  /** Whether this option is disabled */
  disabled?: boolean;
}

// Dropdown State Management
export interface DropdownState {
  /** Whether dropdown is currently open */
  isOpen: boolean;
  /** Index of currently focused option */
  focusedIndex: number;
  /** Whether dropdown is disabled */
  disabled: boolean;
}

// Accessibility Configuration
export interface A11yConfig {
  /** ARIA label for the dropdown trigger */
  triggerLabel: string;
  /** ARIA label for the dropdown listbox */
  listboxLabel: string;
  /** Format string for option labels */
  optionLabelFormat: string;
  /** Format string for selected phase announcement */
  selectionAnnouncementFormat: string;
}
```

### Styling & Theme Types

```typescript
// Component Styling Configuration
export interface PhaseSelectorTheme {
  /** Trigger button styling */
  trigger: {
    padding: string;
    borderRadius: string;
    border: string;
    background: string;
    color: string;
    fontSize: string;
    fontWeight: string;
  };
  /** Dropdown container styling */
  dropdown: {
    maxHeight: string;
    borderRadius: string;
    border: string;
    background: string;
    boxShadow: string;
    zIndex: number;
  };
  /** Individual option styling */
  option: {
    padding: string;
    fontSize: string;
    color: string;
    hoverBackground: string;
    selectedBackground: string;
    focusBackground: string;
  };
  /** Phase number badge styling */
  badge: {
    width: string;
    height: string;
    borderRadius: string;
    background: string;
    color: string;
    fontSize: string;
    fontWeight: string;
  };
}

// Responsive Breakpoints
export interface ResponsiveConfig {
  /** Mobile breakpoint for native select fallback */
  mobileBreakpoint: string;
  /** Tablet breakpoint for adjusted sizing */
  tabletBreakpoint: string;
  /** Desktop breakpoint for full features */
  desktopBreakpoint: string;
}
```

### Utility & Helper Types

```typescript
// Phase Label Formatting
export type PhaseLabelFormatter = (phase: Phase | BackendPhase) => string;

// Keyboard Event Handling
export interface KeyboardHandlers {
  onArrowDown: (event: KeyboardEvent) => void;
  onArrowUp: (KeyboardEvent) => void;
  onEnter: (event: KeyboardEvent) => void;
  onEscape: (event: KeyboardEvent) => void;
  onTab: (event: KeyboardEvent) => void;
}

// Dropdown Position Calculation
export interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: "bottom" | "top";
}

// Animation Configuration
export interface AnimationConfig {
  /** Duration for dropdown open/close animation */
  duration: number;
  /** Easing function for animations */
  easing: string;
  /** Whether animations are enabled */
  enabled: boolean;
}
```

### Integration Types

```typescript
// Composable Integration
export interface UsePhaseSelectorReturn {
  /** Current dropdown state */
  dropdownState: Ref<DropdownState>;
  /** Formatted phase options */
  phaseOptions: ComputedRef<PhaseOption[]>;
  /** Currently selected option */
  selectedOption: ComputedRef<PhaseOption | undefined>;
  /** Dropdown event handlers */
  handlers: KeyboardHandlers & {
    onTriggerClick: () => void;
    onOptionClick: (phaseId: AnyPhaseId) => void;
    onOutsideClick: () => void;
  };
  /** Accessibility attributes */
  a11yAttrs: ComputedRef<Record<string, string>>;
}

// Component Registration
export interface PhaseSelectorComponent {
  name: "PhaseSelector";
  props: PhaseSelectorProps;
  emits: PhaseSelectorEmits;
  setup: (
    props: PhaseSelectorProps,
    context: SetupContext<PhaseSelectorEmits>
  ) => UsePhaseSelectorReturn;
}
```

### Validation & Error Types

```typescript
// Input Validation
export interface ValidationResult {
  /** Whether the input is valid */
  valid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Warning message for non-critical issues */
  warning?: string;
}

// Error States
export interface PhaseSelectorError {
  /** Error type identifier */
  type: "INVALID_PHASE" | "MISSING_PHASES" | "RENDER_ERROR";
  /** Human-readable error message */
  message: string;
  /** Additional error context */
  context?: Record<string, unknown>;
}
```

---

**Document Status**: Ready for Implementation  
**Next Steps**: RFC Creation, Technical Design, Implementation Planning  
**Dependencies**: None (pure UI enhancement)  
**Estimated Effort**: 1-2 sprints (8-16 story points)
