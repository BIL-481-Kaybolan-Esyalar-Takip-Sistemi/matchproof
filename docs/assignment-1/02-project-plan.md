# Project Plan Document (Assignment 1)

MatchProof – Campus Lost & Found Digital Platform

Course: BIL 481
Version: 1.0
Date: 2026-02-03

| Team Members |
| Zehra Atalay |
| Yiğit Yıldız |
| Elif Beyza Turan |
| Alp Eren Köksal |
| Mehmet Gür |

Document-Specific Task Matrix:

| Task | Responsible | Status |
| --- | --- | --- |
| Identifying Project Objectives | Yigit Yildiz | Completed |
| Project Scheduling | Yigit Yildiz | Completed |
| Team-Communications Plans | Yigit Yildiz | Completed |
| Resource Plan | Yigit Yildiz | Completed |
| Change Management Plan | Yigit Yildiz | Completed |
| Timeline and GANTT Chart(ToC) | Yigit Yildiz | Completed |

# Revision History

| Version | Date | Author(s) | Notes |
| --- | --- | --- | --- |
| 1.0 | 2026-02-03 | Project Team | Initial baseline project plan. |

# 1. Project Overview

MatchProof is a web-based campus lost and found platform that provides a centralized place to post, search, and match lost/found items. The platform combines text-based search with AI-powered image feature extraction (e.g., color and object type) to improve matching accuracy and reduce time to recovery.

# 2. Project Scope

## 2.1 In Scope

- User registration, login, and profile management
- Lost item posting (title, description, category, location, photo upload)
- Found item posting (item details, discovery location, photo upload)
- Keyword-based search and filtering (category, date, status)
- AI-powered image analysis to extract basic visual features (color, object type)
- AI-enhanced matching for improved search relevance
- User communication (in-app messaging or contact information display)
- Item status management (claimed/resolved), post edit/delete by owner
- Administrative moderation (remove inappropriate/duplicate posts)
- Desktop browser support

## 2.2 Out of Scope

