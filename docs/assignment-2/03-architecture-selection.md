# 03 - Architecture Selection

## Project
- Project: MatchProof
- Date: 2026-03-31
- Version: 1.0 (Initial Architecture Decision)

## Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Architecture alternatives review | Yiğit Yıldız | Alp Eren Köksal | Completed |
| Layered architecture selection rationale | Yiğit Yıldız | Alp Eren Köksal | Completed |
| Layer definitions and responsibilities | Yiğit Yıldız | Alp Eren Köksal | Completed |
| Architecture trade-off summary | Yiğit Yıldız | Alp Eren Köksal | Completed |
| Initial evolution path documentation | Yiğit Yıldız | Alp Eren Köksal | Completed |

## Selected Architecture Approach
For this project, **Layered Architecture** is selected.

Reasons for this selection:
- Enables fast development and easy single-deployment operation within course project constraints.
- Improves maintainability and testability by separating responsibilities into layers.
- Leaves clear boundaries for potential future service extraction.

## Layers
1. Presentation Layer (React UI)
2. API Layer (Express Routes)
3. Application/Domain Layer (Auth, Items, Search, Matching, Moderation Services)
4. Data Layer (Models + PostgreSQL + Upload Storage)

## Why Not Other Architectures?
- Full microservices: operationally heavy for the current project size and team capacity.
- Event-driven-first architecture: useful for async workflows but adds unnecessary complexity in the first phase.
- Full Clean implementation: valuable but higher setup and alignment cost for current timeline.

## Architecture Decision Outcome
The project starts as a layered monolith. The following areas can be extracted later if needed:
- Matching Service
- Media Upload Pipeline
- Notification Service (future scope)
