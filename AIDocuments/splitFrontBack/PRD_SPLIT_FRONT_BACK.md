# PRD: Split Frontend and Backend Views with Tab Navigation

## Background & Problem Statement

The current prompt builder application provides a unified view for all development phases (Discovery, Planning, Implementation, etc.) without distinguishing between frontend and backend development contexts. Users need specialized prompts and workflows tailored to their specific development domain.

**Problem**:

- Frontend developers need prompts focused on UI/UX, component architecture, accessibility, and user interactions
- Backend developers need prompts focused on APIs, data models, business logic, and system architecture
- Current single view doesn't optimize for domain-specific workflows
- No clear separation of concerns between frontend and backend development phases

**Impact**:

- Reduced developer productivity due to irrelevant prompts
- Cognitive overhead from processing non-domain-specific information
- Missed opportunities for specialized validation and guidance

## Goals and Non-Goals

### Goals

1. **Domain Separation**: Create distinct frontend and backend views with specialized prompts
2. **Consistent UX**: Maintain identical layout, design, and interaction patterns across views
3. **Component Reusability**: Maximize reuse of existing components and logic
4. **Tab Navigation**: Implement intuitive tab-based switching between views
5. **Specialized Content**: Provide 4 backend-specific prompts that complement existing phases
6. **State Preservation**: Maintain separate state for frontend and backend views
7. **Accessibility**: Ensure tab navigation meets WCAG 2.1 AA standards

### Non-Goals

- Changing existing frontend phase configurations
- Modifying core application architecture or build system
- Adding new dependencies or infrastructure changes
- Implementing user authentication or multi-user support
- Creating entirely new UI components from scratch

## User Stories & Acceptance Criteria

### US-1: Tab Navigation

**As a** developer  
**I want** to switch between frontend and backend views using tabs  
**So that** I can access domain-specific prompts efficiently

**Acceptance Criteria:**

- AC-1.1: Two tabs labeled "Frontend" and "Backend" are visible at the top of the application
- AC-1.2: Active tab is visually distinguished with appropriate styling
- AC-1.3: Tab switching preserves current phase selection within each view
- AC-1.4: Tab switching is accessible via keyboard navigation (Tab, Enter, Arrow keys)
- AC-1.5: Screen readers announce tab state changes

### US-2: Backend View with Specialized Prompts

**As a** backend developer  
**I want** access to backend-specific prompts  
**So that** I can generate relevant documentation and code

**Acceptance Criteria:**

- AC-2.1: Backend view contains 4 specialized backend prompts
- AC-2.2: Backend prompts focus on API design, data models, business logic, and system architecture
- AC-2.3: All existing functionality (template editing, token replacement, export/import) works in backend view
- AC-2.4: Backend view maintains separate state from frontend view

### US-3: Consistent Experience Across Views

**As a** developer  
**I want** identical functionality in both frontend and backend views  
**So that** I have a consistent user experience

**Acceptance Criteria:**

- AC-3.1: Global inputs (project name, feature name, etc.) are shared between views
- AC-3.2: Phase navigation, template editing, and preview functionality work identically
- AC-3.3: Export/import includes data from both frontend and backend views
- AC-3.4: Visual design and layout remain consistent across views

### US-4: State Management

**As a** developer  
**I want** my work to be preserved when switching between views  
**So that** I don't lose progress

**Acceptance Criteria:**

- AC-4.1: Frontend and backend views maintain separate phase states
- AC-4.2: Current phase selection is preserved per view
- AC-4.3: Template customizations are preserved per view
- AC-4.4: Local storage saves state for both views independently

## Functional Requirements

### FR-1: Tab Component Implementation

- **FR-1.1**: Create reusable TabNavigation component with accessibility features
- **FR-1.2**: Implement keyboard navigation (Tab, Enter, Left/Right arrows)
- **FR-1.3**: Support ARIA attributes for screen readers
- **FR-1.4**: Provide visual focus indicators and active state styling

### FR-2: View State Management

