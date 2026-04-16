# Sprint 1 Plan & Review

**Project Name:** MatchProof
**Course:** BIL 481
**Sprint Number:** 1
**Sprint Duration:** 2026-02-12 – 2026-02-25 (2 weeks)
**Sprint Goal:** Establish the complete backend foundation and deliver a working frontend application — covering user authentication, lost and found item posting with photo upload, keyword search, category and date filtering, item status management, and owner contact display.

---

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Elif Beyza Turan

---

## Table of Contents
- [Document-Specific Task Matrix](#document-specific-task-matrix)
- [Scrum Roles](#scrum-roles)
- [Sprint Overview](#sprint-overview)
- [Pre-Sprint: Planning Phase](#pre-sprint-planning-phase)
- [Sprint Backlog](#sprint-backlog)
- [Task Breakdown](#task-breakdown)
- [Definition of Done](#definition-of-done)
- [Sprint Review](#sprint-review)
- [Sprint Retrospective](#sprint-retrospective)

---

## Document-Specific Task Matrix

| Task | Responsible | Status |
|---|---|---|
| Sprint goal definition | Elif Beyza Turan | Completed |
| Sprint backlog selection from product backlog | Elif Beyza Turan | Completed |
| Pre-sprint planning task breakdown | Elif Beyza Turan | Completed |
| Backend task breakdown | Elif Beyza Turan | Completed |
| Frontend task breakdown | Elif Beyza Turan | Completed |
| QA and coordination task breakdown | Elif Beyza Turan | Completed |
| Definition of Done writing | Elif Beyza Turan | Completed |
| Sprint review and retrospective writing | Elif Beyza Turan | Completed |

---

## Scrum Roles

| Role | Team Member | Responsibilities in This Project |
|---|---|---|
| Product Owner | Yiğit Yıldız | Owns and maintains the product backlog. Defines acceptance criteria and requirement traceability. Prioritizes backlog items in coordination with the team. Ensures delivered increments meet the requirements baseline (FR1–FR14, NFR1–NFR6). |
| Scrum Master | Zehra Atalay | Facilitates sprint ceremonies (planning, review, retrospective). Tracks sprint progress, removes impediments, maintains the risk register, and coordinates team communication. Ensures the Scrum process is followed. |
| Development Team | Mehmet Gür | Backend architecture, all API routes, database schema, migration runner, authentication, item management, search, status flow, moderation, image upload pipeline, developer documentation. |
| Development Team | Elif Beyza Turan | All frontend pages and components, API client, context providers, shared UI library, frontend manual testing, environment configuration. |
| Development Team | Alp Eren Köksal | Backend support, database field additions, model-level contributions, test coverage for models and services. |
| Development Team | Zehra Atalay | Project coordination, requirements management, AI matching development (Sprint 2), QA coordination. Also acts as Scrum Master. |
| Development Team | Yiğit Yıldız | Requirements traceability, architecture and design documentation, backend and frontend test suites. Also acts as Product Owner. |

---

## Sprint Overview

| Item | Value |
|---|---|
| Sprint Number | 1 |
| Start Date | 2026-02-12 |
| End Date | 2026-02-25 |
| Total Planned Story Points | 27 SP |
| Sprint Goal | Working MVP: register, login, post a lost or found item with photo, search by keyword, filter by category and date, mark item status, view owner contact information |

---

## Pre-Sprint: Planning Phase

The following planning and baseline documents were completed before Sprint 1 began (2026-01-28 – 2026-02-11). These outputs directly enabled sprint execution.

### Project Definition and Requirements

| Task | Responsible | Role | Status |
|---|---|---|---|
| Project name definition and project summary | All team members | All | Completed |
| Problem statement, stakeholder analysis, scope and out-of-scope definition | Elif Beyza Turan | Development Team | Completed |
| Risk identification and mitigation strategies | Elif Beyza Turan | Development Team | Completed |
| Key features specification and deliverables listing | Elif Beyza Turan | Development Team | Completed |
| Budget and resources planning | Mehmet Gür | Development Team | Completed |
| Functional requirements baseline (FR1–FR14) | Zehra Atalay | Scrum Master / Development Team | Completed |
| Non-functional requirements baseline (NFR1–NFR6) | Zehra Atalay | Scrum Master / Development Team | Completed |
| Requirements document formatting and table of contents | Zehra Atalay | Scrum Master / Development Team | Completed |

### Project Plan and Backlog

| Task | Responsible | Role | Status |
|---|---|---|---|
| Project scheduling, timeline, Gantt chart, and milestone definition | Yiğit Yıldız | Product Owner | Completed |
| Team communication plan and change management plan | Yiğit Yıldız | Product Owner | Completed |
| Resource planning | Yiğit Yıldız | Product Owner | Completed |
| Roles definition and phase ownership mapping | Mehmet Gür | Development Team | Completed |
| Feature and work task matrix creation | Mehmet Gür | Development Team | Completed |
| Estimation method documentation, phase effort table, per-person effort mapping | Mehmet Gür | Development Team | Completed |
| Product backlog creation with MoSCoW prioritization and story point estimates | Mehmet Gür | Development Team | Completed |
| FR/NFR to backlog item traceability mapping | Mehmet Gür | Development Team | Completed |

### Technical Groundwork

| Task | Responsible | Role | Status |
|---|---|---|---|
| Set up project repository structure and base configuration | Mehmet Gür | Development Team | Completed |
| Write initial implementation guide for backend setup | Mehmet Gür | Development Team | Completed |
| Write initial design document: high-level architecture, component structure, and API interface definitions | Mehmet Gür | Development Team | Completed |

---

## Sprint Backlog

| PB-ID | Backlog Item | Priority | SP | Development Owner | Status |
|---|---|---|---|---|---|
| PB1 | As a user, I can register and log in. | Must | 5 | Mehmet Gür | Completed |
| PB2 | As a user, I can create a lost item post (title/desc/category/location). | Must | 3 | Mehmet Gür | Completed |
| PB3 | As a user, I can create a found item post (details/location). | Must | 3 | Mehmet Gür | Completed |
| PB4 | As a user, I can upload item photos with validation and storage. | Must | 5 | Mehmet Gür | Completed |
| PB5 | As a user, I can search listings using keywords. | Must | 3 | Mehmet Gür | Completed |
| PB6 | As a user, I can filter by category and date. | Must | 2 | Mehmet Gür | Completed |
| PB7 | As a user, I can mark an item as claimed/resolved. | Must | 2 | Mehmet Gür | Completed |
| PB8 | As a user, I can view the contact information of the post owner. | Must | 2 | Elif Beyza Turan | Completed |
| PB17 | Works on modern desktop browsers (Chrome/Firefox/Edge). | Must | 2 | Elif Beyza Turan | Completed |

**Total: 27 SP**

---

## Task Breakdown

### Backend — Mehmet Gür (Development Team)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Set up Express server, PostgreSQL connection pool, session middleware (connect-pg-simple), and migration runner | PB1 | backend: set up express, postgres, sessions and migration foundation |
| Implement session-based authentication: register, login, logout, GET /api/auth/me with bcrypt password hashing | PB1 | backend: add session-based authentication flow |
| Implement requireAuth and requireAdmin middleware | PB1, PB9 | backend: add session-based authentication flow |
| Implement item CRUD: POST /api/items, GET /api/items/:id, PATCH /api/items/:id, DELETE /api/items/:id with multer-based local image upload and sharp validation | PB2, PB3, PB4 | backend: add item CRUD and local image upload flow |
| Expose ownerContact (name + email) in item detail response | PB8 | backend: add item CRUD and local image upload flow |
| Implement GET /api/items/search with keyword, category, date, status, and type filters and pagination envelope | PB5, PB6 | backend: add item search and filtering flow |
| Implement PATCH /api/items/:id/status with state transition validation (open to claimed to resolved) | PB7 | backend: add item status update flow |
| Implement POST /api/moderation/items/:id/remove with admin-only access, moderation_actions table, and reason validation | PB9 (merged Sprint 1 end) | backend: add admin moderation remove flow |
| Align project documentation with actual backend structure and routes | -- | docs: align project documents with current backend flow |
| Write backend team guide and implementation guide for team onboarding | -- | docs: add backend team guide |
| Write frontend team guide so the frontend developer can work without backend knowledge | -- | Create FRONTEND_TEAM_GUIDE.md |
| Update README with project overview and setup instructions | -- | Update README.md |

### Frontend — Elif Beyza Turan (Development Team)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Upload initial frontend file structure to repository | -- | Add files via upload (multiple commits) |
| Update project definition document | -- | Update 01-project-definition.md |
| Add all missing frontend infrastructure: fetch-based API client (Auth, Items, Moderation modules), AuthContext with session persistence on mount, ToastContext with auto-dismiss notifications, index.html entry point, vite.config.mjs with /api and /uploads proxy to backend port | PB1 | add missing frontend infrastructure to make app runnable |
| Build AuthPage: login and register forms with tab switching and inline error display | PB1 | add missing frontend infrastructure to make app runnable |
| Build SearchPage: keyword search input, category/type/status/date range filters, ItemCard grid with hover effects, and Pagination component | PB5, PB6 | add missing frontend infrastructure to make app runnable |
| Build DetailPage: item metadata display, image rendering with blur for private items, owner contact card, status action buttons (Mark as Claimed, Mark as Resolved), Edit Post and Delete Post actions, admin Remove Post with reason modal | PB7, PB8, PB9 | add missing frontend infrastructure to make app runnable |
| Build AdminPage: moderation panel with item list and per-item View and Remove actions, reason modal, and pagination | PB9 | add missing frontend infrastructure to make app runnable |
| Build PostFormPage: create mode and edit mode for lost and found posts with category dropdown, location input, description textarea, and photo upload | PB2, PB3, PB4, PB10 | add missing frontend infrastructure to make app runnable |
| Build shared UI component library: Badge, Btn, Card, Field, Input, Select, Textarea, Spinner, EmptyState, Modal, PageHeader, Alert, MonoLabel, Divider, formatDate, CATEGORIES | PB1–PB8 | add missing frontend infrastructure to make app runnable |
| Fix useEffect missing dependency warnings: wrap fetchItems in SearchPage and fetchItemsCallback in AdminPage with useCallback | PB5, PB6 | resolve useEffect missing dependency warnings in SearchPage and AdminPage |
| Fix environment file: replace personal credentials with generic placeholders in .env.example | -- | env fixed |
| Manual verification of register, login, post creation, search, filter, detail view, and status flows in Chrome | PB17 | -- |

### Product Owner Activities — Yiğit Yıldız

| Task | Status |
|---|---|
| Verify FR1–FR14 and NFR1–NFR6 are traceable to PB1–PB20 in the product backlog | Completed |
| Review acceptance criteria alignment with implemented backend routes | Completed |
| Update requirements-to-backlog transition document | Completed |
| Project scheduling, timeline, and milestone tracking for Sprint 1 | Completed |
| Maintain and update project plan document (02-project-plan.md) | Completed |

### Scrum Master Activities — Zehra Atalay

| Task | Status |
|---|---|
| Facilitate sprint planning session: confirm sprint goal and backlog selection | Completed |
| Set up team communication channels and weekly sync schedule | Completed |
| Track sprint milestone progress and flag blockers | Completed |
| Maintain risk register: AI model accuracy, time constraints, integration risks | Completed |
| Coordinate requirements baseline review with Yiğit Yıldız | Completed |
| Coordinate manual smoke test of MVP flows at sprint end | Completed |
| Facilitate sprint review and retrospective | Completed |

---

## Definition of Done

A backlog item is considered done when:

- The backend route(s) for the feature exist and return correct HTTP responses with the expected payload shape.
- The frontend page or component renders and interacts with the feature correctly.
- Authorization rules are enforced where applicable.
- The feature works in at least one target browser (Chrome).
- No known blocking bugs remain for the item.
- The item has been manually verified by at least one team member other than the implementer.
- The Product Owner (Yiğit Yıldız) has confirmed the item meets the acceptance criteria for the linked FR/NFR.

---

## Sprint Review

### Completed Items

All 9 planned backlog items (PB1–PB8, PB17) were completed within the sprint. Total velocity: 27 SP.

### Key Outcomes

- Mehmet Gür (Development Team) delivered the entire backend from scratch as a series of focused feature branches, each merged via pull request: server and database setup, session-based authentication, item CRUD with image upload, keyword search with filtering and pagination, item status management, and admin moderation backend.
- Elif Beyza Turan (Development Team) delivered the complete frontend application: all five page components, the shared UI component library, the API client layer, AuthContext, and ToastContext. useEffect dependency warnings were resolved post-delivery.
- Owner contact information (name and email) is displayed correctly on item detail pages.
- Search and filter functionality is connected to backend query parameters and returns correct paginated results.
- Yiğit Yıldız (Product Owner) verified requirement traceability and confirmed all PB1–PB8 items meet their acceptance criteria.
- Zehra Atalay (Scrum Master) coordinated the MVP smoke test and confirmed the sprint goal was met.

### Issues Encountered

| Issue | Resolution |
|---|---|
| Category values in the frontend CATEGORIES constant did not match the category strings in the database. | Synchronized manually between backend and frontend. |
| Session cookie was not persisting correctly in early development due to misconfigured SESSION_SECRET and cookie settings. | Environment variables and session options were corrected. |
| API client, context providers, and index.html were missing from the repository, blocking frontend development. | Elif Beyza Turan added all missing frontend infrastructure in a dedicated commit. |
| useEffect hooks in SearchPage and AdminPage triggered unnecessary re-renders due to missing dependency declarations. | Callbacks wrapped in useCallback and added to dependency arrays. |

### Items Not Completed

None. All planned sprint items were delivered.

---

## Sprint Retrospective

### What Went Well

- Backend feature branches (one per route group) kept the merge history clean and gave clear ownership over each API capability.
- Mehmet Gür's backend team guide and frontend team guide allowed Elif Beyza Turan to build the frontend without needing to trace backend commits.
- The Scrum Master (Zehra Atalay) successfully coordinated the end-of-sprint smoke test and confirmed the sprint goal.

### What Could Be Improved

- A shared API contract document agreed upon before development would reduce integration friction.
- The frontend was delivered as a single large commit due to deep interdependencies between pages, contexts, and the API client. More granular commits would improve reviewability.
- Test coverage was not established in Sprint 1. This was accepted as a Sprint 2 priority.

### Action Items for Sprint 2

- Establish automated backend test suite (Yiğit Yıldız, Alp Eren Köksal).
- Integrate AI matching pipeline (Zehra Atalay).
- Document architecture and design decisions for Assignment 2 (Yiğit Yıldız).
