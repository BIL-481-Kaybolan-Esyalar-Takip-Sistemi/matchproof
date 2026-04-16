# 06 - Product Acceptance and Configuration Management (6.2 + 6.3 + 6.4 + 6.5)

**Project Name:** MatchProof  
**Course:** BIL 481  
**Version:** 1.0  
**Date:** 2026-04-16

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Alp Eren Köksal

## Table of Contents

1. Document-Specific Task Matrix
2. Configuration and Change Management (6.3)
3. Verification and Validation (6.2)
4. Risk and Defect Management (6.4)
5. Product Evaluation and Acceptance (6.5)

---

## 1. Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Configuration item list and branching model | Alp Eren Köksal | - | Completed |
| Change request process definition | Alp Eren Köksal | - | Completed |
| V&V approach, test environment, success criteria (6.2) | Alp Eren Köksal | - | Completed |
| Risk and defect management workflow (6.4) | Alp Eren Köksal | - | Completed |
| Functional acceptance criteria (AC-01–AC-09) | Alp Eren Köksal | - | Completed |
| Non-functional acceptance criteria (AC-10–AC-14) | Alp Eren Köksal | - | Completed |
| Delta acceptance criteria (AC-15–AC-17) | Alp Eren Köksal | - | Completed |
| Demo acceptance checklist | Alp Eren Köksal | - | Completed |

---

## 2. Configuration and Change Management (6.3)

### 2.1 Version Control Strategy

MatchProof uses **Git** with a GitHub-hosted repository as the single source of truth for all source code and documentation.

**Branching Model:**

| Branch | Purpose |
|---|---|
| `main` | Stable, demo-ready code. Direct commits are not permitted. |
| `develop` | Integration branch. All feature branches merge here before `main`. |
| `feature/<name>` | Short-lived branches for individual features or fixes. |
| `hotfix/<name>` | Emergency fixes applied directly on top of `main`. |

**Commit Convention:**  
All commits follow the Conventional Commits format: `<type>(<scope>): <description>`  
Examples: `feat(privacy): add server-side ID card enforcement`, `fix(matching): handle ENOENT for missing image`, `ci: add GitHub Actions workflow`

### 2.2 Configuration Items

| CI ID | Item | Location |
|---|---|---|
| CI-01 | Application source code | `src/` |
| CI-02 | Test suite | `tests/` |
| CI-03 | Assignment documentation | `docs/` |
| CI-04 | Database schema and migration scripts | `src/server/db/` |
| CI-05 | Dependency manifests | `package.json`, `package-lock.json` |
| CI-06 | Environment configuration template | `.env.example` |
| CI-07 | CI/CD pipeline definition | `.github/workflows/ci.yml` |
| CI-08 | Privacy helper modules (delta) | `src/server/services/item-privacy.js`, `src/client/services/itemPrivacy.js` |

### 2.3 Change Request Process

1. **Propose:** A team member opens a GitHub Issue describing the change, affected components, and justification.
2. **Review:** At least one other team member approves the issue before work begins.
3. **Implement:** Developer creates a `feature/` branch from `develop`, implements the change, and writes or updates tests.
4. **Pull Request:** PR opened against `develop`. Must pass `npm run test:all` and receive one approving review.
5. **Merge:** After green CI and approval, the PR is squash-merged into `develop`.
6. **Release:** When a milestone is complete, `develop` is merged into `main` with an updated version tag.

### 2.4 Versioning

Document and software versions follow **Semantic Versioning** (`MAJOR.MINOR.PATCH`):
- `MAJOR`: Breaking changes to API contracts or database schema
- `MINOR`: New features added in a backward-compatible manner
- `PATCH`: Bug fixes and documentation corrections

Current version: `1.1.0` (Assignment 3 delta baseline — privacy hardening, AI fallback UX, CI pipeline added)

---

## 3. Verification and Validation (6.2)

### 3.1 V&V Approach

MatchProof follows a three-layer V&V strategy separating fast unit-level verification from end-to-end user-scenario validation:

| Layer | Tool | Scope | Execution Trigger |
|---|---|---|---|
| **Unit & Component (Verification)** | Jest | Services, middleware, models, React components | Every PR; CI pipeline |
| **Integration (Verification)** | Jest + Supertest | Full API route contracts with real DB | Every PR; CI pipeline |
| **End-to-End (Validation)** | Playwright | Real user flows in the browser | Manual before demo; pre-release |