- **FR-2.1**: Extend existing state management to support view-specific data
- **FR-2.2**: Implement view switching logic that preserves individual view states
- **FR-2.3**: Update localStorage schema to store frontend and backend data separately
- **FR-2.4**: Ensure global inputs remain shared across views

### FR-3: Backend Phase Configuration

- **FR-3.1**: Create 4 backend-specific phase configurations
- **FR-3.2**: Implement backend phase templates with appropriate tokens
- **FR-3.3**: Ensure backend phases follow existing phase structure and validation
- **FR-3.4**: Support custom template overrides for backend phases

### FR-4: Component Reusability

- **FR-4.1**: Refactor existing components to accept view context
- **FR-4.2**: Ensure PhaseView, PhaseNavigation, and related components work with both views
- **FR-4.3**: Maintain backward compatibility with existing component interfaces
- **FR-4.4**: Abstract view-specific logic into composables

### FR-5: Export/Import Enhancement

- **FR-5.1**: Update export format to include both frontend and backend data
- **FR-5.2**: Ensure import functionality restores both view states
- **FR-5.3**: Maintain backward compatibility with existing export files
- **FR-5.4**: Add view indicator in export metadata

## Technical Considerations

### Performance

- **Lazy Loading**: Consider lazy loading of view-specific components if bundle size increases
- **State Optimization**: Use computed properties and reactive patterns to minimize re-renders
- **Memory Management**: Ensure proper cleanup when switching views
- **Local Storage**: Monitor localStorage size with dual view state

### Accessibility (a11y)

- **ARIA Labels**: Implement proper ARIA labeling for tab navigation
- **Keyboard Navigation**: Support standard tab navigation patterns
- **Screen Reader Support**: Ensure view changes are announced
- **Focus Management**: Maintain logical focus order when switching views
- **Color Contrast**: Ensure tab styling meets WCAG 2.1 AA standards

### Internationalization (i18n)

- **Tab Labels**: Design tab labels to be easily translatable
- **Content Structure**: Ensure backend prompts support future i18n
- **Text Direction**: Consider RTL language support in tab layout

### Analytics

- **View Usage**: Track which view is more commonly used
- **Tab Switching**: Monitor frequency of view switching
- **Feature Adoption**: Measure adoption of backend-specific features

### State Management

- **Reactive Patterns**: Use Vue 3 reactivity for view state management
- **Composable Design**: Extract view logic into reusable composables
- **State Persistence**: Ensure robust localStorage handling for dual views
- **State Migration**: Plan for future state schema changes

### Error Handling

- **View Loading**: Handle errors when loading view-specific configurations
- **State Corruption**: Graceful degradation if view state is corrupted
- **Import Validation**: Validate imported data for both views
- **Fallback Behavior**: Default to frontend view if backend data is unavailable

### Loading States

- **View Switching**: Show loading indicator during view transitions
- **Data Loading**: Handle async loading of view-specific data
- **Progressive Enhancement**: Load views incrementally if needed

### Empty States

- **New Users**: Guide users to appropriate view based on their role
- **Missing Data**: Handle cases where one view has no data
- **Default Content**: Provide sensible defaults for new backend phases

## Risks & Mitigations

### Risk 1: State Management Complexity

**Risk**: Managing separate states for frontend and backend views increases complexity
**Likelihood**: Medium  
**Impact**: Medium  
**Mitigation**:

- Use composables to encapsulate view-specific logic
- Implement comprehensive unit tests for state management
- Create clear state schema documentation

### Risk 2: Component Coupling

**Risk**: Existing components may be tightly coupled to single-view assumptions
**Likelihood**: High  
**Impact**: Medium  
**Mitigation**:

- Conduct thorough component analysis before implementation
- Refactor components incrementally with proper testing
- Maintain backward compatibility through careful interface design

### Risk 3: Performance Degradation

**Risk**: Dual view state management could impact application performance
**Likelihood**: Low  
**Impact**: Medium  
**Mitigation**:

- Implement performance monitoring during development
- Use Vue 3's reactive system efficiently
- Consider lazy loading for view-specific components

### Risk 4: User Experience Confusion

