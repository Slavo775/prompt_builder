import type {PhaseConfig} from "../types";

export const BACKEND_PHASE_2_CONFIG: PhaseConfig = {
  id: "2",
  title: "Business Logic & Service Architecture",
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
