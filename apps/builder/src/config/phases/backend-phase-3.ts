import type {PhaseConfig} from "../types";

export const BACKEND_PHASE_3_CONFIG: PhaseConfig = {
  id: "3",
  title: "System Architecture & Performance",
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
