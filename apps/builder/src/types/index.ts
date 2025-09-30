export interface Phase {
  id: "0" | "1" | "2" | "2.5" | "3" | "4";
  title: string;
  template: string;
  overridesEnabled: boolean;
  inputs: Record<string, string>;
  lastOutput: string;
}

export interface GlobalInputs {
  projectName: string;
  featureName: string;
  featureSlug: string;
  owner: string;
  repoUrl?: string;
  stack: string;
  dateIso: string;
}

export interface ReplacementMap {
  [key: string]: string;
}

export interface PhaseMap {
  [phaseId: string]: Phase;
}

export interface PhaseBuilderState {
  phases: PhaseMap;
  globalInputs: GlobalInputs;
  currentPhaseId: string;
}

export type PhaseId = "0" | "1" | "2" | "2.5" | "3" | "4";

export const DEFAULT_PHASE_TITLES: Record<PhaseId, string> = {
  "0": "Discovery",
  "1": "Planning",
  "2": "Implementation",
  "2.5": "Review",
  "3": "Testing",
  "4": "Deployment",
} as const;

export const DEFAULT_PHASE_TEMPLATES: Record<PhaseId, string> = {
  "0": `# [PROJECT_NAME] - [FEATURE_NAME] Discovery

## Context
- **Project:** [PROJECT_NAME]
- **Feature:** [FEATURE_NAME] ([FEATURE_SLUG])
- **Owner:** [OWNER]
- **Date:** [DATE_ISO]
- **Stack:** [STACK]

## Discovery Questions
1. What is the core problem we're solving?
2. Who are the primary users?
3. What are the success criteria?
4. What are the technical constraints?
5. What are the business constraints?

## Research Areas
- [ ] User research
- [ ] Technical feasibility
- [ ] Competitive analysis
- [ ] Risk assessment

## Next Steps
- [ ] Define requirements
- [ ] Create user stories
- [ ] Technical architecture review`,

  "1": `# [PROJECT_NAME] - [FEATURE_NAME] Planning

## Overview
- **Project:** [PROJECT_NAME]
- **Feature:** [FEATURE_NAME] ([FEATURE_SLUG])
- **Owner:** [OWNER]
- **Date:** [DATE_ISO]
- **Stack:** [STACK]

## Requirements Analysis
### Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Non-Functional Requirements
- [ ] Performance: [SPECIFY]
- [ ] Security: [SPECIFY]
- [ ] Scalability: [SPECIFY]

## Technical Design
### Architecture
- [ ] System design
- [ ] Database schema
- [ ] API design
- [ ] Integration points

### Implementation Plan
1. [ ] Phase 1: [DESCRIPTION]
2. [ ] Phase 2: [DESCRIPTION]
3. [ ] Phase 3: [DESCRIPTION]

## Risk Assessment
- [ ] Technical risks
- [ ] Timeline risks
- [ ] Resource risks`,

  "2": `# [PROJECT_NAME] - [FEATURE_NAME] Implementation

## Implementation Status
- **Project:** [PROJECT_NAME]
- **Feature:** [FEATURE_NAME] ([FEATURE_SLUG])
- **Owner:** [OWNER]
- **Date:** [DATE_ISO]
- **Stack:** [STACK]

## Development Progress
### Completed
- [ ] [COMPLETED_TASK_1]
- [ ] [COMPLETED_TASK_2]

### In Progress
- [ ] [CURRENT_TASK_1]
- [ ] [CURRENT_TASK_2]

### Pending
- [ ] [PENDING_TASK_1]
- [ ] [PENDING_TASK_2]

## Technical Implementation
### Code Structure
- [ ] Component architecture
- [ ] State management
- [ ] API integration
- [ ] Error handling

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

## Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are comprehensive
- [ ] Documentation is updated
- [ ] Security considerations addressed`,

  "2.5": `# [PROJECT_NAME] - [FEATURE_NAME] Review

## Review Overview
- **Project:** [PROJECT_NAME]
- **Feature:** [FEATURE_NAME] ([FEATURE_SLUG])
- **Owner:** [OWNER]
- **Date:** [DATE_ISO]
- **Stack:** [STACK]

## Code Review Checklist
### Functionality
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error handling implemented
- [ ] User experience is smooth

### Code Quality
- [ ] Code follows style guidelines
- [ ] Functions are well-named and focused
- [ ] No code duplication
- [ ] Comments are clear and helpful

### Testing
- [ ] Unit tests cover new functionality
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance is acceptable

### Security & Performance
- [ ] No security vulnerabilities
- [ ] Performance benchmarks met
- [ ] Memory usage is reasonable
- [ ] Database queries are optimized

## Review Notes
### What's Working Well
- [ ] [POSITIVE_ASPECT_1]
- [ ] [POSITIVE_ASPECT_2]

### Areas for Improvement
- [ ] [IMPROVEMENT_1]
- [ ] [IMPROVEMENT_2]

### Questions & Concerns
- [ ] [QUESTION_1]
- [ ] [QUESTION_2]

## Next Steps
- [ ] Address review feedback
- [ ] Update documentation
- [ ] Prepare for testing phase`,

  "3": `# [PROJECT_NAME] - [FEATURE_NAME] Testing

## Testing Overview
- **Project:** [PROJECT_NAME]
- **Feature:** [FEATURE_NAME] ([FEATURE_SLUG])
- **Owner:** [OWNER]
- **Date:** [DATE_ISO]
- **Stack:** [STACK]

## Test Strategy
### Unit Testing
- [ ] Component tests
- [ ] Utility function tests
- [ ] Hook/composable tests
- [ ] Service layer tests

### Integration Testing
- [ ] API integration tests
- [ ] Database integration tests
- [ ] Third-party service tests
- [ ] Cross-component tests

### End-to-End Testing
- [ ] User journey tests
- [ ] Critical path tests
- [ ] Browser compatibility tests
- [ ] Performance tests

## Test Results
### Coverage Report
- [ ] Unit test coverage: [PERCENTAGE]%
- [ ] Integration test coverage: [PERCENTAGE]%
- [ ] E2E test coverage: [PERCENTAGE]%

### Bug Tracking
- [ ] Critical bugs: [COUNT]
- [ ] High priority bugs: [COUNT]
- [ ] Medium priority bugs: [COUNT]
- [ ] Low priority bugs: [COUNT]

## Quality Gates
- [ ] All tests passing
- [ ] Coverage thresholds met
- [ ] Performance benchmarks met
- [ ] Security scan passed`,

  "4": `# [PROJECT_NAME] - [FEATURE_NAME] Deployment

## Deployment Overview
- **Project:** [PROJECT_NAME]
- **Feature:** [FEATURE_NAME] ([FEATURE_SLUG])
- **Owner:** [OWNER]
- **Date:** [DATE_ISO]
- **Stack:** [STACK]

## Pre-Deployment Checklist
### Code Quality
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Performance benchmarks met

### Infrastructure
- [ ] Environment configured
- [ ] Database migrations ready
- [ ] Monitoring configured
- [ ] Backup strategy in place

### Documentation
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] Deployment guide updated
- [ ] Rollback plan documented

## Deployment Plan
### Phase 1: Staging
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Validate functionality
- [ ] Performance testing

### Phase 2: Production
- [ ] Deploy to production
- [ ] Monitor metrics
- [ ] Validate deployment
- [ ] Notify stakeholders

## Post-Deployment
### Monitoring
- [ ] Application metrics
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User feedback collection

### Rollback Plan
- [ ] Rollback triggers defined
- [ ] Rollback procedure tested
- [ ] Communication plan ready
- [ ] Recovery time estimated`,
} as const;
