import type {PhaseConfig} from "../types";

export const PHASE_2_CONFIG: PhaseConfig = {
  id: "2",
  title: "Implementation",
  template: `# [PROJECT_NAME] - [FEATURE_NAME] Implementation

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
  description:
    "Implementation phase tracking development progress, technical details, and testing status",
};
