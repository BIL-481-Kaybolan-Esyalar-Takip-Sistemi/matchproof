# Sprint 2 Plan & Review

**Project Name:** MatchProof
**Course:** BIL 481
**Sprint Number:** 2
**Sprint Duration:** 2026-02-26 – 2026-03-18 (3 weeks)
**Sprint Goal:** Integrate the full AI matching pipeline with ranked results and match explanations, add private item support for sensitive listings, complete Assignment 2 architecture and design documentation, and establish a comprehensive automated test suite covering backend services, models, middleware, and initial frontend components.

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
| AI and backend task breakdown | Elif Beyza Turan | Completed |
| Frontend integration task breakdown | Elif Beyza Turan | Completed |
| Privacy and field task breakdown | Elif Beyza Turan | Completed |
| Test task breakdown | Elif Beyza Turan | Completed |
| Documentation task breakdown | Elif Beyza Turan | Completed |
| Definition of Done writing | Elif Beyza Turan | Completed |
| Sprint review and retrospective writing | Elif Beyza Turan | Completed |

---

## Scrum Roles

| Role | Team Member | Responsibilities in This Sprint |
|---|---|---|
| Product Owner | Yiğit Yıldız | Refines and accepts AI-related backlog items (PB11–PB14, PB18). Verifies acceptance criteria against implemented matching behavior and privacy rules. Produces architecture and design documentation for Assignment 2. |
| Scrum Master | Zehra Atalay | Facilitates sprint planning, review, and retrospective. Coordinates AI branch integration. Tracks progress across three parallel workstreams (AI backend, tests, documentation). Manages risk register for merge conflicts and model download latency. Also delivers the AI matching implementation. |
| Development Team | Mehmet Gür | Backend documentation alignment, developer workflow guides, backend alignment with implemented structure. |
| Development Team | Elif Beyza Turan | Frontend integration of AI Possible Matches section into DetailPage. Manual testing support. |
| Development Team | Alp Eren Köksal | isPrivate field addition across database, service, and model layers. Model unit tests. Initial frontend component test stubs. AI matching test suite. |
| Development Team | Zehra Atalay | Full AI matching backend implementation: embeddings, image hashing, similarity scoring, match explanations, Strategy Pattern, Chain of Responsibility. Also acts as Scrum Master. |
| Development Team | Yiğit Yıldız | Comprehensive backend test suite, edge-case scenarios, upload and route error-path tests. Assignment 2 architecture and design documentation. Also acts as Product Owner. |

---

## Sprint Overview

| Item | Value |
|---|---|
| Sprint Number | 2 |
| Start Date | 2026-02-26 |
| End Date | 2026-03-18 |
| Total Planned Story Points | 32 SP |
| Sprint Goal | AI matching pipeline operational with ranked results and explanations; isPrivate field enabled; Assignment 2 documentation completed; comprehensive backend and initial frontend automated tests established |

---

## Sprint Backlog

| PB-ID | Backlog Item | Priority | SP | Development Owner | Status |
|---|---|---|---|---|---|
| PB9 | As an admin, I can remove inappropriate/duplicate posts. | Should | 3 | Mehmet Gür | Completed |
| PB10 | As a user, I can edit/delete my own posts. | Should | 3 | Mehmet Gür | Completed |
| PB11 | System extracts basic visual attributes (object type, dominant color) from photos. | Should | 5 | Zehra Atalay | Completed |
| PB12 | System computes similarity scores across lost/found items using text and image analysis. | Should | 8 | Zehra Atalay | Completed |
| PB13 | System shows a ranked list of potential matches based on similarity score. | Should | 5 | Zehra Atalay | Completed |
| PB14 | System provides brief match explanations (e.g., color/category/description overlap). | Should | 5 | Zehra Atalay | Completed |
| PB18 | Basic privacy and authorization (own-post edit/delete, admin-only moderation). | Must | 3 | Alp Eren Köksal | Completed |
| PB21 | Automated backend test suite covering auth, items, moderation, middleware, routes, and models. | Should | 8 | Yiğit Yıldız | Completed |
| PB23 | Model unit tests and AI matching test suite using MATCHING_MODE=stub. | Should | 5 | Alp Eren Köksal | Completed |

