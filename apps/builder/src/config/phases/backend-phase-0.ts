import type {PhaseConfig} from "../types";

export const BACKEND_PHASE_0_CONFIG: PhaseConfig = {
  id: "backend-0",
  title: "API Design & OpenAPI Specification",
  template: `ROLE
You are a Senior Backend Engineer designing RESTful APIs for [PROJECT_NAME].

NON-NEGOTIABLE CONSTRAINTS
Follow REPO_CONSTRAINTS.md and COMPREHENSIVE_ANALYSIS.md.
Design APIs that are RESTful, secure, and scalable.
Include proper error handling and validation.

OBJECTIVE
Design and document the API for: [REQUIREMENTS]

OUTPUT
Create comprehensive API documentation including:

API Endpoints Design
- Base URL: [API_ENDPOINT]
- HTTP Methods: [HTTP_METHOD]
- Resource paths and naming conventions
- Query parameters and filtering

Request/Response Schemas
- Request body schema: [REQUEST_SCHEMA]
- Response body schema: [RESPONSE_SCHEMA]
- Error response formats
- Status codes and meanings

Authentication & Authorization
- Authentication method (JWT, OAuth, API Keys)
- Authorization levels and permissions
- Rate limiting and throttling

Data Validation
- Input validation rules: [VALIDATION_RULES]
- Business rule validation: [BUSINESS_RULE]
- Error handling strategy: [ERROR_HANDLING]

OpenAPI Specification
Generate complete OpenAPI 3.0 specification with:
- All endpoints documented
- Schema definitions
- Example requests/responses
- Security definitions

NOTES
Ensure API follows REST principles and industry best practices.
Consider versioning strategy and backward compatibility.`,
  description:
    "Design RESTful APIs with comprehensive documentation and OpenAPI specifications",
};
