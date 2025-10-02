import type {PhaseConfig} from "../types";

export const BACKEND_PHASE_1_CONFIG: PhaseConfig = {
  id: "backend-1",
  title: "Database Schema & Data Modeling",
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