**Total: 45 SP**

---

## Task Breakdown

### AI Matching Backend — Zehra Atalay (Development Team / Scrum Master)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Implement AI matching algorithm: text embedding using Xenova/all-MiniLM-L6-v2 for description vectorization | PB11, PB12 | added AI matching algorithm and related backend endpoints |
| Implement perceptual image hashing using sharp for basic visual attribute extraction (dominant features, object similarity) | PB11 | added AI matching algorithm and related backend endpoints |
| Implement two-stage similarity scoring: text cosine similarity (50%), category match (25%), location match (15%), recency factor (10%) | PB12 | added AI matching algorithm and related backend endpoints |
| Blend image hash comparison into the final score as a second-stage refinement | PB12 | added AI matching algorithm and related backend endpoints |
| Implement GET /api/items/:id/matches route returning top-N ranked match list with itemId, score, and reasons array | PB13, PB14 | added AI matching algorithm and related backend endpoints |
| Implement match explanation generation: reason tags based on category overlap, description similarity, color or visual similarity | PB14 | added AI matching algorithm and related backend endpoints |
| Apply Strategy Pattern to make scorer strategies swappable and Chain of Responsibility to sequence scoring stages | PB12 | added AI matching algorithm and related backend endpoints |
| Add MATCHING_MODE=stub environment variable for deterministic AI behavior in tests without running real embedding model | PB12 | added AI matching algorithm and related backend endpoints |
| Add safe ENOENT fallback: prevent match failures when an image file has been deleted | PB12 | added AI matching algorithm and related backend endpoints |
| Merge ai-matching feature branch into main without introducing package-lock.json conflicts | PB12 | merge ai-matching without package-lock changes |
| Update design document with AI matching design pattern decisions and UML diagrams for Strategy and Chain of Responsibility | -- | updated design-document.md with design pattern decisions and UML diagrams |
| Add design patterns reference document (Word format) to repository | -- | added design-patterns word file |

### Backend Documentation and Alignment — Mehmet Gür (Development Team)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Align all project documentation with the current backend structure and route contracts | PB9, PB10 | docs: align project documents with current backend flow |
| Update frontend team guide and full-stack developer workflow documentation | -- | docs: update frontend guide, readme, and full-stack dev workflow |

### Frontend AI Integration — Elif Beyza Turan (Development Team)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Add AI Possible Matches section to DetailPage: fetch GET /api/items/:id/matches on load, show Spinner while loading, render results list or empty fallback | PB13 | add AI possible matches section to DetailPage |
| Build MatchCard component: item thumbnail, type and status badges, item title, clickable navigation to matched item detail page | PB13 | add AI possible matches section to DetailPage |
| Build MatchScore component: horizontal progress bar color-coded by score threshold (green >= 70%, amber >= 40%, gray otherwise) and percentage label | PB13 | add AI possible matches section to DetailPage |
| Display match reasons as small monospace tag chips inside each MatchCard | PB14 | add AI possible matches section to DetailPage |
| Handle AI match fetch failure gracefully: show empty state and not crash when request fails | PB13 | add AI possible matches section to DetailPage |

### Private Item Support — Alp Eren Köksal (Development Team)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Add isPrivate boolean column to items table via database migration | PB18 | feat(items): add isPrivate boolean field to support blured private listings |
| Update item service layer to accept, validate, and persist isPrivate flag from request payload | PB18 | feat(items): add isPrivate boolean field to support blured private listings |
| Update item model to include isPrivate in all item response payloads | PB18 | feat(items): add isPrivate boolean field to support blured private listings |
| Add image blur rendering for private items in DetailPage and SearchPage ItemCards for non-owner and non-admin users | PB18 | feat: Add private item support and fix layout alignment |
| Fix layout alignment issues across pages | -- | feat: Add private item support and fix layout alignment |

