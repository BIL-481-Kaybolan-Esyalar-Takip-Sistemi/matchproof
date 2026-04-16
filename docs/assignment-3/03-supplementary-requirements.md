# Supplementary Requirements

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

## Document-Specific Task Matrix

| Task | Responsible | Status |
|---|---|---|
| Project purpose definition (1.1) | Alp Eren Köksal | Completed |
| Project scope definition (1.2) | Alp Eren Köksal | Completed |
| Document overview table (1.5) | Alp Eren Köksal | Completed |
| Definitions, Acronyms, and Abbreviations tables | Elif Beyza Turan | Completed |
| References section | Elif Beyza Turan | Completed |
| Detailed performance requirements | Elif Beyza Turan | Completed |
| Security requirements expansion | Elif Beyza Turan | Completed |
| Data collection specification | Elif Beyza Turan | Completed |
| Societal benefits section | Elif Beyza Turan | Completed |
| Legal and ethical compliance section | Elif Beyza Turan | Completed |
| Formatting and table of contents | Elif Beyza Turan | Completed |

---

## Table of Contents
- [1.1 Project Purpose](#11-project-purpose)
- [1.2 Project Scope](#12-project-scope)
- [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
- [1.4 References](#14-references)
- [1.5 Overview](#15-overview)
- [2.1 Product Perspective](#21-product-perspective)
- [2.2 Product Functions](#22-product-functions)
- [3.3 Detailed Performance Requirements](#33-detailed-performance-requirements)
- [3.5.3 Security Requirements](#353-security-requirements)
- [4.2 Data Collection Specification](#42-data-collection-specification)
- [9.1 Societal Benefits](#91-societal-benefits)
- [9.3 Legal and Ethical Compliance](#93-legal-and-ethical-compliance)

---

## 1.1 Project Purpose

MatchProof is a campus-focused digital lost and found platform that enables students and staff to post, search, and recover lost belongings through a structured web interface. The platform applies AI-assisted similarity matching to increase item recovery probability and provides an auditable content moderation capability for campus administrators.

The **Assignment 3 delta phase** builds on the Assignment 2 design baseline by implementing a targeted set of improvements identified during the peer review process:

- **Privacy hardening:** Sensitive item categories (ID Card) are automatically marked private; their images are blurred for non-owner and non-admin viewers across all views.
- **AI fallback UX:** When the AI matching service is unavailable, an explicit fallback message is shown instead of a misleading empty state.
- **Contact information scope:** Owner contact data is restricted to name and email only; no additional contact channels are added.
- **CI pipeline:** A GitHub Actions workflow runs the automated unit and component test suite on every push and pull request.
- **Availability requirement correction:** NFR6 updated from an unrealistic 99% target to a defensible 95% target for planned test and demo periods.

The purpose of this document set is to record these improvements, their design rationale, quality impact, and verification approach in a form suitable for academic review and demonstration.

---

## 1.2 Project Scope

### In Scope for Assignment 3 (Delta)

| # | Improvement | Justification |
|---|---|---|
| 1 | Automatic privacy enforcement for "ID Card" category posts (server-side) | Addresses review privacy concern; low effort, high demo value |
| 2 | Photo blurring for private items in detail and AI match card views | Directly improves demo scenario for sensitive item handling |
| 3 | Explicit AI unavailability fallback message on item detail page | Removes misleading UX; small frontend change |
| 4 | Contact information restricted to name + email only | Balances usability and privacy without removing handoff capability |
| 5 | GitHub Actions CI workflow for automated test execution | Low effort; directly answers review's CI absence concern |
| 6 | NFR6 availability target corrected to ≥ 95% during test/demo period | Documentation correction; improves requirement defensibility |

### Out of Scope for Assignment 3

- Password reset and account recovery flow
- Malware or virus scanning for uploaded files
- Full production AI inference deployment plan (cloud hosting, model versioning)
- Automated database backup and data deletion policy
- In-app messaging, push notifications, or SMS alerts
- Mobile application or progressive web app (PWA)
- Formal WCAG accessibility audit

---

## 1.3 Definitions, Acronyms, and Abbreviations

### Definitions

| Term | Definition |
|---|---|
| Lost item | An item reported by a user as no longer in their possession, submitted through a lost item post on the platform. |
| Found item | An item reported by a user as discovered without a known owner, submitted through a found item post on the platform. |
| Match | A lost item and a found item pair that the system identifies as potentially the same object based on similarity scoring. |
| Similarity score | A numeric value between 0 and 1 computed by the AI matching pipeline that represents the likelihood that a lost item and a found item refer to the same object. |
| Match explanation | A brief, human-readable label (reason tag) generated by the system to explain why two items were considered similar (for example: same category, similar description, similar color). |
| Item status | The lifecycle state of a post, which progresses from open to claimed to resolved. |
| Moderation | The administrative action of removing an inappropriate or duplicate item post from the platform. |
| Private item | An item post marked by the user as private, causing the item photo to be blurred for non-owner, non-admin viewers. |
| Session | A server-side authenticated context established after login and maintained using a session cookie backed by a PostgreSQL session store. |
| Embedding | A fixed-length numerical vector representation of a text string, produced by the Xenova/all-MiniLM-L6-v2 transformer model, used to compute semantic similarity between item descriptions. |
| Perceptual hash | A compact fingerprint of an image computed by the sharp library, used to measure visual similarity between item photos independent of resolution or minor edits. |
| Stub mode | A deterministic operating mode for the AI matching pipeline activated by setting the MATCHING_MODE environment variable to "stub", used during automated testing to produce predictable results without running the real embedding model. |

### Acronyms

| Acronym | Expansion |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| E2E | End-to-End |
| FR | Functional Requirement |
| HTTP | Hypertext Transfer Protocol |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MVC | Model-View-Controller |
| MVP | Minimum Viable Product |
| NFR | Non-Functional Requirement |
| ORM | Object-Relational Mapping |
| PB | Product Backlog item |
| QA | Quality Assurance |
| REST | Representational State Transfer |
| SP | Story Point |
| SQL | Structured Query Language |
| SRS | Software Requirements Specification |
| UI | User Interface |
| URL | Uniform Resource Locator |
| UX | User Experience |

### Abbreviations

| Abbreviation | Meaning |
|---|---|
| Auth | Authentication or Authorization (context-dependent) |
| Config | Configuration |
| DB | Database |
| Desc | Description |
| Dev | Development or Developer |
| Doc | Document or Documentation |
| Env | Environment |
| Fig | Figure |
| ID | Identifier |
| Max | Maximum |
| Min | Minimum |
| Msg | Message |
| NFR | Non-Functional Requirement (also listed under Acronyms; included here for in-code usage) |
| Req | Requirement |
| Sec | Section or Security (context-dependent) |
| Spec | Specification |
| Std | Standard |

---

## 1.4 References

1. IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications*. IEEE, 1998.
2. ISO/IEC 25010:2011, *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models*. ISO, 2011.
3. Scrum Alliance, *The Scrum Guide*, K. Schwaber and J. Sutherland, November 2020. Available at: https://scrumguides.org
4. Xenova/all-MiniLM-L6-v2, sentence-transformers model ported to ONNX format for in-process JavaScript inference via @xenova/transformers. Available at: https://huggingface.co/Xenova/all-MiniLM-L6-v2
5. sharp, *High performance Node.js image processing library*. Available at: https://sharp.pixelplumbing.com
6. Express.js, *Fast, unopinionated, minimalist web framework for Node.js*. Available at: https://expressjs.com
7. PostgreSQL, *Open source object-relational database system*, version 14+. Available at: https://www.postgresql.org
8. Playwright, *Reliable end-to-end testing for modern web apps*, Microsoft. Available at: https://playwright.dev
9. Jest, *JavaScript testing framework*, Meta Open Source. Available at: https://jestjs.io
10. React, *A JavaScript library for building user interfaces*, version 19, Meta Open Source. Available at: https://react.dev
11. Vite, *Next generation frontend tooling*, version 5. Available at: https://vitejs.dev
12. OWASP, *OWASP Top Ten Web Application Security Risks*, 2021. Available at: https://owasp.org/www-project-top-ten/

---

## 1.5 Overview

This section summarizes the structure and content of the complete Assignment 3 documentation set. Each document covers a distinct concern; reading them together provides a full picture of the delta design, quality approach, and project context.

| Document | Title | Coverage |
|---|---|---|
| **01-delta-design-implementation-report.md** | Delta Design & Implementation Report | Review context and feedback summary, selected improvements, effort estimation, architecture impact, implemented changes, quality factor impact, testing and bugfixing summary |
| **02-quality-factors.md** | Quality Factors | ISO/IEC 25010 quality factors with measurable metrics, target values, related tests, and test-to-requirement traceability table |
| **03-supplementary-requirements.md** | Supplementary Requirements | Project purpose (1.1), project scope (1.2), definitions (1.3), references (1.4), overview (1.5), performance requirements (3.3), security requirements (3.5.3), data collection (4.2), societal benefits (9.1), legal and ethical compliance (9.3) |
| **04-risk-management.md** | Risk Management | Risk classification matrix, risk analysis and mitigation strategies (7.3) with 14 risks, risk monitoring plan |
| **05-user-stories.md** | User Stories | Target audience (8.1), 11 user stories including delta stories (8.2), acceptance criteria, FR traceability matrix |
| **06-product-acceptance-and-config-management.md** | Product Acceptance & Config Management | Configuration and change management (6.3), verification and validation approach (6.2), risk and defect management (6.4), product acceptance criteria (6.5) |

**Recommended reading order:**  
`03` (requirements context) → `01` (delta design) → `04` (risks) → `05` (user stories) → `02` (quality factors) → `06` (acceptance and config management)

---

## 2.1 Product Perspective

MatchProof is a **standalone web application** serving a single university campus community. It is not a module of a larger enterprise system and does not integrate with external institutional platforms (e.g., student information systems, campus card systems, or identity providers). All data remains within the locally operated server during the academic demonstration period.

**System context:**

```
[Campus User: Browser]
        |
        | HTTPS (localhost during demo)
        v
[MatchProof Web Server: Express.js / Node.js]
        |              |
        v              v
[PostgreSQL DB]   [Local Filesystem (image uploads)]
        |
        v
[AI Matching Module: Xenova/all-MiniLM-L6-v2 (ONNX) + sharp]
```

**Problem addressed:** Campus members currently have no centralised digital channel for reporting or searching lost and found items. Physical lost-and-found desks are underused, slow, and cannot perform similarity-based matching. MatchProof replaces this gap with a self-service, searchable, AI-assisted platform accessible from any modern desktop browser.

**Relationship to prior assignments:**
- **Assignment 1** established the project definition, requirements (FR1–FR14, NFR1–NFR6), and initial architecture.
- **Assignment 2** produced the detailed design, UML diagrams, QA plan, and product backlog.
- **Assignment 3 (this document set)** implements and documents a targeted set of delta improvements based on peer review feedback.

---

## 2.2 Product Functions

The following table summarises all product functions implemented in the current system. Functions marked **[Δ]** were added or significantly modified during the Assignment 3 delta phase.

| Function ID | Function | Description | Linked FR |
|---|---|---|---|
| PF-01 | User registration | Create an account with name, email, and bcrypt-hashed password | FR1 |
| PF-02 | User authentication | Login with email/password; maintain session; logout | FR1 |
| PF-03 | Create lost item post | Submit a lost item listing with title, category, location, description, and optional photo | FR2, FR4 |
| PF-04 | Create found item post | Submit a found item listing with the same structure | FR3, FR4 |
| PF-05 | Auto-privacy enforcement **[Δ]** | Automatically mark "ID Card" category posts as private; enforce server-side | FR4, NFR4 |
| PF-06 | Keyword search | Full-text search across item titles and descriptions | FR5 |
| PF-07 | Filter listings | Filter by category, item type (lost/found), status, and date range | FR6 |
| PF-08 | View item detail | View full item information including owner contact (name + email only) **[Δ]** | FR8 |
| PF-09 | Private image blur **[Δ]** | Blur item photos in detail and match card views for non-owner, non-admin users | FR4, NFR4 |
| PF-10 | Status lifecycle | Transition item status: Open → Claimed → Resolved | FR7 |
| PF-11 | Edit / delete own post | Post owner can update or remove their listing | FR10 |
| PF-12 | AI similarity matching | Rank candidate matches using text embedding + image perceptual hash scoring | FR11, FR12, FR13, FR14 |
| PF-13 | Match explanation | Each AI match includes human-readable reason tags | FR14 |
| PF-14 | AI fallback UX **[Δ]** | Show explicit message when AI matching service is unavailable | FR13 |
| PF-15 | Admin moderation | Admin can remove any post with a mandatory reason; moderation record created | FR9 |
| PF-16 | CI-backed test execution **[Δ]** | GitHub Actions runs `npm run test:unit` on every push and pull request | NFR5 |

---

## 3.3 Detailed Performance Requirements

NFR1 in `03-requirements.md` states that the system must respond within 2 seconds under normal operating conditions. This section defines measurable sub-requirements derived from that baseline.

| Requirement ID | Description | Target |
|---|---|---|
| PERF-01 | POST /api/auth/register must complete (including password hashing and session establishment) within the response time limit under a single-user load. | <= 2000 ms |
| PERF-02 | POST /api/auth/login must complete within the response time limit. | <= 2000 ms |
| PERF-03 | GET /api/items/search with keyword, category, date, and status filters applied must return a paginated result within the response time limit. | <= 2000 ms |
| PERF-04 | POST /api/items (item creation including image validation with sharp) must complete within the response time limit, excluding large-file upload transfer time. | <= 2000 ms |
| PERF-05 | GET /api/items/:itemId (single item detail with owner contact) must complete within the response time limit. | <= 2000 ms |
| PERF-06 | PATCH /api/items/:itemId/status (status transition) must complete within the response time limit. | <= 2000 ms |
| PERF-07 | GET /api/items/:itemId/matches (AI match retrieval in stub mode) must complete within the response time limit. | <= 2000 ms |
| PERF-08 | GET /api/health must respond within a short fixed interval regardless of database state. | <= 500 ms |
| PERF-09 | Frontend initial page load (SearchPage, AuthPage) on a localhost development server must complete within a reasonable time. | <= 3000 ms |
| PERF-10 | The system is not required to maintain the 2-second target under concurrent load from multiple simultaneous users, as the deployment scope is limited to a single-server campus demonstration environment. | Not applicable under load testing |

---

## 3.5.3 Security Requirements

NFR4 in `03-requirements.md` defines a single-sentence privacy requirement. This section expands it into specific, testable security controls aligned with OWASP Top Ten.

| Requirement ID | Description | Related NFR/FR |
|---|---|---|
| SEC-01 | All authenticated routes must reject requests that do not carry a valid server-side session cookie. The server must return a structured error response indicating that authentication is required. | NFR4, FR1 |
| SEC-02 | Admin-only routes (moderation remove) must reject requests from authenticated non-admin users. The server must return a structured error response indicating that admin access is required. | NFR4, FR9 |
| SEC-03 | Users must not be able to edit, delete, or update the status of item posts that they do not own, unless they are an admin. The service layer must enforce ownership checks independently of the route layer. | NFR4, FR10 |
| SEC-04 | Passwords must be stored as bcrypt hashes. Plaintext passwords must never be persisted or returned in any API response. | NFR4, FR1 |
| SEC-05 | User email addresses and other personally identifiable information must not be included in list-view API responses. Owner contact information must be returned only in the single-item detail response. | NFR4, FR8 |
| SEC-06 | Session cookies must be configured with the HttpOnly flag to prevent client-side script access. | NFR4 |
| SEC-07 | Uploaded files must be validated for MIME type and size before storage. Files that fail validation must be rejected and not written to disk. | NFR4, FR4 |
| SEC-08 | The system must not expose internal stack traces or database error messages in API error responses returned to the client. | NFR4 |
| SEC-09 | Cross-origin requests must be restricted to the configured client origin(s) defined in the CLIENT_ORIGIN environment variable. | NFR4 |
| SEC-10 | The SESSION_SECRET environment variable must be set to a non-empty value; the server must refuse to start if this variable is absent. | NFR4 |

---

## 4.2 Data Collection Specification

This section defines what personal and item data the MatchProof system collects, how it is used, and for how long it is retained during the planned testing and demonstration period.

### 5.1 Data Collected

| Data Category | Fields Collected | Collection Point | Purpose |
|---|---|---|---|
| User account data | Name, email address, bcrypt password hash, admin flag, account creation timestamp | Registration (POST /api/auth/register) | Authentication, session management, owner contact display |
| Session data | Session ID, user ID, session creation and expiry timestamps | Login (POST /api/auth/login) | Maintaining authenticated state across requests |
| Item post data | Title, description, category, location, item type (lost/found), status, isPrivate flag, image file path, creation and update timestamps | Item creation (POST /api/items) | Core platform functionality: search, matching, display |
| Uploaded images | Image files stored on the local server filesystem under the configured upload directory | File upload during item creation | Visual display and AI visual similarity analysis |
| Moderation action data | Moderated item ID, admin user ID, reason text, action timestamp | Admin removal (POST /api/moderation/items/:id/remove) | Audit trail for content moderation decisions |

### 5.2 Data Not Collected

The system does not collect payment information, location GPS coordinates, biometric data, in-app messages between users, or behavioral analytics. No third-party analytics or tracking scripts are included in the frontend.

### 5.3 Data Retention

Data is retained for the duration of the academic demonstration period. No automated deletion policy is enforced. The system does not implement data export or account deletion flows in the current scope (deferred as out-of-scope per `01-project-definition.md`).

### 5.4 Data Access

Item data is visible only to authenticated users. Owner contact information (name and email) is visible only in the single-item detail view, not in search or list responses. Private items have their images blurred for non-owner, non-admin users.

---

## 9.1 Societal Benefits

The MatchProof platform addresses a practical problem common to dense campus environments: the inefficiency of recovering lost belongings. The following benefits are identified for the campus community.

**Reduced loss and waste.** Centralizing lost and found reports in a searchable digital platform increases the probability that lost items are recovered by their owners. This reduces the personal cost of lost property and decreases unnecessary replacement purchases.

**Lower administrative burden.** Physical lost and found desks at campus offices require staff time to log items, field queries, and store unclaimed property. A self-service digital platform reduces this administrative overhead.

**Accessibility.** A web-based interface accessible from any modern desktop browser allows all members of the campus community to participate without installing dedicated software or visiting a physical location.

**AI-assisted matching as an accessibility feature.** Users who have lost an item may not remember precise descriptive details. The AI matching pipeline reduces the burden on users by surfacing candidate matches automatically, lowering the cognitive effort required to find a match.

**Demonstration of responsible AI use.** The project demonstrates that AI-based similarity scoring can be applied to a civic benefit use case with explainable results (match reason tags), supporting user trust and transparency rather than opaque decision-making.

**Educational and research value.** As an academic project, MatchProof serves as a concrete case study for applying software engineering practices — agile development, automated testing, design patterns, quality assurance — to a socially relevant problem domain.

---

## 9.3 Legal and Ethical Compliance

### 7.1 Personal Data and Privacy

The system collects the minimum personal data necessary for platform operation (name, email, password hash). No sensitive personal data categories are collected. During the academic demonstration period, all data is stored on a locally operated server and is not transferred to external parties.

Users are implicitly informed that their name and email will be visible to other authenticated users on item detail pages, as this is the mechanism for item recovery coordination. A future production deployment should provide an explicit privacy notice and consent mechanism in accordance with applicable data protection regulations (such as the Turkish Personal Data Protection Law, KVKK, or the EU General Data Protection Regulation, GDPR, depending on deployment jurisdiction).

### 7.2 Content Moderation

The platform includes an administrator moderation capability (FR9) allowing inappropriate or duplicate posts to be removed with a recorded reason. This provides a baseline mechanism for enforcing acceptable use. Content policy definitions and appeals processes are outside the scope of the current academic implementation.

### 7.3 Intellectual Property

All source code produced for MatchProof is original work by the project team. Third-party libraries used (Express, React, PostgreSQL, sharp, Xenova/transformers, Playwright, Jest, and others) are open-source packages used under their respective licenses (MIT, Apache 2.0, and BSD variants). The Xenova/all-MiniLM-L6-v2 model weights are distributed under the Apache 2.0 license.

### 7.4 Algorithmic Fairness

The AI matching pipeline computes similarity based on text description, category, location, recency, and image visual features. It does not use demographic data and does not make decisions that affect users' rights or welfare. Match suggestions are advisory only; final recovery coordination is left to the users involved. No fairness audit has been conducted on the model's behavior across item categories, as the system is scoped to a campus demonstration environment.

### 7.5 Accessibility

The current implementation targets modern desktop browsers and does not include a formal accessibility audit (WCAG compliance). This is an acknowledged limitation identified in the non-functional requirements. A production deployment should address keyboard navigation, screen reader compatibility, and color contrast requirements.

### 7.6 Academic Integrity

This project was developed as coursework for BIL 481 at the relevant institution. All work is attributed to the contributing team members identified in each document's contributor list and in the git commit history. Use of AI-assisted code generation tools is subject to the course's academic integrity policies.
