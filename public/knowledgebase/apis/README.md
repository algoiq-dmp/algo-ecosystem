# Algo IQ Ecosystem — API Registry

## Governance Matrix

| Sr | API / Engine | Status | Priority | Comm Type | Auth | Version |
|---|---|---|---|---|---|---|
| 1 | Surya Engine API | Required | Go-Live Critical | Pull + Push | API Key | 3.5.0 |
| 2 | Ganesh Engine API | Required | Go-Live Critical | Pull | API Key | 2.6.1 |
| 3 | TalkOptions API | Required | High Priority | Pull | API Key | 4.7.2 |
| 4 | Suchak ↔ Kuber Alpha API | Required | High Priority | Two-way | API Key + JWT | 5.0.0 |
| 5 | Garuda Margin API | Required | High Priority | Request/Response | API Key | 5.0.0 |
| 6 | Garuda Margin Intelligence API | Required | Pending | Request/Response | API Key | 5.0.0 |
| 7 | TalkDelta API | Required | High Priority | Two-way | API Key | 6.0.0-beta |
| 8 | Vega TalkStrategy API | Required | Go-Live Critical | Push | API Key + JWT | 6.3.0 |
| 9 | Vega Order Processor API | Required | Go-Live Critical | Two-way | API Key | 6.3.0 |
| 10 | MQ API | Required | Go-Live Critical | Pub/Sub | Internal | 1.8.4 |
| 11 | WebSocket API | Required | Go-Live Critical | Publish | JWT | 2.3.2 |
| 12 | Lakshmi Engine API | In Progress | Go-Live Critical | Publish + Pull | API Key | 3.0.0 |
| 13 | Kavach ↔ Kuber Alpha API | Pending | Pending | Two-way | API Key + JWT | 3.5.0 |
| 14 | Manthan API | Pending | Pending | Two-way | API Key | 2.8.1 |

## Standard API Document Structure

Every API document must contain:
1. Overview
2. Purpose
3. Authentication
4. Base URL
5. Headers
6. Request format
7. Response format
8. Error codes
9. Retry policy
10. Rate limits
11. Timeout values
12. Webhook events
13. Sample requests
14. Sample responses
15. Sequence diagrams
16. Dependency matrix
17. Versioning policy
18. Changelog
19. Testing checklist
20. Security considerations
21. Production readiness checklist

## Governance

- API owners are responsible for maintaining documentation
- All API changes require approval through the Change Approval Workflow
- Swagger/OpenAPI specs should be published alongside documentation
- Test and Production URLs must be documented