### Backend Test Suite — Yiğit Yıldız (Development Team / Product Owner)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Set up Jest test configuration, coverage tooling, and npm test scripts | -- | Add comprehensive backend test suite and coverage tooling |
| Add auth service unit tests: register validation, email uniqueness, password hashing, login credential checks, getCurrentUser, toPublicUser | PB1 | Add comprehensive backend test suite and coverage tooling |
| Add items service unit tests: createItem validation, itemType enforcement, imagePath handling, isPrivate parsing, searchItems pagination, updateItemStatus transitions, updateItem, deleteItem ownership | PB2–PB7, PB10, PB18 | Add comprehensive backend test suite and coverage tooling |
| Add moderation service unit tests | PB9 | Add comprehensive backend test suite and coverage tooling |
| Add requireAuth and requireAdmin middleware unit tests | PB1, PB9 | Add comprehensive backend test suite and coverage tooling |
| Add API route integration tests: auth, items, search, status, moderation endpoints with supertest | PB1–PB10 | Add comprehensive backend test suite and coverage tooling |
| Fix items service test for isPrivate payload type mismatch after Alp Eren Köksal's field addition | PB18 | Fix items service test for isPrivate payload |
| Add unit tests for remaining backend services: upload, session store, db, app-error, migrate, env services | -- | Add tests for remaining backend services |
| Add upload config and route error-path test coverage | PB4 | test: add upload config and route error-path coverage |
| Add six targeted edge-case scenarios across service and route tests | -- | test: add six targeted edge-case scenarios |

### Model and AI Test Suite — Alp Eren Köksal (Development Team)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Add unit tests for item model, user model, and moderation action model | PB1–PB10 | test(models): add unit tests for item, user, and moderation action models |
| Set up frontend JSDOM test environment and add initial frontend component test stubs | PB1–PB8 | test: implement frontend JSDOM and backend AI matching test suites |
| Add backend AI matching test suite using MATCHING_MODE=stub for deterministic behavior | PB11–PB14 | test: implement frontend JSDOM and backend AI matching test suites |

### Architecture and Design Documentation — Yiğit Yıldız (Product Owner / Development Team)

| Task | Status |
|---|---|
| Write architecture selection document: layered monolith rationale, alternative evaluation (microservices, event-driven), extraction candidates | Completed |
| Write Assignment 2 design document: system overview, layered component structure, interface input/output parameter definitions, design decisions, use case support | Completed |
| Write requirements-to-product-backlog transition document: FR/NFR to PB mapping, agile refinement policy | Completed |
| Write initial phase design document: high-level architecture and component interfaces | Completed |
| Write UML representation document | Completed |

### Quality Assurance Plan — Alp Eren Köksal (Development Team)

| Task | Status |
|---|---|
| Write Quality Assurance plan: QA strategy overview, quality factors and metrics table, test plan with at least 5 detailed test scenarios (TC-01 to TC-06), bug tracking workflow | Completed |

### Scrum Master Activities — Zehra Atalay

| Task | Status |
|---|---|
| Facilitate sprint planning: confirm sprint goal, backlog selection, and team assignments across three parallel workstreams | Completed |
| Coordinate AI matching branch integration review before merge into main | Completed |
| Track sprint progress for AI pipeline, test suite, and documentation workstreams | Completed |
| Risk review: AI model download latency, package-lock merge conflicts, test isolation issues | Completed |
| Coordinate Assignment 2 document review before submission | Completed |
| Contribute quality factors performance row and test methodologies section to QA plan | Completed |
| Facilitate sprint review and retrospective | Completed |

### Product Owner Activities — Yiğit Yıldız

| Task | Status |
|---|---|
| Refine AI-related backlog items (PB11–PB14): confirm acceptance criteria for match ranking and explanation format | Completed |
| Verify PB18 (isPrivate) meets authorization and privacy acceptance criteria | Completed |
| Verify delivered AI matching results match the ranked list and reason explanation requirements | Completed |
| Update requirements traceability for all Sprint 2 items | Completed |

---

