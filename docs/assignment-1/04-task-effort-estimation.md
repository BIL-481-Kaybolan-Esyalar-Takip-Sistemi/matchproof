# Task Assignments & Effort Estimations (Assignment 1)

**Project Name:** MatchProof  
**Course:** BIL 481  
**Last Updated (YYYY-MM-DD):** 2026-02-02  

## Table of Contents

1. Team Members and Roles  
2. Task Assignments  
3. Effort Estimations  
4. Rationale for Task Assignment  

## 1) Team Members and Roles


| Team Member | Role |
|---|---|
| Zehra Atalay | Project Manager & Coordinator |
| Yiğit Yıldız | Requirements Analyst & Documentation |
| Elif Beyza Turan | UI/UX & Frontend |
| Alp Eren Köksal | Backend & Database |
| Mehmet Gür | AI/ML Matching |

## 2) Task Assignments

### 2.1) Phase Ownership (Simple)

| Phase | Responsible | Support |
|---|---|---|
| Requirements Gathering | Yiğit Yıldız | Alp Eren Köksal |
| Design | Elif Beyza Turan | Mehmet Gür, Alp Eren Köksal |
| Development | Mehmet Gür | Elif Beyza Turan |
| AI Matching & Explainability | Mehmet Gür | Zehra Atalay |
| Testing & QA | Elif Beyza Turan | Yiğit Yıldız |
| Deployment | Mehmet Gür | Zehra Atalay |
| Documentation & Closure | Yiğit Yıldız | Zehra Atalay |

### 2.2) Feature/Work Task Matrix

| Work Item | Responsible | Support |
|---|---|---|
| Requirements baseline (FR/NFR + acceptance checklist) | Yiğit Yıldız | Zehra Atalay |
| Campus taxonomy (categories + campus locations) | Yiğit Yıldız | Elif Beyza Turan |
| Auth & sessions (register/login/logout) | Alp Eren Köksal | Elif Beyza Turan |
| Listings UI (lost/found create/edit + photo upload UX) | Elif Beyza Turan | Alp Eren Köksal |
| Listings API + DB schema (metadata, status, resolution) | Alp Eren Köksal | Yiğit Yıldız |
| Media pipeline (image validation, storage, resizing) | Alp Eren Köksal | Elif Beyza Turan |
| Search UI (filters: category/location/date/status) | Elif Beyza Turan | Yiğit Yıldız |
| Search backend (filters + pagination) | Alp Eren Köksal | Mehmet Gür |
| Claim flow UI (claim request + verification prompts) | Elif Beyza Turan | Yiğit Yıldız |
| Claim workflow backend (states, approve/reject/resolve) | Alp Eren Köksal | Zehra Atalay |
| Notifications (in-app) | Alp Eren Köksal | Zehra Atalay |
| Report & moderation process (policy + workflow) | Zehra Atalay | Yiğit Yıldız |
| Admin moderation UI (queue: hide/remove/restore) | Elif Beyza Turan | Zehra Atalay |
| Multi-modal similarity ranking (text+image) | Mehmet Gür | Alp Eren Köksal |
| Explainable matching (match reasons + score breakdown) | Mehmet Gür | Yiğit Yıldız |
| Match suggestions UI (ranked list + explanations) | Elif Beyza Turan | Mehmet Gür |
| Test cases & acceptance checks | Yiğit Yıldız | Elif Beyza Turan |
| Release/deploy checklist | Alp Eren Köksal | Zehra Atalay, Mehmet Gür |

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
| Zehra Atalay | Project Manager & Coordinator | 25 |
| Yiğit Yıldız | Requirements Analyst & Documentation | 25 |
| Elif Beyza Turan | UI/UX & Frontend | 35 |
| Alp Eren Köksal | Backend & Database | 45 |
| Mehmet Gür | AI/ML Matching | 30 |
| **Total** |  | **160** |

### 3.4) Estimate Effort per Task (Simple)

| Task Group | Owner | Estimate (person-hours) |
|---|---|---:|
| Requirements + acceptance checks + documentation | Yiğit Yıldız | 25 |
| UI/UX + frontend implementation | Elif Beyza Turan | 35 |
| Backend + database + core workflows | Alp Eren Köksal | 45 |
| AI matching + explainability | Mehmet Gür | 30 |
| Coordination + QA + release/deploy | Zehra Atalay | 25 |
| **Total** |  | **160** |

## 4) Rationale for Task Assignment

- Roles were assigned beforehand (randomly) to ensure fairness; tasks were then mapped to the assigned roles to create clear ownership and accountability.
- Work was split by system boundaries (frontend, backend/database, AI, requirements/documentation, coordination/QA) to reduce coupling and allow parallel progress with fewer integration conflicts.
- Each major work area has at least one supporting contributor, reducing single‑point‑of‑failure risk and enabling cross‑review and knowledge transfer.
- Requirements ownership is paired with acceptance checks so each implemented feature has a verifiable “done” definition and the scope stays controlled.
- The distribution reflects expected workload: backend workflows and data handling require steady effort, AI matching needs focused iteration, and PM/QA ensures coordination and timely delivery.
