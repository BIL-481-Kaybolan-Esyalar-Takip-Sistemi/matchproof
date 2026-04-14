# MatchProof Quality Factors

**Project Name:** MatchProof
**Course:** BIL 481
**Version:** 1.0
**Date:** 2026-04-14

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
- [Overview](#overview)
- [Quality Factors Table](#quality-factors-table)
- [Test-to-Requirement Traceability](#test-to-requirement-traceability)

---

## Document-Specific Task Matrix

| Task | Responsible | Status |
|---|---|---|
| Quality factor identification and mapping to ISO/IEC 25010 | Elif Beyza Turan | Completed |
| Quality criteria and metric definition per factor | Elif Beyza Turan | Completed |
| Target value definition per metric | Elif Beyza Turan | Completed |
| Mapping quality factors to related tests | Elif Beyza Turan | Completed |
| Mapping quality factors to FR/NFR requirements | Elif Beyza Turan | Completed |
| Test-to-requirement traceability table | Elif Beyza Turan | Completed |
| Formatting and table of contents | Elif Beyza Turan | Completed |

---

## Overview

This document defines the quality factors for the MatchProof campus lost and found platform. Each factor is described with a measurable metric, a concrete target value, the specific automated tests that verify it, and the requirements it traces to.

Quality factors are grouped by the ISO/IEC 25010 quality characteristics most relevant to this project: Performance Efficiency, Usability, Compatibility, Security, Functional Suitability (AI matching), Maintainability, and Reliability.

---

## Quality Factors Table

| Quality Factor | Quality Criteria | Metric | Target Value | Related Tests | Related Requirements |
|:---|:---|:---|:---|:---|:---|
| **Performance** | Core API operations must respond fast enough for interactive use under normal conditions. | Average response time for core API routes (ms) measured in integration test suite. | <= 2000 ms per operation under normal load | `API routes integration` > POST /api/auth/register, POST /api/auth/login, GET /api/items/search, POST /api/items, GET /api/items/:itemId, PATCH /api/items/:itemId/status; E2E full flow test | NFR1, FR1, FR2, FR5, FR7 |
| **Usability** | Users must be able to complete registration, post creation, and search flows without additional guidance. Validation errors and feedback must be visible and actionable. | Task completion success rate on critical flows; visible validation error count on invalid submit; auth feedback presence. | 100% task completion on critical UI flows; all required validation errors rendered on invalid submit | `AuthPage` > renders login form by default; calls login function on submit and navigates; displays error message if login fails. `PostFormPage` > shows validation errors for missing required fields; creates post and navigates to detail page. `SearchPage` > renders page header and default search inputs; applies draft filters when clicking Find. | NFR2, FR1, FR2, FR3, FR5 |
| **Browser Compatibility** | The application must behave consistently across modern desktop browsers (Chrome, Firefox, Edge). | Critical path smoke pass rate across target browsers in Playwright E2E. | 100% pass on all TC-01 to TC-06 flows across Chrome, Firefox, and Edge | E2E > user can register, login, create a post, search it, view matches, and update status; admin can remove a seeded post from the moderation panel | NFR3 |
| **Privacy and Access Control** | Unauthorized users must not access restricted data or protected operations. Ownership boundaries must be enforced on edit, delete, and status transitions. | Rate at which unauthorized or out-of-role requests are correctly rejected by middleware and service layer. | 100% correct rejection across all authorization tests | `requireAuth` > returns AUTH_REQUIRED when there is no session; returns AUTH_REQUIRED when session has no userId. `requireAdmin` > returns ADMIN_REQUIRED for authenticated non-admin user. `items.service` > getItemById hides removed item from non-owner/non-admin; deleteItem enforces ownership. `API routes integration` > GET /api/items/search requires authentication; GET /api/auth/me rejects unauthenticated requests. `AdminPage` > shows access denied for non-admin user. | NFR4, FR1, FR8, FR9, FR10 |
| **Matching Quality** | Similar lost and found items must be consistently ranked and presented with a brief explanation. The matching service must handle edge cases (item not found, item removed, missing image) without crashing. | False match rate on curated sample set; pass rate on deterministic matching contract tests in unit suite. | False match rate <= 20% on curated sample pairs; 100% pass on matching service unit contract tests | `matchingService AI Logic` > getMatchesForItem calculates similarity and returns descending matches; getMatchesForItem throws if item is not found; getMatchesForItem throws if item is removed; getMatchesForItem handles missing image files safely (ENOENT). `API routes integration` > GET /api/items/:itemId/matches returns item matches. `DetailPage` > renders AI matches and navigates to match detail on click; shows fallback message when AI matches are unavailable. E2E > view AI possible matches step. | FR11, FR12, FR13, FR14 |
| **Maintainability** | The codebase must support new features and bug fixes through a controlled, test-backed process. AI model components must be replaceable without major architectural changes. | Automated test coverage percentage on core modules; pass rate of full test pipeline (test:all). | Coverage >= 80% on core modules (services, middleware, models); test:all passes at 100% before every release | All backend Jest suites: `auth.service`, `items.service`, `matchingService AI Logic`, `moderation.service`, `upload.service`, `requireAuth`, `requireAdmin`, `API routes integration`, `user.model`, `item.model`, `moderation-action.model`. All frontend Jest suites: `AuthPage`, `SearchPage`, `PostFormPage`, `DetailPage`, `AdminPage`. | NFR5, FR11, FR12, FR13, FR14 |
| **Availability** | The system must remain operational for at least 95% of the planned test and demo period. Health endpoint must correctly report degraded state when the database is down. | Uptime percentage during planned test and demo window; health endpoint contract correctness. | >= 95% uptime during planned test/demo period; health endpoint returns correct status in both healthy and degraded states | `API routes integration` > GET /api/health returns ok when db is up; GET /api/health returns degraded when db is down. E2E full flow smoke test (verifies end-to-end reachability). | NFR6 |

---

## Test-to-Requirement Traceability

| Requirement | Description (short) | Covering Test File(s) |
|:---|:---|:---|
| FR1 | Register and login | `tests/server/services/auth.service.test.js`, `tests/server/routes/api.routes.integration.test.js`, `tests/client/pages/AuthPage.test.jsx`, `tests/e2e/app.e2e.spec.js` |
| FR2 | Create lost item post | `tests/server/services/items.service.test.js`, `tests/server/routes/api.routes.integration.test.js`, `tests/client/pages/PostFormPage.test.jsx`, `tests/e2e/app.e2e.spec.js` |
| FR3 | Create found item post | `tests/server/services/items.service.test.js`, `tests/client/pages/PostFormPage.test.jsx` |
| FR4 | Upload item photos | `tests/server/services/upload.service.test.js`, `tests/server/services/items.service.test.js` |
| FR5 | Keyword-based search | `tests/server/services/items.service.test.js`, `tests/server/routes/api.routes.integration.test.js`, `tests/client/pages/SearchPage.test.jsx`, `tests/e2e/app.e2e.spec.js` |
| FR6 | Filter by category and date | `tests/server/services/items.service.test.js`, `tests/client/pages/SearchPage.test.jsx` |
| FR7 | Mark item as claimed or resolved | `tests/server/services/items.service.test.js`, `tests/server/routes/api.routes.integration.test.js`, `tests/client/pages/DetailPage.test.jsx`, `tests/e2e/app.e2e.spec.js` |
| FR8 | View owner contact information | `tests/client/pages/DetailPage.test.jsx` |
| FR9 | Admin removes inappropriate posts | `tests/server/services/moderation.service.test.js`, `tests/server/routes/api.routes.integration.test.js`, `tests/client/pages/AdminPage.test.jsx`, `tests/e2e/app.e2e.spec.js` |
| FR10 | Edit or delete own posts | `tests/server/services/items.service.test.js`, `tests/server/routes/api.routes.integration.test.js`, `tests/client/pages/DetailPage.test.jsx` |
| FR11 | AI visual attribute extraction | `tests/server/services/matchingService.test.js` |
| FR12 | Similarity scoring (text + image) | `tests/server/services/matchingService.test.js`, `tests/server/routes/api.routes.integration.test.js` |
| FR13 | Ranked match list | `tests/server/services/matchingService.test.js`, `tests/client/pages/DetailPage.test.jsx`, `tests/e2e/app.e2e.spec.js` |
| FR14 | Match explanation (reasons) | `tests/server/services/matchingService.test.js`, `tests/client/pages/DetailPage.test.jsx` |
| NFR1 | Response time <= 2s | `tests/server/routes/api.routes.integration.test.js`, `tests/e2e/app.e2e.spec.js` |
| NFR2 | Usability for non-technical users | `tests/client/pages/AuthPage.test.jsx`, `tests/client/pages/PostFormPage.test.jsx`, `tests/client/pages/SearchPage.test.jsx` |
| NFR3 | Modern desktop browser support | `tests/e2e/app.e2e.spec.js` (Playwright multi-browser) |
| NFR4 | Privacy and authorization | `tests/server/middleware/require-auth.test.js`, `tests/server/middleware/require-admin.test.js`, `tests/server/services/items.service.test.js`, `tests/server/routes/api.routes.integration.test.js`, `tests/client/pages/AdminPage.test.jsx` |
| NFR5 | AI module extensibility / maintainability | `tests/server/services/matchingService.test.js` (stub-based contract), all Jest suites via test:all |
| NFR6 | >= 95% availability during test/demo | `tests/server/routes/api.routes.integration.test.js` (health endpoint), `tests/e2e/app.e2e.spec.js` |