## Definition of Done

A backlog item is considered done when:

- The backend route(s) for the feature exist and return correct responses.
- The frontend page or component renders the feature correctly.
- Authorization rules are enforced where applicable.
- Automated tests cover the core behavior of the item.
- The feature works in at least one target browser (Chrome).
- No known blocking bugs remain for the item.
- The Product Owner (Yiğit Yıldız) has confirmed the item meets the acceptance criteria for the linked FR/NFR.

---

## Sprint Review

### Completed Items

All 7 planned backlog items (PB9, PB10, PB11–PB14, PB18) were completed. Total velocity: 32 SP.

### Key Outcomes

- Zehra Atalay (Development Team / Scrum Master) delivered the complete AI matching pipeline as an isolated feature branch: Xenova text embeddings, perceptual image hashing, two-stage scoring, ranked results with explanation reasons, and the GET /api/items/:id/matches route. Strategy Pattern and Chain of Responsibility pattern decisions were documented and reflected in the updated design document with UML diagrams.
- Alp Eren Köksal (Development Team) added the isPrivate field across database, service, and model layers and applied blur rendering for private items in the UI. Model unit tests and the initial frontend JSDOM test environment were also delivered.
- Elif Beyza Turan (Development Team) integrated the AI Possible Matches section into DetailPage: MatchCard, MatchScore, and reason tag components.
- Yiğit Yıldız (Product Owner / Development Team) built the comprehensive backend automated test suite from scratch and produced all Assignment 2 architecture and design documents.
- Alp Eren Köksal (Development Team) wrote the Quality Assurance plan covering QA strategy, quality factors, test scenarios, and bug tracking workflow.
- Zehra Atalay (Scrum Master) coordinated the AI branch integration, tracked the sprint across three parallel workstreams, and contributed to the QA plan.
- Mehmet Gür (Development Team) aligned backend documentation with the implemented structure and updated developer workflow guides.
- Yiğit Yıldız (Product Owner) confirmed all Sprint 2 items meet their acceptance criteria and updated traceability.

### Issues Encountered

| Issue | Resolution |
|---|---|
| Merging the ai-matching branch produced package-lock.json conflicts. | Zehra Atalay performed a targeted merge that excluded package-lock changes. |
| isPrivate column was missing from the items table because the table existed before the migration that added it. | Alp Eren Köksal applied an ALTER TABLE migration to add the column to the existing table. |
| Items service test for isPrivate payload failed due to boolean type mismatch. | Yiğit Yıldız corrected the test expectation to match the actual service output. |

### Items Not Completed

None. All planned sprint items were delivered.

---

## Sprint Retrospective

### What Went Well

- Isolating the AI matching feature in its own branch before merging prevented conflicts with the main branch and allowed independent progress.
- The test suite established in this sprint gave the team high confidence in backend correctness before adding more complexity.
- Strategy Pattern and Chain of Responsibility choices for the matching pipeline made the module easy to reason about and test with stub mode.
- The QA plan document gave the team a shared understanding of test scope and quality targets.
- The Scrum Master (Zehra Atalay) successfully managed three parallel workstreams simultaneously.

### What Could Be Improved

- The isPrivate feature required coordination across backend (Alp Eren), frontend (Elif Beyza), and tests (Yigit) — communication could be more proactive to avoid the type mismatch issue.
- Frontend component tests were set up as stubs rather than full coverage. Complete component test coverage was deferred to Sprint 3.
- E2E browser tests were not yet in place. This was identified as a Sprint 3 priority.

### Action Items for Sprint 3

- Add Playwright E2E test suite covering full user and admin flows (Mehmet Gür).
- Add complete frontend page component tests (Yiğit Yıldız).
- Address all selected review feedback items: privacy hardening, AI fallback UX, CI pipeline, availability target correction (Mehmet Gür, Elif Beyza Turan, Alp Eren Köksal).
- Write Delta Design and Implementation Report for Assignment 3 (Mehmet Gür).
- Write quality factors document with traceability table (Elif Beyza Turan).
