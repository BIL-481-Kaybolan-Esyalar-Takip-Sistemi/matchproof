# Task Assignments & Effort Estimations (Assignment 1)

**Project Name:** MatchProof  
**Course:** BIL 481  
**Last Updated (YYYY-MM-DD):** 2026-02-02  

## Document Authorship

**Document Title:** Task Assignments & Effort Estimations  
**Project Name:** MatchProof  
**Date:** 2026-02-02

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Mehmet Gür

## Table of Contents

0. Document-Specific Task Matrix  
1. Team Members and Roles  
2. Task Assignments  
3. Effort Estimations  
4. Rationale for Task Assignment  

## 0) Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Roles definition (team members & roles) | Mehmet Gür | - | Completed |
| Phase ownership mapping | Mehmet Gür | - | Completed |
| Feature/Work Task Matrix creation | Mehmet Gür | - | Completed |
| Estimation method text | Mehmet Gür | - | Completed |
| Phase effort estimation table | Mehmet Gür | - | Completed |
| Per-person effort mapping | Mehmet Gür | - | Completed |
| Rationale for task assignment | Mehmet Gür | - | Completed |
| Formatting & ToC | Mehmet Gür | - | Completed |

## 1) Team Members and Roles


| Team Member | Role |
|---|---|
| Zehra Atalay | Project Manager & Coordinator |
| Yiğit Yıldız | Requirements Analyst & Documentation (Traceability) |
| Elif Beyza Turan | UI/UX & Frontend |
| Alp Eren Köksal | Backend & Database |
| Mehmet Gür | AI/ML Matching |

## 2) Task Assignments

### 2.1) Phase Ownership (Simple)

| Phase | Responsible | Support |
|---|---|---|
| Requirements Gathering | Yiğit Yıldız | Zehra Atalay, Alp Eren Köksal |
| Design | Elif Beyza Turan | Alp Eren Köksal, Mehmet Gür |
| Development | Alp Eren Köksal | Elif Beyza Turan |
| AI Matching & Explainability | Mehmet Gür | Alp Eren Köksal |
| Testing & QA | Zehra Atalay | Yiğit Yıldız, Elif Beyza Turan |
| Deployment | Zehra Atalay | Alp Eren Köksal |
| Documentation & Closure | Yiğit Yıldız | Zehra Atalay |

### 2.2) Feature/Work Task Matrix

| Work Item | Responsible | Support |
|---|---|---|
| Requirements baseline (FR/NFR + acceptance checklist) | Yiğit Yıldız | Zehra Atalay |
| Documentation package (Assignment docs alignment) | Yiğit Yıldız | Elif Beyza Turan |
| Requirements traceability (FR→tasks) + acceptance review | Yiğit Yıldız | Mehmet Gür |
| Project coordination (milestones, risks, change requests) | Zehra Atalay | Yiğit Yıldız |
| QA plan + test execution + bug triage | Zehra Atalay | Elif Beyza Turan |
| Release/deploy checklist | Zehra Atalay | Alp Eren Köksal |
| UI/UX + core screens (post, browse/search, details, claim form) | Elif Beyza Turan | Yiğit Yıldız |
| Moderation/admin UI + content policy workflow | Elif Beyza Turan | Zehra Atalay |
| Responsive/accessibility polish (basic) | Elif Beyza Turan | Mehmet Gür |
| Backend core (auth, listings, claim workflow) | Alp Eren Köksal | Elif Beyza Turan |
| Media pipeline (image validation, storage, resizing) | Alp Eren Köksal | Mehmet Gür |
| Search + data access (filters, pagination) | Alp Eren Köksal | Yiğit Yıldız |
| AI similarity scoring + ranking (text+image) | Mehmet Gür | Alp Eren Köksal |
| Explainable matching (brief reasons) | Mehmet Gür | Alp Eren Köksal |
| AI evaluation & tuning (sample cases, thresholds) | Mehmet Gür | Zehra Atalay |

## 3) Effort Estimations

### 3.1) Estimation Method

The effort estimation for this project was performed using a combination of **expert judgment** and **analogy-based estimation**.

Expert judgment was applied by considering the team members’ prior experience with similar academic software projects (web-based CRUD systems, authentication, search/filtering) and the planned AI component (using pre-trained embeddings for multi-modal similarity ranking and explainable matching).

Analogy-based estimation was used by comparing the scope, complexity, and deliverables of MatchProof with previously completed student projects of similar size. The comparison considered factors such as the number of core user flows (post → search → claim → resolve), integration overhead for the AI matching module, and the required documentation workload.

Based on these considerations, the estimated effort values were determined collaboratively by the team and reviewed to ensure feasibility within the course timeline.  
Conversion used: **1 person-day = 8 person-hours**.

### 3.2) Effort Estimation for Each Phase

| Phase | Estimate (person-hours) |
|---|---:|
| Requirements & planning | 15 |
| Design | 15 |
| Development | 70 |
| AI matching & explainability | 30 |
| Testing & QA | 20 |
| Deployment | 5 |
| Documentation & closure | 5 |
| **Total Project Effort** | **160** |

### 3.3) Estimate Total Effort per Person (Mapped to Roles)

| Team Member | Role | Estimate (person-hours) |
|---|---|---:|
| Zehra Atalay | Project Manager & Coordinator | 32 |
| Yiğit Yıldız | Requirements Analyst & Documentation | 26 |
| Elif Beyza Turan | UI/UX & Frontend | 34 |
| Alp Eren Köksal | Backend & Database | 38 |
| Mehmet Gür | AI/ML Matching | 30 |
| **Total** |  | **160** |

### 3.4) Estimate Effort per Task (Simple)

| Task Group | Owner | Estimate (person-hours) |
|---|---|---:|
| Requirements + acceptance checks + documentation | Yiğit Yıldız | 26 |
| UI/UX + frontend implementation | Elif Beyza Turan | 34 |
| Backend + database + core workflows | Alp Eren Köksal | 38 |
| AI matching + explainability | Mehmet Gür | 30 |
| Coordination + QA + release/deploy | Zehra Atalay | 32 |
| **Total** |  | **160** |

## 4) Rationale for Task Assignment

- Roles were assigned based on team members’ interests and prior experience; tasks were then mapped to those roles to create clear ownership and accountability.
- Work was split by system boundaries (frontend, backend/database, AI, requirements/documentation, coordination/QA) to reduce coupling and allow parallel progress with fewer integration conflicts.
- The MVP prioritizes the core flow (post → search → claim → resolve); the AI component is implemented as a non-blocking enhancement (ranked suggestions + brief explanation).
- Each major work area has at least one supporting contributor, reducing single‑point‑of‑failure risk and enabling cross‑review and knowledge transfer.
- Requirements ownership is paired with acceptance checks so each implemented feature has a verifiable “done” definition and the scope stays controlled.
- The distribution reflects expected workload: backend workflows and data handling require steady effort, AI matching needs focused iteration, and PM/QA ensures coordination and timely delivery.
