import type {PhaseConfig} from "../types";

export const PHASE_2_5_CONFIG: PhaseConfig = {
  id: "2.5",
  title: "Review",
  template: `# [PROJECT_NAME] - [FEATURE_NAME] Review

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
  description:
    "Code review phase ensuring quality, functionality, and readiness for testing",
};