**Risk**: Users may be confused by the new tab interface
**Likelihood**: Medium  
**Impact**: Low  
**Mitigation**:

- Implement clear visual indicators for active tabs
- Provide contextual help or onboarding
- Maintain consistent interaction patterns

### Risk 5: Data Migration Issues

**Risk**: Existing user data may not migrate properly to new schema
**Likelihood**: Medium  
**Impact**: High  
**Mitigation**:

- Implement robust data migration logic
- Provide fallback to original data structure
- Test migration with various data scenarios

## Success Criteria & Measurement

### Primary Success Metrics

1. **Feature Adoption**: >70% of users try both frontend and backend views within first week
2. **User Retention**: No decrease in overall application usage after feature launch
3. **Task Completion**: Users complete prompts 15% faster in domain-specific views
4. **Error Rate**: <5% increase in user-reported issues post-launch

### Secondary Success Metrics

1. **Accessibility Compliance**: 100% WCAG 2.1 AA compliance for tab navigation
2. **Performance**: <100ms view switching time on average hardware
3. **Code Quality**: Maintain >80% test coverage for new components
4. **User Satisfaction**: >4.0/5.0 rating for new tab interface in user feedback

### Measurement Methods

- **Analytics**: Track view usage, switching frequency, and completion rates
- **Performance Monitoring**: Measure view switching times and memory usage
- **User Testing**: Conduct usability testing with frontend and backend developers
- **A11y Testing**: Automated and manual accessibility testing

## Public UI/API Types (Design)

### Core View Types

```typescript
// View identifier type
export type ViewType = "frontend" | "backend";

// View-specific phase configuration
export interface ViewPhaseConfig {
  viewType: ViewType;
  phases: Record<PhaseId, PhaseConfig>;
  defaultPhaseId: PhaseId;
}

// Enhanced application state with view support
export interface ViewAwarePhaseBuilderState {
  currentView: ViewType;
  views: {
    frontend: ViewState;
    backend: ViewState;
  };
  globalInputs: GlobalInputs; // Shared across views
}

// Individual view state
export interface ViewState {
  phases: PhaseMap;
  currentPhaseId: PhaseId;
  lastModified: string;
}
```

### Tab Navigation Types

```typescript
// Tab navigation component props
export interface TabNavigationProps {
  currentView: ViewType;
  disabled?: boolean;
  "aria-label"?: string;
}

// Tab navigation events
export interface TabNavigationEvents {
  "view-change": [viewType: ViewType];
}

// Individual tab configuration
export interface TabConfig {
  id: ViewType;
  label: string;
  icon?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
}
```

### Enhanced Component Props

```typescript
// Enhanced PhaseView props with view context
export interface ViewAwarePhaseViewProps {
  phase: Phase;
  globalInputs: GlobalInputs;
  viewType: ViewType;
  disabled?: boolean;
}

// Enhanced PhaseNavigation props
export interface ViewAwarePhaseNavigationProps {
  phasesList: Phase[];
  currentPhaseId: PhaseId;
  viewType: ViewType;
  disabled?: boolean;
}

// Enhanced AppHeader props
export interface ViewAwareAppHeaderProps {
  hasUnsavedChanges: boolean;
  currentView: ViewType;
  viewStates: Record<ViewType, ViewState>;
}
```

### Backend Phase Types

```typescript
// Backend-specific phase identifiers
export type BackendPhaseId =
  | "backend-0"
  | "backend-1"
  | "backend-2"
  | "backend-3";

// Backend phase configuration
export interface BackendPhaseConfig extends PhaseConfig {
  id: BackendPhaseId;
  category: "api" | "database" | "business-logic" | "architecture";
  complexity: "basic" | "intermediate" | "advanced";
}

// Backend-specific inputs
export interface BackendPhaseInputs {
  // API Design inputs
  apiEndpoint?: string;
  httpMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requestSchema?: string;
  responseSchema?: string;

  // Database inputs
  entityName?: string;
  tableSchema?: string;
  relationships?: string;
  indexStrategy?: string;

  // Business Logic inputs
  businessRule?: string;
  validationRules?: string;
  errorHandling?: string;

  // Architecture inputs
  servicePattern?: string;
  scalabilityRequirements?: string;
  performanceTargets?: string;
}
```