### 3.2 Test Environment

| Environment | Description |
|---|---|
| **Local development** | Node.js >= 18, PostgreSQL running locally, `.env` sourced from `.env.example` |
| **CI (GitHub Actions)** | `ubuntu-latest` runner, `npm ci`, test DB per workflow run |
| **Demo machine** | Local environment mirroring development; no internet dependency |

All automated tests run with `MATCHING_MODE=stub` for deterministic AI results.

### 3.3 Verification Methods

| Method | Description | When Applied |
|---|---|---|
| **Unit test** | Single function/module in isolation with mocked dependencies | Per commit, CI pipeline |
| **Integration test** | Full request-response cycle through Express routes with real DB | Per PR, CI pipeline |
| **Component test** | React component rendered output and user interactions with mocked API | Per commit, CI pipeline |
| **Code review** | Peer review required before merging any PR to `develop` | Every PR |
| **Manual smoke test** | Visual confirmation of key flows on the demo machine | Before every demo |

### 3.4 Success Criteria

A build is **verified** when:
- All Jest tests pass (`npm run test:all` exits 0)
- Core module coverage >= 80% (`npm run test:coverage`)
- CI pipeline shows green on latest `main` commit

A build is **validated** when:
- Playwright E2E suite passes on the demo machine for TC-01 through TC-06
- Demo dry run confirms AC-15, AC-16, AC-17 delta improvements are visible

---

## 4. Risk and Defect Management (6.4)

### 4.1 Defect Classification

| Severity | Criteria | Example |
|---|---|---|
| **Critical** | Blocks a core user flow or causes data loss; must be fixed before any demo | Login fails for all users; item creation crashes the server |
| **High** | Degrades a required feature significantly; must be fixed before demo | Privacy blur not applied; AI fallback message missing |
| **Medium** | Affects a secondary feature; should be fixed before submission | Filter not persisting across page reload |
| **Low** | Minor cosmetic issue or edge-case behavior | Mis-aligned button on edge resolution |

### 4.2 Defect Lifecycle

```
Open -> In Progress -> In Review -> QA Check -> Closed
```

| State | Description |
|---|---|
| **Open** | Defect reported and confirmed; not yet assigned |
| **In Progress** | Assigned developer is actively working on a fix |
| **In Review** | Fix implemented; PR opened and awaiting peer review |
| **QA Check** | Tests re-run after merge; original failure must no longer reproduce |
| **Closed** | QA confirmed fixed; issue closed in GitHub Issues |

### 4.3 Defect Tracking Process

1. **Report:** Team member opens a GitHub Issue with steps to reproduce, expected behavior, and actual behavior. Label: `bug`.
2. **Classify:** Team lead assigns severity and component label (`AI-backend`, `UI-frontend`, `auth`, `privacy`).
3. **Fix:** Developer creates a `fix/<issue-id>` branch, implements the fix, and updates or adds the covering test.
4. **Verify:** PR must pass `npm run test:all` and receive one approving review before merge.
5. **Close:** After merge and QA re-check, the GitHub Issue is closed with a reference to the fixing commit.

### 4.4 Known Defect Register (Delta Phase)

| Defect ID | Description | Severity | Status | Fixed In |
|---|---|---|---|---|
| DEF-01 | Privacy leakage risk for sensitive "ID Card" category posts | High | Closed | Delta implementation |
| DEF-02 | Contact information policy inconsistency in item detail response | Medium | Closed | Delta implementation |
| DEF-03 | Misleading AI failure shown as empty "No matches" state | Medium | Closed | Delta implementation |
| DEF-04 | No CI pipeline — regressions not automatically caught on PR | High | Closed | GitHub Actions workflow added |

---

## 5. Product Evaluation and Acceptance (6.5)

### 5.1 Acceptance Criteria Overview

A product increment is considered **accepted** when all conditions below are met. Criteria are directly traceable to functional and non-functional requirements.

### 5.2 Functional Acceptance Criteria

