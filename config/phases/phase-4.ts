import type {PhaseConfig} from "../types";

export const PHASE_4_CONFIG: PhaseConfig = {
  id: "4",
  title: "Deployment",
  template: `# [PROJECT_NAME] - [FEATURE_NAME] Deployment

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
  description:
    "Final deployment phase including pre-deployment checks, deployment plan, and post-deployment monitoring",
};