### Composable Return Types

```typescript
// View management composable
export interface UseViewManagementReturn {
  currentView: Ref<ViewType>;
  viewStates: ComputedRef<Record<ViewType, ViewState>>;
  switchView: (viewType: ViewType) => void;
  getCurrentViewState: () => ViewState;
  updateCurrentViewState: (updates: Partial<ViewState>) => void;
  hasUnsavedChanges: ComputedRef<boolean>;
}

// View-aware phases composable
export interface UseViewAwarePhasesReturn {
  currentPhase: ComputedRef<Phase>;
  phasesList: ComputedRef<Phase[]>;
  updatePhase: (phaseId: PhaseId, updates: Partial<Phase>) => void;
  switchPhase: (phaseId: PhaseId) => void;
  exportViewData: () => ViewExportData;
  importViewData: (data: ViewExportData) => void;
}

// Tab navigation composable
export interface UseTabNavigationReturn {
  activeTab: Ref<ViewType>;
  tabs: ComputedRef<TabConfig[]>;
  switchTab: (tabId: ViewType) => void;
  getTabProps: (tabId: ViewType) => TabProps;
  handleKeyboardNavigation: (event: KeyboardEvent) => void;
}
```

### Export/Import Types

```typescript
// Enhanced export data format
export interface ViewAwareExportData {
  version: string;
  exportedAt: string;
  globalInputs: GlobalInputs;
  views: {
    frontend: ViewExportData;
    backend: ViewExportData;
  };
  metadata: {
    currentView: ViewType;
    appVersion: string;
  };
}

// Individual view export data
export interface ViewExportData {
  viewType: ViewType;
  phases: PhaseMap;
  currentPhaseId: PhaseId;
  lastModified: string;
  customizations: ViewCustomizations;
}

// View-specific customizations
export interface ViewCustomizations {
  themePreferences?: Record<string, unknown>;
  layoutSettings?: Record<string, unknown>;
  phaseOrder?: PhaseId[];
}
```

### Validation Types

```typescript
// View-aware validation state
export interface ViewAwareValidationState extends ValidationState {
  viewType: ViewType;
  crossViewValidation?: CrossViewValidationResult[];
}

// Cross-view validation for shared data
export interface CrossViewValidationResult {
  type: "consistency" | "dependency" | "conflict";
  message: string;
  affectedViews: ViewType[];
  severity: "error" | "warning" | "info";
}

// View-specific validation rules
export interface ViewValidationRules {
  viewType: ViewType;
  phaseValidations: Record<PhaseId, ValidationRule[]>;
  globalValidations: ValidationRule[];
  crossViewRules?: CrossViewValidationRule[];
}

// Cross-view validation rule
export interface CrossViewValidationRule {
  name: string;
  description: string;
  validator: (
    frontendState: ViewState,
    backendState: ViewState
  ) => ValidationError[];
}
```

### Event Types

```typescript
// View change events
export interface ViewChangeEvent {
  type: "view_change";
  previousView: ViewType;
  currentView: ViewType;
  timestamp: number;
  trigger: "user" | "system" | "import";
}

// Phase change events within views
export interface ViewPhaseChangeEvent {
  type: "phase_change";
  viewType: ViewType;
  previousPhaseId: PhaseId;
  currentPhaseId: PhaseId;
  timestamp: number;
}

// Data synchronization events
export interface ViewSyncEvent {
  type: "view_sync" | "global_sync";
  viewType?: ViewType;
  syncedFields: string[];
  timestamp: number;
}
```

### Utility Types