| AC ID | Acceptance Criterion | Linked FR | Verification Method |
|---|---|---|---|
| AC-01 | A new user can register with name, email, and password; the account persists and can be used to login | FR1 | Automated (Jest `auth.service` + integration + E2E TC-01) |
| AC-02 | An authenticated user can create a lost or found post with all required fields; the post appears in search results | FR2, FR3, FR4 | Automated (Jest `items.service` + `PostFormPage` + E2E TC-02) |
| AC-03 | Keyword search returns relevant results; category and status filters correctly narrow the result set | FR5, FR6 | Automated (Jest `items.service` + `SearchPage` + E2E TC-03) |
| AC-04 | An item detail page displays the owner's name and email to authenticated viewers only | FR8 | Automated (Jest `items.service` + `DetailPage`) |
| AC-05 | The item owner can transition status: `open → claimed → resolved`; invalid transitions are rejected | FR7 | Automated (Jest `items.service` + integration + E2E TC-05) |
| AC-06 | An admin user can remove a post with a reason; the post disappears from search and a moderation record is created | FR9 | Automated (Jest `moderation.service` + integration + `AdminPage` + E2E TC-06) |
| AC-07 | An authenticated user can edit or delete their own post; editing another user's post is forbidden (HTTP 403) | FR10 | Automated (Jest `items.service` + integration) |
| AC-08 | The AI matching module returns a ranked list of candidate items with similarity scores and reason tags | FR11, FR12, FR13, FR14 | Automated Jest `matchingService` + `DetailPage` TC-04 (stub mode) |
| AC-09 | Match reason tags include at least one human-readable explanation per candidate (e.g., "same category", "similar description") | FR14 | Automated Jest `matchingService` + manual review |

### 5.3 Delta Acceptance Criteria (Assignment 3 Improvements)

| AC ID | Acceptance Criterion | Linked Improvement | Verification Method |
|---|---|---|---|
| AC-15 | "ID Card" category posts are automatically marked private; the privacy flag cannot be overridden by the client | Privacy hardening (SEC-03, NFR4) | Automated Jest `item-privacy.service` + `items.service` |
| AC-16 | Private item images are blurred in detail view and AI match cards for non-owner, non-admin users | Privacy hardening (NFR4) | Automated `DetailPage.test.jsx` + manual visual inspection |
| AC-17 | When the AI matching service is unavailable, an explicit fallback message is displayed instead of an empty "No matches" state | AI fallback UX (FR13, FR14) | Automated `DetailPage.test.jsx` — unavailable-match fallback scenario |

### 5.4 Non-Functional Acceptance Criteria

| AC ID | Acceptance Criterion | Linked NFR | Threshold | Verification Method |
|---|---|---|---|---|
| AC-10 | Core API operations (auth, create, search, status update) respond within 2000 ms under normal single-user load | NFR1 | ≤ 2000 ms | Jest integration timing assertions |
| AC-11 | Critical user flows complete successfully on Chrome, Firefox, and Edge | NFR3 | 100% pass rate | Playwright E2E multi-browser smoke |
| AC-12 | Unauthenticated requests to protected endpoints receive HTTP 401; non-admin role requests receive HTTP 403 | NFR4 | 100% correct rejection | Jest `require-auth`, `require-admin`, integration tests |
| AC-13 | Core module test coverage is at or above 80% | NFR5 | ≥ 80% | `npm run test:coverage` report |
| AC-14 | The system is accessible and responsive during all scheduled demo and test windows | NFR6 | ≥ 95% uptime | Health endpoint test + manual demo window verification |

### 5.5 Demo Acceptance Checklist

Before the final demo, the following checklist must be completed:

- [ ] GitHub Actions CI passes on the latest `main` commit (`npm ci` + `test:unit`)
- [ ] All Jest backend unit tests pass (`npm run test:server`)
- [ ] All Jest frontend component tests pass (`npm run test:client`)
- [ ] Playwright E2E tests pass on the demo machine
- [ ] Test coverage report shows ≥ 80% on core modules
- [ ] UC1 (Register/Login) demonstrated end-to-end
- [ ] UC2 (Create Post with Photo — including ID Card auto-privacy) demonstrated
- [ ] UC3 (Search + AI Matches with explicit fallback) demonstrated
- [ ] UC4 (Claim/Resolve + Admin Moderation) demonstrated
- [ ] Private image blur verified visually on the demo machine
- [ ] No known Critical or High severity open bugs

### 5.6 Acceptance Sign-Off

The product increment is formally accepted when the demo checklist is fully completed and the project supervisor or designated evaluator confirms that the demonstrated behavior matches the requirements documented in this plan.