- Native mobile applications (iOS/Android)
- Real-time push notifications
- Payments or reward systems
- Integration with campus security/physical lost & found offices
- Multi-campus / multi-institution support (initial
- Advanced analytics/reporting dashboards
- Social media integration

## 2.3 Assumptions and Constraints

Assumptions:

- Users have access to a desktop browser and can upload item photos.
- The project will use free or student-tier tools for hosting and collaboration.

Constraints:

- Academic timeline and team availability constraints.
- Budget is minimal (primarily free-tier services).

# 3. Project Objectives

## 3.1 Execution Objectives

- Deliver a functional web application accessible via desktop browsers.
- Implement FR1–FR12 (authentication, posting, search/filtering, claim flow, moderation, and AI-enhanced matching).
- Meet non-functional requirements: response time under 2 seconds and 99% availability during the testing period.

## 3.2 Management Objectives

- Maintain a single source of truth for scope via baseline requirements and controlled change requests.
- Provide clear ownership and accountability through role assignment and phase ownership.
- Track progress weekly against milestones and update risks/mitigations proactively.

# 4. Project Organization

## 4.1 Roles and Responsibilities

| Team Member | Role | Key Responsibilities |
| --- | --- | --- |
| Zehra Atalay | Project Manager & Coordinator | Planning, coordination, risk tracking, stakeholder communication, QA support, release readiness. |
| Yiğit Yıldız | Requirements Analyst & Documentation | Baseline requirements, acceptance checks, documentation, closure deliverables. |
| Elif Beyza Turan | UI/UX & Frontend | UI design, frontend implementation, testing support, admin UI. |
| Alp Eren Köksal | Backend & Database | Backend APIs, authentication, database schema, media pipeline, search backend. |
| Mehmet Gür | AI/ML Matching | Multi-modal similarity ranking, explainable matching, AI feature integration. |

## 4.2 Phase Ownership

| Phase | Responsible | Support |
| --- | --- | --- |
| Requirements & planning | Yiğit Yıldız | Alp Eren Köksal |
| Design | Elif Beyza Turan | Mehmet Gür, Alp Eren Köksal |
| Development | Mehmet Gür | Elif Beyza Turan |
| AI matching & explainability | Mehmet Gür | Zehra Atalay |
| Testing & QA | Elif Beyza Turan | Yiğit Yıldız |
| Deployment | Mehmet Gür | Zehra Atalay |
| Documentation & closure | Yiğit Yıldız | Zehra Atalay |

# 5. Key Phases, Timeline, and Deliverables

Baseline schedule below is aligned with the documented effort estimates (total 160 person-hours). Dates can be adjusted if the course calendar requires different milestones.

## 5.1 Timeline (Weekly Baseline)

| Phase | Start | End | Main Deliverables / Outputs |
| --- | --- | --- | --- |
| Kickoff + Planning + Requirements Baseline | 2026-01-28 | 2026-02-04 | Project plan v1, requirements baseline (FR/NFR), acceptance checklist |
| Design | 2026-02-05 | 2026-02-11 | Architecture draft, DB schema draft, UI mockups |
| Development + AI Integration (Sprint 1) | 2026-02-12 | 2026-02-18 | MVP: auth + posting + basic search; initial AI feature extraction |
| Development + AI Matching (Sprint 2) | 2026-02-19 | 2026-02-25 | Feature complete: moderation, claim flow, AI-enhanced ranking + explanations |
| Testing + Deploy + Closure | 2026-02-26 | 2026-03-01 | Test cases executed, bug fixes, performance checks. Final documentations |

## 5.2 Simple Gantt (Weeks)

# 6. Resource Planning

## 6.1 Software, Tools, and Services

| Category | Planned Resource |
| --- | --- |
| Frontend | React.js, HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL or MongoDB |
| AI/ML | TensorFlow.js or pre-trained models via API (free tier) |
| Version Control | GitHub |
| IDE/Dev Tools | VS Code |
| Design | Figma (free tier) |
| Hosting (dev/test) | Heroku / Netlify / Vercel free tier |
| Image Storage | AWS S3 free tier or similar |

## 6.2 Access and Usage

- • Source code will be maintained in a shared GitHub repository with a simple branching strategy.
- • Shared UI mockups and design assets will be stored in a team Figma workspace.
- • Development and testing will use free-tier hosting and storage to keep costs minimal.

# 7. Risk Management

The project will maintain a simple risk register and review risks weekly during team sync meetings.

## 7.1 Risk Register (Baseline)

| Risk | Impact | Probability | Mitigation |
| --- | --- | --- | --- |
| AI model accuracy limitations | Medium | High | Use pre-trained models, provide fallback to text-only search, gather feedback and iterate. |
| Time constraints due to academic workload | High | Medium | Add buffer, prioritize core features, iterate with agile milestones. |
| Technical skill gaps in AI integration | Medium | Medium | Allocate learning time, use well-documented libraries, seek instructor guidance; simplify if needed. |
| Database performance issues with image storage | Medium | Low | Use cloud storage + image compression, optimize queries, consider CDN. |

# 8. Communication Plan

# 8.1 Team Communication

- Weekly sync meeting (30–45 minutes): progress, blockers, next-week plan, risk review.
- Asynchronous daily updates in a shared channel (e.g., WhatsApp).
- Major technical changes require a short-written decision note in the repository (docs/decisions).

# 9. Change Management Plan

Changes to requirements or scope will be managed through a lightweight change request (CR) process to prevent scope creep and protect the timeline.

1. Submit CR: describe requested change, rationale, and priority.
1. Impact analysis: estimate effect on scope, schedule, effort, and risk.
1. Decision: Project Manager (and instructor/stakeholder if applicable) approves or rejects.
1. Update baselines: requirements, backlog, and timeline updated; versioned in repository.
1. Implementation: work scheduled into the next sprint/iteration; release notes updated.

# 10. Budget and Effort Allocation

## 10.1 Effort Budget (Person-Hours)

Effort estimates are based on expert judgment and analogy-based estimation. Total baseline effort: 160 person-hours. (1 person-day = 8 person-hours)

| Phase | Estimate (person-hours) |
| --- | --- |
| Requirements & planning | 15 |
| Design | 15 |
| Development | 70 |
| AI matching & explainability | 30 |
| Testing & QA | 20 |
| Deployment | 5 |
| Documentation & closure | 5 |
| Total | 160 |

## 10.2 Effort Allocation by Person (Baseline)

| Team Member | Role | Estimate (person-hours) |
| --- | --- | --- |
| Zehra Atalay | Project Manager & Coordinator | 25 |
| Yiğit Yıldız | Requirements Analyst & Documentation | 25 |
| Elif Beyza Turan | UI/UX & Frontend | 35 |
| Alp Eren Köksal | Backend & Database | 45 |
| Mehmet Gür | AI/ML Matching | 30 |

## 10.3 Monetary Budget (Estimated)

Planned monetary cost is minimal, leveraging free and open-source tools. Estimated budget: $0–15 (optional domain cost).
