# Sprint 3 Plan & Review

**Project Name:** MatchProof
**Course:** BIL 481
**Sprint Number:** 3
**Sprint Duration:** 2026-03-19 – 2026-04-14 (4 weeks)
**Sprint Goal:** Address all selected review feedback items, harden privacy enforcement for sensitive item categories in both backend and frontend, add a CI pipeline for automated regression safety, complete end-to-end browser test coverage with Playwright, finalize all remaining quality and delta documentation, and deliver a fully tested and demo-ready application.

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
- [Review Feedback Items](#review-feedback-items)
- [Task Breakdown](#task-breakdown)
- [Definition of Done](#definition-of-done)
- [Sprint Review](#sprint-review)
- [Sprint Retrospective](#sprint-retrospective)

---

## Document-Specific Task Matrix

| Task | Responsible | Status |
|---|---|---|
| Sprint goal definition | Elif Beyza Turan | Completed |
| Sprint backlog and review feedback item selection | Elif Beyza Turan | Completed |
| Privacy and CI task breakdown | Elif Beyza Turan | Completed |
| E2E and test task breakdown | Elif Beyza Turan | Completed |
| Frontend test task breakdown | Elif Beyza Turan | Completed |
| Documentation and coordination task breakdown | Elif Beyza Turan | Completed |
| Definition of Done writing | Elif Beyza Turan | Completed |
| Sprint review and retrospective writing | Elif Beyza Turan | Completed |

---

## Scrum Roles

| Role | Team Member | Responsibilities in This Sprint |
|---|---|---|
| Product Owner | Yiğit Yıldız | Verifies remaining backlog items (PB15, PB16, PB19, PB20) meet acceptance criteria. Confirms all FR1–FR14 and NFR1–NFR6 are fulfilled in the final increment. Reviews architecture selection document. Oversees final requirement traceability before demo. |
| Scrum Master | Zehra Atalay | Facilitates sprint ceremonies. Coordinates review feedback selection and implementation priority. Tracks progress across privacy hardening, E2E, CI, and documentation workstreams. Manages release readiness checklist. Verifies NFR5 extensibility compliance. |
| Development Team | Mehmet Gür | Privacy hardening (backend + frontend), CI workflow, Playwright E2E suite, test fixes, delta report, frontend UI polish, documentation updates. |
| Development Team | Elif Beyza Turan | AI fallback UX integration, manual testing of all user flows, merge conflict resolution, quality factors document. |
| Development Team | Alp Eren Köksal | Private item blur for AI match thumbnails, layout alignment fixes. |
| Development Team | Yiğit Yıldız | Complete frontend page component test suite, Babel configuration for Jest JSX support, architecture selection document refinement. |
| Development Team | Zehra Atalay | QA plan update, release/deploy coordination, AI extensibility verification. Also acts as Scrum Master. |

---

## Sprint Overview

| Item | Value |
|---|---|
| Sprint Number | 3 |
| Start Date | 2026-03-19 |
| End Date | 2026-04-14 |
| Total Planned Story Points | 11 SP (remaining backlog) + 5 review-driven improvements |
| Sprint Goal | All review feedback addressed; sensitive category privacy enforced in backend and frontend; CI pipeline running; Playwright E2E suite complete; all delta and quality documents finalized; application is demo-ready |

---

## Sprint Backlog

Remaining product backlog items completed in this sprint:

| PB-ID | Backlog Item | Priority | SP | Development Owner | Status |
|---|---|---|---|---|---|
| PB15 | Response time under 2 seconds for normal actions (browse/search/post). | Must | 3 | Mehmet Gür | Completed |
| PB16 | Usability pass for non-technical users (core flows + error states). | Should | 3 | Elif Beyza Turan | Completed |
| PB19 | AI module is extensible (swap/upgrade models without major rewrites). | Could | 3 | Zehra Atalay | Completed |
| PB20 | Basic availability target (deployment + simple monitoring/checklist). | Could | 2 | Mehmet Gür | Completed |
| PB22 | Automated frontend component test suite covering all page components with JSDOM. | Should | 5 | Yiğit Yıldız | Completed |

**Total: 16 SP**

---

## Review Feedback Items

The following improvements were selected from the external review (Weak Accept verdict) and implemented in this sprint. Items not selected were explicitly deferred.

| Review Feedback | Selected | Owner | Justification |
|---|---|---|---|
| Privacy concern on visible contact details | Yes | Mehmet Gür | Low effort, high demo relevance. Scope contact output to ownerContact name + email only. |
| Sensitive image handling for private/special items | Yes | Mehmet Gür, Alp Eren Köksal | Directly improves demo credibility for ID card scenario. Force ID Card to private and blur images. |
| AI fallback behavior is unclear | Yes | Mehmet Gür, Elif Beyza Turan | Small frontend change removes misleading UX. Show explicit fallback message on AI failure. |
| No CI pipeline | Yes | Mehmet Gür | Low effort, high confidence gain. Add GitHub Actions workflow for test:unit. |
| Availability requirement is unrealistic (99% uptime) | Yes | Mehmet Gür | Documentation correction. Update NFR6 to >= 95% for test/demo period. |
| Password reset flow is missing | No | -- | Deferred: not required for demo scenario. |
| Malware scanning for uploads | No | -- | Deferred: high infrastructure effort. |
| Full production AI deployment plan | No | -- | Deferred: out of course scope. |
| Database backup and data deletion policy | No | -- | Deferred: exceeds remaining sprint capacity. |

---

## Task Breakdown

### Privacy Hardening and CI — Mehmet Gür (Development Team)

| Task | Linked PB / Review Item | Commit Reference |
|---|---|---|
| Add centralized backend privacy helper (src/server/services/item-privacy.js): enforce sensitive-category privacy rules at service layer | PB18 hardening, review: sensitive image handling | feat: add privacy improvements, CI workflow, and delta design report |
| Force ID Card category posts to isPrivate=true in backend service layer regardless of client input | review: sensitive image handling | feat: add privacy improvements, CI workflow, and delta design report |
| Add centralized frontend privacy helper (src/client/services/itemPrivacy.js): centralize UI privacy decisions and blur logic | review: sensitive image handling | feat: add privacy improvements, CI workflow, and delta design report |
| Force ID Card category to isPrivate in PostFormPage UI so users cannot uncheck privacy for sensitive posts | review: sensitive image handling | feat: add privacy improvements, CI workflow, and delta design report |
| Standardize item detail API response: expose ownerContact with name and email only, no extra contact channels | review: contact privacy | feat: add privacy improvements, CI workflow, and delta design report |
| Update NFR6 availability target from 99% to >= 95% during planned test and demo period across all documentation | review: availability target | feat: add privacy improvements, CI workflow, and delta design report |
| Add GitHub Actions CI workflow (.github/workflows/ci.yml): run npm ci and npm run test:unit on push and pull request events | review: no CI pipeline | feat: add privacy improvements, CI workflow, and delta design report |
| Write Delta Design and Implementation Report (Assignment 3): review feedback analysis, selected improvements, effort estimation, architecture impact, and testing summary | -- | feat: add privacy improvements, CI workflow, and delta design report |
| Update README and full-stack developer workflow documentation with final setup and run instructions | -- | docs: update frontend guide, readme, and full-stack dev workflow |
| Add review documents to repository | -- | docs: add reviews, docs: add matchproof review |
| Update QA plan: align quality metrics and availability target with final NFR6 correction | -- | Update 02-quality-assurance-plan.md |
| Replace placeholder deployment diagram with actual deployment diagram image in test report | -- | Replace deployment diagram with an image |
| Apply final frontend UI improvements and polish across pages | PB16 | feat: improvement frontend UI |

### AI Fallback UX and Manual Testing — Elif Beyza Turan (Development Team)

| Task | Linked PB / Review Item | Commit Reference |
|---|---|---|
| Integrate explicit AI fallback message in DetailPage: distinguish AI service failure from empty match result, show dedicated fallback message instead of generic empty state | review: AI fallback unclear | coordinated with feat: add privacy improvements commit |
| Manual end-to-end testing of all core user flows: register, login, lost item post creation, found item post creation, keyword search, category filter, status filter, detail view, status transitions (open to claimed to resolved) | PB15, PB16 | -- |
| Manual testing of admin moderation flow: remove post with reason, verify removed badge appears and post is hidden from search | PB9 | -- |
| Manual testing of private item behavior: ID Card forced private in form, image blur for non-owner and non-admin viewers in SearchPage and DetailPage | review: sensitive image handling | -- |
| Manual testing of AI fallback message: simulate AI unavailability and verify explicit message is shown | review: AI fallback unclear | -- |
| Resolve merge conflicts after remote pull: accept remote package-lock.json, remove local-only docs/versions directory that was deleted on remote | -- | merge: resolve conflicts after pull |
| Remove local docs/versions directory from repository | -- | Delete docs/versions directory |
| Write quality factors document (docs/assignment-3/02-quality-factors.md): 7 quality factors with criteria, metrics, target values, related tests, and full FR/NFR traceability table | -- | add quality factors document with metrics, targets, and traceability table |

### Private Item Blur for AI Matches — Alp Eren Köksal (Development Team)

| Task | Linked PB / Review Item | Commit Reference |
|---|---|---|
| Add isPrivate field to match payload responses so the frontend can blur private match thumbnails | review: sensitive image handling | feat: Add private item support and fix layout alignment |
| Apply image blur rendering to private item thumbnails inside MatchCard component for non-owner and non-admin users | review: sensitive image handling | feat: Add private item support and fix layout alignment |
| Fix layout alignment issues in SearchPage, DetailPage, and AdminPage | PB16 | feat: Add private item support and fix layout alignment |

### Playwright E2E Test Suite — Mehmet Gür (Development Team)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Add Playwright configuration (playwright.config.cjs) and E2E npm scripts (test:e2e, test:all) | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Write E2E Flow 1: register → login → create lost item post → search → open detail → view AI possible matches → mark claimed → mark resolved | PB1–PB7, PB13 | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Write E2E Flow 2: admin login → open moderation panel → remove seeded post with reason → verify removed state | PB9 | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add E2E seed script (scripts/e2e/reset-and-seed.js): admin user, normal user, open fixtures, removed fixture, moderation target fixture | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add E2E backend startup script (scripts/e2e/start-backend.js) for deterministic E2E environment initialization | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add pg-mem in-memory database support to db service and session store service for test and E2E mode | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add MATCHING_MODE=stub support to matching service for deterministic AI results in E2E tests | PB13, PB14 | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add reusable migration execution with optional pool reuse to support E2E database initialization flow | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Fix route integration tests: align error codes with actual backend contracts (NOT_ITEM_OWNER → ITEM_OWNERSHIP_REQUIRED, MODERATION_REASON_REQUIRED → INVALID_REASON) | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add GET /api/items/:id/matches route-level test with matching service mock | PB13 | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add explicit matchingService mock to items service test suite to keep service tests isolated from AI logic | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add scoped console.error spy/mute for route integration suite to suppress noisy expected-error output | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Add stable data-testid attributes and aria-labels to all page components for reliable E2E selectors | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Write complete test report (docs/test/01-test-report.md): configuration, test inputs and seed data, results table, fixed issues table T-01 to T-15, deployment diagram | -- | test: add Playwright E2E suite, fix backend/frontend test issues, and update QA/test reports |
| Fix frontend test virtual dependency masking: remove virtual mocks so missing real modules surface as real errors | -- | fix: align tests with backend contracts and real frontend deps |

### Frontend Component Test Suite — Yiğit Yıldız (Development Team / Product Owner)

| Task | Linked PB | Commit Reference |
|---|---|---|
| Add Babel configuration (babel.config.cjs) with @babel/preset-react and @babel/preset-env for JSX transformation in Jest | -- | Add comprehensive frontend page tests and Babel config |
| Write AuthPage tests: renders login form by default, switches to register form on tab click, calls login on submit and navigates, displays error on login failure | PB1 | Add comprehensive frontend page tests and Babel config |
| Write SearchPage tests: renders header and default inputs, displays fetched items on load, navigates to item detail on card click, handles API failure gracefully, applies draft filters on Find click, loads next page on pagination click | PB5, PB6 | Add comprehensive frontend page tests and Babel config |
| Write PostFormPage tests: shows validation errors for missing required fields, creates post and navigates to detail page, forces private mode for ID Card category in form, loads item in edit mode and saves changes | PB2, PB3, PB4, PB10 | Add comprehensive frontend page tests and Babel config |
| Write DetailPage tests: renders error alert on item fetch failure, owner can mark item as claimed, admin removal requires reason and then removes post, renders AI matches and navigates to match detail on click, shows fallback message when AI matches are unavailable | PB7, PB9, PB13, PB14 | Add comprehensive frontend page tests and Babel config |
| Write AdminPage tests: shows access denied alert for non-admin user, loads and displays moderation items for admin, prevents removal without reason, removes post with reason and refreshes list | PB9 | Add comprehensive frontend page tests and Babel config |

### Architecture Documentation — Yiğit Yıldız (Product Owner / Development Team)

| Task | Status |
|---|---|
| Refine architecture selection document: update rationale, layer descriptions, and extraction candidate list for final submission | Completed |

### Scrum Master Activities — Zehra Atalay

| Task | Status |
|---|---|
| Facilitate sprint planning: confirm sprint goal, review feedback selection, and team assignments across four parallel workstreams | Completed |
| Coordinate review feedback analysis and improvement prioritization with the team | Completed |
| Track sprint progress across privacy hardening, CI, E2E, frontend tests, and documentation workstreams | Completed |
| Risk review: demo stability, E2E determinism, CI green status before demo | Completed |
| Coordinate release/deploy readiness checklist before demo | Completed |
| Verify AI module extensibility (MATCHING_MODE=stub, Strategy Pattern) satisfies NFR5 | Completed |
| Update QA plan to reflect final test strategy including E2E layer and CI gate | Completed |
| Facilitate sprint review and retrospective | Completed |

### Product Owner Activities — Yiğit Yıldız

| Task | Status |
|---|---|
| Verify PB15 (response time) meets NFR1 target: confirm all API routes respond within 2 seconds in normal test conditions | Completed |
| Verify PB16 (usability pass) meets NFR2: confirm all critical flows complete without assistance in manual testing | Completed |
| Verify PB19 (AI extensibility) meets NFR5: confirm MATCHING_MODE=stub and Strategy Pattern enable model swap without major rewrites | Completed |
| Verify PB20 (availability) meets updated NFR6: confirm >= 95% target is documented and health endpoint contract is tested | Completed |
| Confirm all FR1–FR14 and NFR1–NFR6 requirements are fulfilled in the final increment | Completed |
| Final traceability check: all PB1–PB20 items traced to their FR/NFR and marked complete | Completed |

---

## Definition of Done

A backlog item or review-driven improvement is considered done when:

- The implementation is merged to the main branch.
- All automated tests (unit + integration + component + E2E) pass on the relevant commit.
- The CI pipeline runs green.
- Manual verification has been performed for all user-facing changes.
- Documentation and quality metric tables are updated to reflect the change.
- No known blocking bugs remain.
- The Product Owner (Yiğit Yıldız) has confirmed the item meets the acceptance criteria.

---

## Sprint Review

### Completed Items

All 4 remaining backlog items (PB15, PB16, PB19, PB20) were completed. All 5 selected review-driven improvements were implemented. Total: 11 SP + 5 improvements.

### Key Outcomes

- Mehmet Gür (Development Team) delivered all privacy hardening: forced private mode for ID Card posts in the backend service layer, centralized privacy helpers in both backend and frontend, contact information scoped to name and email, explicit AI fallback UX, GitHub Actions CI workflow running test:unit on every push, and the complete Delta Design and Implementation Report for Assignment 3. The full Playwright E2E test suite with two complete flows (full user journey and admin moderation) was also delivered, along with resolution of all outstanding test contract issues and the complete test report.
- Alp Eren Köksal (Development Team) applied private item blur to AI match card thumbnails by adding isPrivate to match payloads and fixed layout alignment across all pages.
- Elif Beyza Turan (Development Team) integrated the explicit AI fallback message into DetailPage, performed systematic manual testing of all core user and admin flows, resolved merge conflicts caused by a remote pull, and produced the quality factors document with full FR/NFR traceability.
- Yiğit Yıldız (Product Owner / Development Team) delivered the complete frontend page component test suite for all five pages and the Babel configuration required for JSX in Jest. The architecture selection document was also refined for final submission.
- Zehra Atalay (Scrum Master / Development Team) coordinated the sprint across four parallel workstreams, managed the review feedback selection, performed the release readiness check, verified NFR5 extensibility compliance, and updated the QA plan to reflect the final test strategy including E2E and CI.
- Yiğit Yıldız (Product Owner) confirmed all PB1–PB20 items and all FR/NFR requirements are fulfilled in the final increment.

### Issues Encountered

| Issue | Resolution |
|---|---|
| package-lock.json and docs/versions conflicts arose after a remote team member pushed changes during Elif Beyza Turan's local sprint work. | Elif Beyza Turan accepted the remote package-lock.json and removed the local docs/versions directory that had already been deleted on remote. |
| Some frontend tests were masking missing real modules through virtual mocks, producing false-positive test results. | Mehmet Gür removed virtual dependency masking so missing frontend modules surface as real errors during test runs. |
| Route integration tests produced noisy console.error output during expected error-path scenarios. | A scoped console.error spy was added to suppress expected error output in the integration suite. |
| AI service failure was indistinguishable from an empty match result in the UI, misleading users. | Mehmet Gür added the explicit backend fallback contract and Elif Beyza Turan integrated the distinct fallback message in DetailPage. |

### Items Not Completed

The following items were explicitly deferred and are not considered sprint failures:

| Deferred Item | Reason |
|---|---|
| Password reset flow | Not required for the selected demo scenario. Effort exceeds remaining sprint capacity. |
| Malware scanning for uploads | High infrastructure effort relative to remaining time. Deferred as future work. |
| Full production AI deployment plan | Would require model hosting infrastructure beyond course scope. |
| Database backup and data deletion policy | Exceeds remaining implementation scope for the course project. |

### Final Project Status

At sprint end, all quality gates were confirmed by the Product Owner:

| Gate | Status |
|---|---|
| All FR1–FR14 implemented and functional | Met |
| All NFR1–NFR6 documented with measurable targets | Met |
| Backend unit and integration tests passing | Met |
| Frontend component tests passing | Met |
| Playwright E2E browser tests passing | Met |
| CI workflow running green on push | Met |
| Privacy rules enforced in backend and frontend | Met |
| Delta Design and Implementation Report submitted | Met |
| Test report with T-01 to T-15 fixed issues documented | Met |
| Quality factors document with traceability table | Met |

---

## Sprint Retrospective

### What Went Well

- The CI pipeline addition gave the team automated regression safety before every merge, significantly increasing demo confidence.
- Playwright E2E tests using stub AI mode and pg-mem proved deterministic and fast — no test flakiness was observed.
- Separating the explicit AI fallback message from the empty match state was a small frontend change with high UX impact and directly answered a review criticism.
- Manual testing by Elif Beyza Turan remained essential throughout Sprint 3 for UI-level validation, especially for privacy behavior and fallback states that automated tests only partially cover.
- The Scrum Master (Zehra Atalay) successfully managed four parallel workstreams without major coordination failures.
- The Product Owner (Yiğit Yıldız) performed a final traceability check that confirmed all requirements were met before the demo.

### What Could Be Improved

- Merge conflicts caused by unsynchronized remote pushes added unplanned work for Elif Beyza Turan. A clearer team policy on push coordination would prevent this.
- Some test fixes (error code alignment, console noise suppression) could have been caught earlier if route contract documentation had been maintained more actively during Sprint 1 and 2.

### Final Notes

The MatchProof project was delivered with all 20 product backlog items completed, all FR1–FR14 functional requirements implemented, all NFR1–NFR6 non-functional requirements documented and verified, and a complete three-layer automated test suite (backend Jest, frontend Jest, Playwright E2E) in place. The CI pipeline ensures regression safety beyond the course period. All review feedback items selected for implementation were delivered within sprint scope.
