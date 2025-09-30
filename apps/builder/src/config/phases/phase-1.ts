import type {PhaseConfig} from "../types";

export const PHASE_1_CONFIG: PhaseConfig = {
  id: "1",
  title: "Planning",
  template: `# [PROJECT_NAME] - [FEATURE_NAME] Planning

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
  description:
    "Detailed planning phase including requirements analysis, technical design, and risk assessment",
};