```typescript
// Type guards for view types
export const isViewType = (value: unknown): value is ViewType => {
  return typeof value === "string" && ["frontend", "backend"].includes(value);
};

export const isBackendPhaseId = (value: unknown): value is BackendPhaseId => {
  return typeof value === "string" && value.startsWith("backend-");
};

// View configuration constants
export const VIEW_CONFIGS: Record<ViewType, ViewConfig> = {
  frontend: {
    label: "Frontend",
    icon: "🎨",
    description: "UI/UX focused development phases",
    defaultPhaseId: "0",
  },
  backend: {
    label: "Backend",
    icon: "⚙️",
    description: "API and business logic focused phases",
    defaultPhaseId: "backend-0",
  },
} as const;

// View configuration interface
export interface ViewConfig {
  label: string;
  icon: string;
  description: string;
  defaultPhaseId: PhaseId | BackendPhaseId;
}
```

## Backend Phase Configurations

### Backend Phase 0: API Design & Documentation

```typescript
export const BACKEND_PHASE_0_CONFIG: BackendPhaseConfig = {
  id: "backend-0",
  title: "API Design & OpenAPI Specification",
  category: "api",
  complexity: "intermediate",
  template: `ROLE
You are a Senior Backend Engineer designing RESTful APIs for [PROJECT_NAME].

NON-NEGOTIABLE CONSTRAINTS
Follow REPO_CONSTRAINTS.md and COMPREHENSIVE_ANALYSIS.md.
Design APIs that are RESTful, secure, and scalable.
Include proper error handling and validation.

OBJECTIVE
Design and document the API for: [REQUIREMENTS]

OUTPUT
Create comprehensive API documentation including:

API Endpoints Design
- Base URL: [API_ENDPOINT]
- HTTP Methods: [HTTP_METHOD]
- Resource paths and naming conventions
- Query parameters and filtering

Request/Response Schemas
- Request body schema: [REQUEST_SCHEMA]
- Response body schema: [RESPONSE_SCHEMA]
- Error response formats
- Status codes and meanings

Authentication & Authorization
- Authentication method (JWT, OAuth, API Keys)
- Authorization levels and permissions
- Rate limiting and throttling

Data Validation
- Input validation rules: [VALIDATION_RULES]
- Business rule validation: [BUSINESS_RULE]
- Error handling strategy: [ERROR_HANDLING]

OpenAPI Specification
Generate complete OpenAPI 3.0 specification with:
- All endpoints documented
- Schema definitions
- Example requests/responses
- Security definitions

NOTES
Ensure API follows REST principles and industry best practices.
Consider versioning strategy and backward compatibility.`,
  description:
    "Design RESTful APIs with comprehensive documentation and OpenAPI specifications",
};
```

### Backend Phase 1: Database Design & Modeling

```typescript
export const BACKEND_PHASE_1_CONFIG: BackendPhaseConfig = {
  id: "backend-1",
  title: "Database Schema & Data Modeling",
  category: "database",
  complexity: "advanced",
  template: `ROLE
You are a Database Architect designing data models for [PROJECT_NAME].

NON-NEGOTIABLE CONSTRAINTS
Follow REPO_CONSTRAINTS.md and database best practices.
Ensure ACID compliance and data integrity.
Design for scalability and performance.

OBJECTIVE
Design the database schema for: [REQUIREMENTS]

OUTPUT
Create comprehensive database design including:

Entity Relationship Design
- Primary entity: [ENTITY_NAME]
- Table schema: [TABLE_SCHEMA]
- Relationships: [RELATIONSHIPS]
- Foreign key constraints

Indexing Strategy
- Primary indexes: [INDEX_STRATEGY]
- Composite indexes for query optimization
- Unique constraints and business rules
- Performance considerations

Data Types & Constraints
- Column definitions with appropriate data types
- NOT NULL constraints and default values
- Check constraints for business rules
- Triggers for data validation

Migration Strategy
- Database migration scripts
- Data seeding for initial setup
- Rollback procedures
- Version control for schema changes

Performance Optimization
- Query optimization strategies
- Partitioning considerations
- Caching layer design
- Scalability targets: [PERFORMANCE_TARGETS]

NOTES
Consider both OLTP and OLAP requirements.
Plan for data archiving and retention policies.
Ensure compliance with data protection regulations.`,
  description:
    "Design scalable database schemas with proper relationships and optimization",
};
```

