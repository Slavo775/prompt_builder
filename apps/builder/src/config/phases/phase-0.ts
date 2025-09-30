import type {PhaseConfig} from "../types";

export const PHASE_0_CONFIG: PhaseConfig = {
  id: "0",
  title: "Discovery",
  template: `# [PROJECT_NAME] - [FEATURE_NAME] Discovery

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
  description:
    "Initial discovery and research phase for understanding project requirements and constraints",
};
