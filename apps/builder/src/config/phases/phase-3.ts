import type {PhaseConfig} from "../types";

export const PHASE_3_CONFIG: PhaseConfig = {
  id: "3",
  title: "Testing",
  template: `# [PROJECT_NAME] - [FEATURE_NAME] Testing

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
  description:
    "Comprehensive testing phase covering unit, integration, and end-to-end testing with quality gates",
};