### Backend Phase 2: Business Logic & Service Layer

```typescript
export const BACKEND_PHASE_2_CONFIG: BackendPhaseConfig = {
  id: "backend-2",
  title: "Business Logic & Service Architecture",
  category: "business-logic",
  complexity: "advanced",
  template: `ROLE
You are a Senior Backend Engineer implementing business logic for [PROJECT_NAME].

NON-NEGOTIABLE CONSTRAINTS
Follow REPO_CONSTRAINTS.md and clean architecture principles.
Implement proper separation of concerns.
Ensure testability and maintainability.

OBJECTIVE
Implement business logic and services for: [REQUIREMENTS]

OUTPUT
Create comprehensive service layer including:

Service Architecture
- Service pattern: [SERVICE_PATTERN]
- Dependency injection setup
- Interface definitions
- Service composition patterns

Business Rules Implementation
- Core business rule: [BUSINESS_RULE]
- Validation logic: [VALIDATION_RULES]
- Business process workflows
- State management patterns

Error Handling & Logging
- Error handling strategy: [ERROR_HANDLING]
- Custom exception types
- Logging levels and structured logging
- Monitoring and alerting hooks

Transaction Management
- Transaction boundaries
- Rollback strategies
- Distributed transaction handling
- Consistency guarantees

Testing Strategy
- Unit test coverage for business logic
- Integration test scenarios
- Mock strategies for dependencies
- Test data management

Domain Models
- Domain entity definitions
- Value objects and aggregates
- Repository patterns
- Domain events and handlers

NOTES
Follow Domain-Driven Design principles.
Ensure business logic is framework-agnostic.
Implement proper audit trails for business operations.`,
  description:
    "Implement robust business logic with proper service architecture and testing",
};
```

### Backend Phase 3: System Architecture & Scalability

```typescript
export const BACKEND_PHASE_3_CONFIG: BackendPhaseConfig = {
  id: "backend-3",
  title: "System Architecture & Performance",
  category: "architecture",
  complexity: "advanced",
  template: `ROLE
You are a Solutions Architect designing scalable systems for [PROJECT_NAME].

NON-NEGOTIABLE CONSTRAINTS
Follow REPO_CONSTRAINTS.md and architectural best practices.
Design for high availability and fault tolerance.
Consider operational requirements and monitoring.

OBJECTIVE
Design system architecture for: [REQUIREMENTS]

OUTPUT
Create comprehensive architecture documentation including:

System Architecture
- Service pattern: [SERVICE_PATTERN]
- Microservices vs monolith decision
- Communication patterns (sync/async)
- API gateway and service mesh considerations

Scalability Design
- Scalability requirements: [SCALABILITY_REQUIREMENTS]
- Horizontal vs vertical scaling strategies
- Load balancing and distribution
- Auto-scaling policies and triggers

Performance Optimization
- Performance targets: [PERFORMANCE_TARGETS]
- Caching strategies (Redis, CDN, application-level)
- Database optimization and read replicas
- Asynchronous processing patterns

Reliability & Monitoring
- Circuit breaker patterns
- Retry and timeout strategies
- Health checks and service discovery
- Observability (metrics, logs, traces)

Security Architecture
- Authentication and authorization flows
- Data encryption (at rest and in transit)
- Network security and firewall rules
- Vulnerability scanning and security testing

Deployment Strategy
- Container orchestration (Docker/Kubernetes)
- CI/CD pipeline design
- Blue-green vs rolling deployments
- Environment management (dev/staging/prod)

Disaster Recovery
- Backup and restore procedures
- Failover mechanisms
- RTO/RPO requirements
- Cross-region replication strategies

NOTES
Consider cost optimization and resource efficiency.
Plan for future growth and technology evolution.
Ensure compliance with industry standards and regulations.`,
  description:
    "Design comprehensive system architecture with focus on scalability and reliability",
};
```

---

**Document Version**: 1.0  
**Created**: 2025-10-02  
**Status**: Draft  
**Owner**: Product Manager  
**Reviewers**: Engineering Team, UX Team
