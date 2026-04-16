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
| Hardware interface requirements section (3.1.2) | Elif Beyza Turan | Completed |
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
- [2.3 User Characteristics](#23-user-characteristics)
- [2.4 Constraints](#24-constraints)
- [2.5 Assumptions and Dependencies](#25-assumptions-and-dependencies)
- [3.1.1 User Interfaces](#311-user-interfaces)
- [3.1.2 Hardware Interfaces](#312-hardware-interfaces)
- [3.1.3 Software Interfaces](#313-software-interfaces)
- [3.1.4 Communication Interfaces](#314-communication-interfaces)
- [3.2 Functional Requirements](#32-functional-requirements)
- [3.3 Detailed Performance Requirements](#33-detailed-performance-requirements)
- [3.4 Design Constraints](#34-design-constraints)
- [3.5.1 Reliability Requirements](#351-reliability-requirements)
- [3.5.2 Availability Requirements](#352-availability-requirements)
- [3.5.3 Security Requirements](#353-security-requirements)
- [3.5.4 Maintainability Requirements](#354-maintainability-requirements)
- [3.5.5 Portability Requirements](#355-portability-requirements)
- [3.6 Other Requirements](#36-other-requirements)
- [4.2 Data Collection Specification](#42-data-collection-specification)
- [4.5 Data Limitations & Assumptions](#45-data-limitations--assumptions)
- [9.1 Societal Benefits](#91-societal-benefits)
- [9.2 Economic Constraints](#92-economic-constraints)
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
| **03-supplementary-requirements.md** | Supplementary Requirements | Project purpose (1.1), project scope (1.2), definitions (1.3), references (1.4), overview (1.5), hardware interfaces (3.1.2), functional traceability (3.2), performance requirements (3.3), design constraints (3.4), reliability/availability/security/maintainability/portability requirements (3.5), other cross-cutting requirements (3.6), data collection and data limitations (4.2, 4.5), societal benefits (9.1), legal and ethical compliance (9.3) |
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

## 2.3 User Characteristics

MatchProof targets three distinct user groups within a university campus environment. Their technical proficiency, usage context, and expectations differ and directly influence the interface design and access control decisions.

| User Type | Description | Technical Proficiency | Frequency of Use | Key Expectations |
|---|---|---|---|---|
| **Student / Regular User** | Any enrolled student or campus member who has lost or found an item on campus. The primary actor of all core platform flows (post, search, claim, resolve). | Low to moderate — comfortable with web form submission and basic browser navigation. Not expected to understand the AI algorithm. | Occasional — primarily during or shortly after a loss or discovery event. | Fast, intuitive item posting; clear search results; visible and actionable match suggestions; protected contact information. |
| **Administrator** | A designated campus staff member or power user responsible for content moderation and maintaining platform integrity. Has elevated privileges (`isAdmin = true` in the database). | Moderate — familiar with basic admin workflows; does not require programming knowledge. | Periodic — reviews flagged or reported posts and performs removal actions as needed. | Simple moderation interface; mandatory reason field for removal actions; audit trail of moderation decisions. |
| **Guest (Unauthenticated Visitor)** | A visitor who accesses the platform without logging in. Can browse public listings but cannot post, contact owners, or claim/resolve items. | Low — read-only browser interaction only. | Very infrequent — typically a one-time or first-visit experience before deciding to register. | Ability to see that the platform exists and what items are listed; clear prompt to register or log in to take action. |

**Common characteristics across all user types:**
- Access the platform via modern desktop browsers (Chrome, Firefox, Edge) on campus networks or home connections.
- Have limited time and expect quick, validated workflows with immediate error feedback.
- Are not expected to have knowledge of the underlying AI matching implementation.
- Expect personal data (email, name) to be handled responsibly and visible only to authenticated users in the appropriate context.
- May handle sensitive items (ID cards, wallets) and expect the system to enforce privacy controls automatically rather than relying on manual configuration.

---

## 2.4 Constraints

This section defines the technical, operational, time, performance, capacity, and environmental constraints that bound the design and implementation of MatchProof.

### 2.4.1 Technical Constraints

| Constraint ID | Category | Description |
|---|---|---|
| TC-01 | Runtime environment | The backend must run on Node.js version 18 or higher. Lower versions are not supported due to native ESM and built-in fetch API usage. |
| TC-02 | Database | PostgreSQL version 14 or higher is required. The schema uses UUID primary keys and server-side session storage (`connect-pg-simple`), which require compatible PostgreSQL extensions (`pgcrypto` or `gen_random_uuid()`). |
| TC-03 | AI matching module | The embedding model (`Xenova/all-MiniLM-L6-v2`) runs in-process via ONNX runtime. It requires the `@xenova/transformers` package and a host machine with at least 2 GB of available RAM for model loading. |
| TC-04 | Image processing | Image validation and perceptual hashing depend on the `sharp` library, which requires a native binary compatible with the host OS and CPU architecture (x86-64 or ARM64). |
| TC-05 | Frontend build | The frontend is built with Vite 5 and React 19. Node.js >= 18 is required for the build process. |
| TC-06 | Browser support | The application targets modern desktop browsers only (Chrome, Firefox, Edge — latest two major versions). Mobile browsers and Internet Explorer are not supported. |
| TC-07 | File storage | Uploaded images are stored on the local server filesystem under the configured `UPLOAD_DIR`. No cloud object storage (S3, Cloudinary) is integrated in the current scope. Storage is therefore bounded by the host machine's available disk space. |

### 2.4.2 Operational and Deployment Constraints

| Constraint ID | Category | Description |
|---|---|---|
| OC-01 | Deployment scope | The system is scoped to a single-server, single-campus deployment for the academic demonstration period. Multi-tenant or multi-campus operation is not supported. |
| OC-02 | Internet dependency | The demo environment must operate fully offline (localhost). No runtime dependency on external APIs, CDNs, or cloud inference endpoints is permitted during the demo. |
| OC-03 | Environment configuration | All sensitive configuration values (database URL, session secret, CORS origin) must be provided through environment variables. The server refuses to start if `SESSION_SECRET` is absent. |
| OC-04 | Authentication mechanism | Session-based authentication is used (`express-session` + `connect-pg-simple`). JWT-based stateless authentication is not implemented in the current scope. |

### 2.4.3 Time and Capacity Constraints

| Constraint ID | Category | Description |
|---|---|---|
| CAP-01 | Concurrent users | The system is designed and tested for single-user or very low concurrency loads consistent with a course demo. It is not load-tested for concurrent production-level traffic. |
| CAP-02 | Image upload size | Each uploaded image is limited to a maximum file size enforced by the upload middleware (configured via `MAX_FILE_SIZE`). Files exceeding this limit are rejected before storage. |
| CAP-03 | Project timeline | Implementation is constrained to the BIL 481 course schedule. The delta improvement set was selected to fit within the remaining implementation window after Assignment 2 peer review. |

---

## 2.5 Assumptions and Dependencies

### 2.5.1 Assumptions

The following assumptions were made during requirements definition and design. If any assumption proves false, the affected requirements or design decisions must be revisited.

| Assumption ID | Assumption | Impact if False |
|---|---|---|
| AS-01 | Users access the platform via modern desktop browsers (Chrome, Firefox, Edge). Mobile and legacy browsers are not primary targets. | UI layout and interaction design may need revision for mobile viewports or older rendering engines. |
| AS-02 | The demo and testing environment is a single local machine with Node.js >= 18, PostgreSQL >= 14, and sufficient RAM (>= 2 GB) for in-process AI inference. | The AI matching module may fail to load or produce timeouts on lower-specification hardware; stub mode must be used. |
| AS-03 | All users belong to a single campus community and share a common understanding of campus locations referenced in item listings. | Location-based filtering becomes less meaningful if users from different campuses or institutions use the platform. |
| AS-04 | Item descriptions, titles, and categories are provided in English or Turkish. The embedding model (`Xenova/all-MiniLM-L6-v2`) was trained primarily on English text; cross-lingual similarity quality may vary. | Text similarity scores may be less accurate for Turkish-language descriptions, potentially reducing match quality. |
| AS-05 | Uploaded images are genuine photographs of the reported items. The perceptual hash similarity assumes comparable photographic conditions (similar angle, lighting). | Similarity scores based on image features may be unreliable for low-quality, cropped, or stylized images. |
| AS-06 | The platform operates during the academic semester with a limited and relatively trusted user base. Adversarial behavior (spam, coordinated abuse) is not a primary threat in the current scope. | If malicious usage occurs, the current moderation tooling (admin remove with reason) may be insufficient without rate limiting or automated abuse detection. |
| AS-07 | The dataset of lost and found items is small to moderate in size (hundreds of records, not millions). Full-text search and embedding-based matching are feasible without a dedicated vector database or search index. | For large-scale deployments, PostgreSQL full-text search and in-memory embedding comparison would need to be replaced with a dedicated search engine (Elasticsearch) or vector store (pgvector, Pinecone). |

### 2.5.2 External Dependencies

| Dependency ID | Dependency | Version / Source | Purpose | Risk |
|---|---|---|---|---|
| DEP-01 | Node.js | >= 18 LTS | Backend runtime and frontend build toolchain | Low — LTS version with long support window |
| DEP-02 | PostgreSQL | >= 14 | Relational data storage and server-side session store | Low — mature, stable database engine |
| DEP-03 | Express.js | ^4.x | HTTP server framework and middleware pipeline | Low — stable, widely used |
| DEP-04 | React + Vite | React 19, Vite 5 | Frontend component framework and build tool | Low — recent stable releases |
| DEP-05 | @xenova/transformers | ^2.x | In-process ONNX inference for text embedding | Medium — relatively new JS library; model loading time sensitive to hardware |
| DEP-06 | sharp | ^0.33 | Image validation, MIME detection, and perceptual hashing | Medium — requires native binary; platform-specific build |
| DEP-07 | Playwright | ^1.x | End-to-end browser automation testing | Low — widely adopted, maintained by Microsoft |
| DEP-08 | Jest + React Testing Library | Jest ^29, RTL ^16 | Unit and component testing | Low — stable, industry standard |
| DEP-09 | GitHub Actions | ubuntu-latest runner | CI pipeline for automated test execution on push/PR | Low — managed service; no local infrastructure required |

---

## 3.1.1 User Interfaces

This section defines the user interface requirements for MatchProof. The system provides a web-based UI accessible from modern desktop browsers. All screens are implemented as single-page application (SPA) views using React 19 and Vite 5.

### 3.1.1.1 General UI Requirements

| Requirement ID | Description |
|---|---|
| UI-01 | The interface must be usable on modern desktop browsers (Chrome, Firefox, Edge — latest two major versions) at common screen resolutions (1280 × 720 and above). |
| UI-02 | All interactive form elements (inputs, buttons, dropdowns) must display validation feedback inline, adjacent to the relevant field, without requiring a page reload. |
| UI-03 | Navigation must clearly indicate the current authenticated state (logged-in user name and logout option visible when authenticated; login/register prompt visible when unauthenticated). |
| UI-04 | All pages must be reachable within a maximum of two user interactions from the main entry point (search/home page). |
| UI-05 | Private item images must be visually blurred for non-owner and non-admin users in all views where the image appears (detail page and AI match cards). |
| UI-06 | When the AI matching service is unavailable, the detail page must display an explicit fallback message distinguishable from the "no matches found" empty state. |

### 3.1.1.2 Screen Inventory

| Screen | Route | Primary Actor | Key UI Elements |
|---|---|---|---|
| **Auth Page** (Login / Register) | `/auth` | Guest | Email input, password input, name input (register only), Login / Register toggle, error message display |
| **Search Page** (Home / Browse) | `/` | All authenticated users | Keyword search input, category filter, item-type filter (Lost / Found), status filter, date filter, paginated result cards |
| **Post Form Page** (Create / Edit) | `/items/new`, `/items/:id/edit` | Authenticated user | Item type selector (Lost / Found), title, category, location, description inputs, optional image upload, submit / cancel buttons, inline validation errors |
| **Item Detail Page** | `/items/:id` | Authenticated user | Item title and metadata, item image (blurred if private for non-owner/non-admin), owner contact card (name + email), status transition buttons (Claim / Resolve), AI Possible Matches panel (ranked cards with score and reason tags, or explicit fallback message), edit / delete controls (owner only), admin remove panel (admin only) |
| **Admin Moderation Page** | `/admin` | Administrator | List of all posts, remove action button, mandatory reason input, access-denied message for non-admin users |

### 3.1.1.3 Low-Fidelity Wireframe References

Detailed ASCII-level low-fidelity wireframes for the Login/Register page, Create Post page, Search Results page, and Item Detail page are documented in `docs/assignment-2/01-design-document.md`, Section 3.6. Those wireframes represent the initial design baseline. The Assignment 3 delta phase added the following visual elements not present in the original wireframes:

- **Private image blur indicator** on the item detail page and AI match cards
- **AI unavailability fallback message** replacing the empty match panel when the matching service fails
- **"ID Card auto-privacy" notice** shown to the post creator after submitting an ID Card category post

---

## 3.1.2 Hardware Interfaces

MatchProof does **not** depend on proprietary campus hardware, embedded controllers, scanners, or device-driver level integrations. The system is a standard web application and all hardware interaction is mediated through the user's operating system, browser, and the server runtime environment. This section therefore documents the required commodity hardware interfaces and their compatibility boundaries.

| Interface ID | Hardware Interface | Input to the System | Output from the System | Compatibility Requirement | Related Standards / Vendors |
|---|---|---|---|---|---|
| HI-01 | Client display and input peripherals | Keyboard input, mouse/touchpad clicks, scroll actions, and browser-based file selection | Rendered UI screens, validation feedback, search results, and blurred/unblurred item images | Desktop or laptop computer with a modern browser and standard pointing/input devices | USB HID-class keyboards/mice or built-in laptop equivalents; commodity devices from vendors such as Dell, HP, Lenovo, Asus, and Apple |
| HI-02 | Client local file access for image upload | User-selected image file provided through the browser file picker | Multipart upload request sent to the backend after browser selection and server-side validation | Browser must support standard HTML file input and the operating system must expose a readable local filesystem path to the browser picker | W3C HTML file input behavior; common desktop operating systems (Windows, macOS, Linux) and browser-managed filesystem access |
| HI-03 | Client network adapter | HTTP(S) requests carrying authentication, search filters, and item data | JSON/API responses, uploaded media transfer, and page assets | Wired Ethernet or Wi-Fi connectivity sufficient to access the demo/development server | IEEE 802.3 Ethernet, IEEE 802.11 Wi-Fi; no vendor-specific NIC dependency |
| HI-04 | Server compute and persistent storage | Incoming HTTP requests, SQL queries, validated image bytes written to local storage | API responses, persisted relational data, stored image files, and AI match results | Single-machine server capable of running Node.js, Express.js, PostgreSQL, and local upload storage for the course demo | Commodity x86-64 or ARM64 hardware; PostgreSQL-supported host platforms from common cloud or local vendors |

**Compatibility notes**

- No camera, GPS, biometric reader, NFC/RFID reader, campus-card scanner, or other specialized hardware is required by the current scope.
- The application does not access hardware directly; browser and operating system abstractions isolate the codebase from vendor-specific device drivers.
- If the platform is demonstrated on a different machine, equivalent commodity desktop hardware is sufficient as long as the supported browser, Node.js runtime, and PostgreSQL environment are available.

---

## 3.1.3 Software Interfaces

This section documents all software interfaces — internal APIs, third-party libraries, and runtime integrations — that MatchProof depends on or exposes. Each interface is described with its inputs, outputs, and dependency relationship.

### 3.1.3.1 Internal REST API (Backend ↔ Frontend)

MatchProof exposes a REST API over HTTP. All request and response bodies use the `application/json` content type unless the endpoint handles multipart file upload (`multipart/form-data`).

| Interface ID | Method + Endpoint | Input | Output | Auth Required |
|---|---|---|---|---|
| SI-API-01 | `POST /api/auth/register` | JSON: `{ name, email, password }` | JSON: `{ id, name, email, isAdmin }` — sets session cookie | No |
| SI-API-02 | `POST /api/auth/login` | JSON: `{ email, password }` | JSON: `{ id, name, email, isAdmin }` — sets session cookie | No |
| SI-API-03 | `POST /api/auth/logout` | None | JSON: `{ message }` — clears session cookie | Yes |
| SI-API-04 | `GET /api/auth/me` | Session cookie | JSON: `{ id, name, email, isAdmin }` | Yes |
| SI-API-05 | `POST /api/items` | Multipart: `{ itemType, title, category, location, description, isPrivate }` + optional image file | JSON: created item object | Yes |
| SI-API-06 | `GET /api/items/search` | Query params: `{ q, category, itemType, status, dateFrom, dateTo, page, limit }` | JSON: `{ items: [...], total, page, limit }` | Yes |
| SI-API-07 | `GET /api/items/:itemId` | Path param: `itemId` | JSON: item detail including `ownerContact: { name, email }` | Yes |
| SI-API-08 | `PATCH /api/items/:itemId` | JSON: partial item fields | JSON: updated item object | Yes (owner only) |
| SI-API-09 | `DELETE /api/items/:itemId` | Path param: `itemId` | JSON: `{ message }` | Yes (owner only) |
| SI-API-10 | `PATCH /api/items/:itemId/status` | JSON: `{ status }` | JSON: updated item object | Yes (owner only) |
| SI-API-11 | `GET /api/items/:itemId/matches` | Path param: `itemId` | JSON: `[ { item, score, reasons } ]` | Yes |
| SI-API-12 | `POST /api/moderation/items/:itemId/remove` | JSON: `{ reason }` | JSON: moderation action record | Yes (admin only) |
| SI-API-13 | `GET /api/health` | None | JSON: `{ status: "ok" | "degraded", db: "up" | "down" }` | No |

**Error contract:** All error responses follow the structure `{ error: { code: string, message: string } }`. HTTP status codes used: 400 (validation), 401 (unauthenticated), 403 (unauthorized), 404 (not found), 409 (conflict), 500 (server error).

### 3.1.3.2 Third-Party Library Interfaces

| Interface ID | Library | Version | Interface Type | Input | Output | Purpose |
|---|---|---|---|---|---|---|
| SI-LIB-01 | `@xenova/transformers` | ^2.x | In-process JS API | Text string | Float32Array (384-dim embedding vector) | Semantic text embedding for similarity scoring |
| SI-LIB-02 | `sharp` | ^0.33 | In-process JS API | Image file buffer | Perceptual hash string; validated MIME type; resized buffer | Image validation, perceptual hashing, and processing |
| SI-LIB-03 | `bcrypt` | ^5.x | In-process JS API | Plaintext password; hash string | Hash string; boolean comparison result | Password hashing and verification |
| SI-LIB-04 | `express-session` + `connect-pg-simple` | ^1.x / ^9.x | Express middleware | HTTP request with cookie header | Populated `req.session` object; session persisted in PostgreSQL | Server-side session management |
| SI-LIB-05 | `pg` (node-postgres) | ^8.x | In-process JS API | SQL query string + parameters | Query result rows | PostgreSQL database access |
| SI-LIB-06 | `multer` | ^1.x | Express middleware | Multipart HTTP request | `req.file` object with validated file path and metadata | File upload handling and MIME / size validation |

### 3.1.3.3 Development and Testing Tool Interfaces

| Interface ID | Tool | Interface Type | Purpose |
|---|---|---|---|
| SI-TEST-01 | Jest ^29 | CLI / programmatic | Unit and integration test runner for backend and frontend |
| SI-TEST-02 | React Testing Library ^16 | In-process JS API | Component-level rendering and interaction simulation |
| SI-TEST-03 | Playwright ^1.x | CLI / API | End-to-end browser automation against running application |
| SI-TEST-04 | Supertest | In-process JS API | HTTP-level integration testing of Express routes without starting a real server |
| SI-CI-01 | GitHub Actions | YAML workflow / REST API | CI pipeline: installs dependencies, runs `test:unit`, reports pass/fail per commit and PR |

---

## 3.1.4 Communication Interfaces

This section defines the communication protocols, data formats, and message flows used between the components of MatchProof.

### 3.1.4.1 Protocol and Transport

| Interface ID | Protocol | Direction | Description |
|---|---|---|---|
| CI-01 | HTTP/1.1 | Browser → Backend | All API requests from the React frontend to the Express backend use HTTP/1.1. During the local demo, the connection is over `localhost` without TLS. A production deployment should use HTTPS (TLS 1.2 or higher). |
| CI-02 | WebSocket | Not used | Real-time communication (live notifications, chat) is explicitly out of scope. All client-server communication is request-response over HTTP. |
| CI-03 | PostgreSQL Wire Protocol | Backend → Database | The `pg` library communicates with PostgreSQL using the PostgreSQL binary wire protocol over a local TCP socket or Unix domain socket. |
| CI-04 | In-process function call | Backend → AI module | The AI matching service (`matchingService.js`) calls the `@xenova/transformers` and `sharp` libraries in-process. There is no inter-process or network communication for AI inference. |

### 3.1.4.2 Data Format

| Format | Used For |
|---|---|
| **JSON** (`application/json`) | All REST API request and response bodies except file upload endpoints. |
| **Multipart/form-data** | Image upload during item creation (`POST /api/items`) and item update (`PATCH /api/items/:itemId`). |
| **HTTP Cookie** (`Set-Cookie` / `Cookie` headers) | Session token transport. The session ID is stored in an `HttpOnly` cookie set by the backend after successful login or registration. |
| **SQL** | All database read and write operations are expressed as parameterized SQL queries submitted via the `pg` client. |

### 3.1.4.3 CORS Configuration

Cross-origin requests are managed by the `cors` Express middleware. The allowed origin is read from the `CLIENT_ORIGIN` environment variable at server startup. Requests from origins not listed in `CLIENT_ORIGIN` are rejected with a CORS error before reaching any route handler. Credentials (cookies) are permitted for same-origin and explicitly whitelisted cross-origin requests.

### 3.1.4.4 Session State Flow

```
Client (Browser)
  │
  │  POST /api/auth/login  { email, password }
  │ ─────────────────────────────────────────────────────────► Express Server
  │                                                               │
  │                                          AuthService.login()  │
  │                                            bcrypt.compare()   │
  │                                          Session written to   │
  │                                            PostgreSQL         │
  │  ◄──────────────────────────────────────────────────────────  │
  │  200 OK  Set-Cookie: connect.sid=<session-id>; HttpOnly
  │
  │  Subsequent requests carry Cookie: connect.sid=<session-id>
  │ ─────────────────────────────────────────────────────────► Express Server
  │                                          Session looked up in  │
  │                                            PostgreSQL          │
  │                                          req.session.userId    │
  │                                            attached to request │
  │  ◄──────────────────────────────────────────────────────────  │
  │  Authenticated response
```

---

## 3.2 Functional Requirements

The baseline functional requirements for MatchProof were first defined in `docs/assignment-1/03-requirements.md`. This section republishes them in a traceable form by linking each requirement to the user scenarios documented in `docs/assignment-3/05-user-stories.md`.

| FR ID | Functional Requirement | Primary User Scenario(s) | Traceable User Outcome |
|---|---|---|---|
| FR1 | Users must be able to register and log in to the system. | US-01, US-02 | A campus user can create an account and establish an authenticated session. |
| FR2 | Users must be able to create a lost item post including title, description, category, and location. | US-03 | A user can publish a structured lost-item listing. |
| FR3 | Users must be able to create a found item post including item details and discovery location. | US-04 | A user can publish a structured found-item listing. |
| FR4 | Users must be able to upload photos of lost or found items. | US-03, US-04, US-11 | Users can attach visual evidence to posts while sensitive images remain privacy-aware in later views. |
| FR5 | Users must be able to search items using keyword-based text search. | US-05 | Users can find relevant listings through free-text queries. |
| FR6 | Users must be able to filter items by category and date. | US-05 | Users can narrow result sets to a manageable shortlist. |
| FR7 | Users must be able to mark items as claimed or resolved. | US-08 | Post owners can keep the recovery lifecycle accurate. |
| FR8 | Users must be able to view the basic contact information of the person who created an item post in order to coordinate item return. | US-07 | An authenticated user can contact the owner using name and email only. |
| FR9 | Admin must be able to remove inappropriate or duplicate posts. | US-10 | An administrator can keep the board clean and trustworthy. |
| FR10 | Users must be able to edit or delete their own posts. | US-09 | Post owners can correct or remove their own listings. |
| FR11 | The system must analyze uploaded item photos using AI techniques to identify basic object characteristics such as object type and dominant color. | US-06 | The matching pipeline can derive visual signals from uploaded photos. |
| FR12 | The system must generate similarity scores between lost and found items using AI-based analysis of text descriptions and images. | US-06 | Potential matches can be ranked using combined textual and visual evidence. |
| FR13 | The system must present users with a ranked list of potential matching items based on similarity scores. | US-06 | Users see the most promising candidate matches first. |
| FR14 | The system must provide a brief explanation indicating why two items are considered similar (for example: color, category, or description similarity). | US-06 | Users understand why the system suggested a given match. |

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

## 3.4 Design Constraints

This section consolidates the standards, platform choices, and hardware/runtime decisions that directly constrain the MatchProof design. It summarizes the practical decisions previously scattered across the Assignment 2 design document and the technical constraints in Section 2.4 of this document.

| Constraint ID | Constraint Type | Design Constraint | Impact on the Solution |
|---|---|---|---|
| DC-01 | Documentation and quality standards | Requirements and quality language follow the structure of IEEE Std 830 and ISO/IEC 25010. | Section naming, traceability, and quality-factor definitions must remain aligned with accepted software engineering standards. |
| DC-02 | Application platform | MatchProof must remain a web-based, layered monolith using React 19 + Vite 5 on the client and Node.js/Express on the server. | The solution favors a single deployable application over distributed services or native/mobile clients. |
| DC-03 | Data platform | PostgreSQL 14+ is the required relational database and session store. | Data modeling, persistence, and session management decisions must stay compatible with PostgreSQL semantics. |
| DC-04 | Runtime environment | The system must run on Node.js 18+ with environment-driven configuration (`DATABASE_URL`, `SESSION_SECRET`, `CLIENT_ORIGIN`, `UPLOAD_DIR`, `MATCHING_MODE`). | Deployment portability depends on externalized configuration rather than code changes. |
| DC-05 | Browser target | The primary supported clients are modern desktop browsers (Chrome, Firefox, Edge). Mobile browsers and Internet Explorer are outside the baseline scope. | UI design and testing focus on desktop layouts and standard browser APIs. |
| DC-06 | Hardware boundary | Demo and test execution assume commodity x86-64 or ARM64 hardware with at least 2 GB free RAM for optional in-process AI inference and enough local disk for uploaded files. | Heavy hardware-specific optimizations and high-concurrency deployment patterns are intentionally excluded. |
| DC-07 | External service policy | Core demo flows must work without runtime dependence on external AI APIs, CDNs, or cloud object storage. | Images are stored locally and AI matching must degrade gracefully if live inference is unavailable. |

---

## 3.5.1 Reliability Requirements

Reliability for MatchProof means that invalid inputs, partial dependency failures, and state-transition edge cases are handled predictably without corrupting item state or misleading the user.

| Requirement ID | Reliability Requirement | Verification / Evidence Basis |
|---|---|---|
| REL-01 | Protected routes must fail closed: unauthenticated requests return a structured `AUTH_REQUIRED` error and unauthorized admin actions return `ADMIN_REQUIRED`. | `require-auth`, `require-admin`, and route integration tests |
| REL-02 | Database health failures must produce a controlled degraded response on `/api/health` rather than a hang or unhandled crash. | `GET /api/health` healthy/degraded integration tests |
| REL-03 | Failure in the AI matching path must not block the core item-detail workflow; the UI must render an explicit fallback message instead of silently showing an empty result. | `DetailPage.test.jsx` unavailable-match scenario |
| REL-04 | Item lifecycle consistency must be preserved by allowing only valid owner-driven transitions (`open -> claimed -> resolved`) and rejecting invalid transitions. | `items.service.test.js` and E2E status-flow coverage |
| REL-05 | Sensitive-category privacy rules must be enforced server-side so that a client cannot disable privacy for `ID Card` posts. | `items.service.test.js` forced-private scenarios |
| REL-06 | The matching pipeline must handle removed items, missing images, and item-not-found cases without leaking raw failures to the user interface. | `matchingService.test.js` edge-case coverage |

---

## 3.5.2 Availability Requirements

Availability is defined for the planned academic test and demo windows, not for 24/7 production hosting. Because the system is deployed as a single-node web application, the availability target is paired with an operational recovery target for recoverable local failures.

| Requirement ID | Availability Requirement | Target |
|---|---|---|
| AVL-01 | The system must remain operational during scheduled test and demo windows. | `>= 95%` uptime during the planned window |
| AVL-02 | The unauthenticated health endpoint must expose the current service state and distinguish healthy vs degraded operation when the database is unreachable. | Correct `ok` / `degraded` contract with appropriate HTTP status |
| AVL-03 | Recoverable single-node failures such as backend process restart, local database reconnect, or configuration correction before demo restart must be restored within a short manual intervention window. | MTTR `<= 15 minutes` during scheduled support periods |
| AVL-04 | AI matching degradation must not make posting, searching, moderation, or item-detail access unavailable. | Core non-AI flows remain usable when the AI module is unavailable |

**Operational note:** The MTTR target assumes the team is restoring the service from the latest local repository state on the designated demo machine with PostgreSQL data already present.

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

## 3.5.4 Maintainability Requirements

Maintainability requirements ensure that MatchProof can accept bug fixes, documentation corrections, and AI-related improvements without large-scale rework.

| Requirement ID | Maintainability Requirement | Verification / Evidence Basis |
|---|---|---|
| MAI-01 | Backend responsibilities must remain separated into route, service, and model layers, and frontend flows must remain organized by page/component responsibility. | Current layered codebase structure in `src/server` and `src/client` |
| MAI-02 | Core modules must retain automated test coverage at or above the project target before release. | Coverage target `>= 80%` on core modules; `test:all` passes |
| MAI-03 | The AI matching module must continue to support deterministic `stub` mode alongside live inference mode. | `MATCHING_MODE=stub` in automated tests and demo fallback strategy |
| MAI-04 | Deployment-specific behavior must stay externalized in configuration rather than being hard-coded into source files. | `.env.example`, environment readers, and startup validation |
| MAI-05 | Requirement, user-story, QA, and acceptance documents must remain cross-referenced so that changes can be traced through design and verification artifacts. | Traceability tables across `03-requirements.md`, `05-user-stories.md`, `02-quality-factors.md`, and acceptance documents |

---

## 3.5.5 Portability Requirements

Portability for MatchProof refers to the system's ability to be moved between supported desktop browsers and common development/demo operating systems with minimal reconfiguration.

| Requirement ID | Portability Requirement | Scope / Boundary |
|---|---|---|
| POR-01 | The client application must run in the latest two major versions of Chrome, Firefox, and Edge on desktop operating systems. | Primary browser portability target defined by NFR3 |
| POR-02 | The server application must be runnable on macOS, Linux, and Windows environments where Node.js 18+, PostgreSQL 14+, and compatible `sharp` binaries are available. | Supported runtime portability for team and CI environments |
| POR-03 | Environment-specific values must be supplied through environment variables instead of code edits. | Supports machine-to-machine migration without source changes |
| POR-04 | Core demo functionality must remain executable on localhost without mandatory cloud services. | Improves portability between classroom, home, and lab machines |
| POR-05 | Mobile browsers, PWA packaging, and legacy browsers are explicitly outside the current portability commitment. | Out-of-scope portability boundary |

---

## 3.6 Other Requirements

The following cross-cutting requirements do not fit neatly into the interface, performance, or quality sub-sections above but still affect acceptance and operational suitability.

| Requirement ID | Other Requirement | Why It Matters |
|---|---|---|
| OTH-01 | Moderation actions must record the acting admin, a mandatory reason, and a timestamp. | Provides auditability and accountability for content removal decisions. |
| OTH-02 | AI-generated match suggestions must remain advisory and explainable; the system must not make automatic ownership decisions on behalf of users. | Keeps the platform transparent and ethically bounded for a campus setting. |
| OTH-03 | The system must be demonstrable offline on a single local machine during the course demo. | Supports predictable academic evaluation without internet dependence. |
| OTH-04 | Owner contact exposure is limited to name and email; additional channels such as phone number, messaging, or push notification remain out of scope. | Preserves the project's privacy boundary and MVP scope. |

---

## 4.2 Data Collection Specification

This section defines what personal and item data the MatchProof system collects, how it is used, and for how long it is retained during the planned testing and demonstration period.

### 4.2.1 Data Collected

| Data Category | Fields Collected | Collection Point | Purpose |
|---|---|---|---|
| User account data | Name, email address, bcrypt password hash, admin flag, account creation timestamp | Registration (POST /api/auth/register) | Authentication, session management, owner contact display |
| Session data | Session ID, user ID, session creation and expiry timestamps | Login (POST /api/auth/login) | Maintaining authenticated state across requests |
| Item post data | Title, description, category, location, item type (lost/found), status, isPrivate flag, image file path, creation and update timestamps | Item creation (POST /api/items) | Core platform functionality: search, matching, display |
| Uploaded images | Image files stored on the local server filesystem under the configured upload directory | File upload during item creation | Visual display and AI visual similarity analysis |
| Moderation action data | Moderated item ID, admin user ID, reason text, action timestamp | Admin removal (POST /api/moderation/items/:id/remove) | Audit trail for content moderation decisions |

### 4.2.2 Data Not Collected

The system does not collect payment information, location GPS coordinates, biometric data, in-app messages between users, or behavioral analytics. No third-party analytics or tracking scripts are included in the frontend.

### 4.2.3 Data Retention

Data is retained for the duration of the academic demonstration period. No automated deletion policy is enforced. The system does not implement data export or account deletion flows in the current scope (deferred as out-of-scope per `01-project-definition.md`).

### 4.2.4 Data Access

Item data is visible only to authenticated users. Owner contact information (name and email) is visible only in the single-item detail view, not in search or list responses. Private items have their images blurred for non-owner, non-admin users.

---

## 4.5 Data Limitations & Assumptions

The collected data is sufficient for a course-scale lost-and-found workflow, but it carries important limitations that affect search quality, AI matching confidence, and long-term operational use.

| ID | Data Limitation / Assumption | Effect on Interpretation or Use |
|---|---|---|
| DLA-01 | The operational dataset is expected to remain small to moderate (hundreds of records, not a production-scale archive). | Reported match quality and search behavior are indicative for a campus demo, not for large-scale deployment. |
| DLA-02 | Item titles and descriptions are user-entered and may be short, inconsistent, bilingual (Turkish/English), or incomplete. | Text search and semantic similarity quality can vary significantly across posts. |
| DLA-03 | Uploaded images may be missing, low-resolution, poorly lit, cropped, or taken from inconsistent angles. | Visual similarity signals may be weak or misleading for some items. |
| DLA-04 | The project does not maintain a large labeled ground-truth dataset or a formal fairness benchmark for the AI matching module. | Similarity scores must be treated as advisory recommendations, not authoritative decisions. |
| DLA-05 | No GPS coordinates, phone numbers, payment data, or behavioral analytics are collected. | Privacy is improved, but precise location recovery and richer communication workflows are intentionally limited. |
| DLA-06 | Data retention is tied to the academic test/demo period and no automated deletion, export, or account-erasure workflow is implemented. | The current data model is not yet suitable for long-term production governance without extension. |

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

## 9.2 Economic Constraints

This section defines the budget, cost boundaries, and economic limitations that governed the design and tooling decisions for MatchProof.

### 9.2.1 Project Budget

MatchProof was designed and implemented with a target budget of **$0–15 USD** for the academic course period. All selected technologies are free and open-source or available under free-tier plans for educational use.

| Cost Category | Estimate | Notes |
|---|---|---|
| Backend runtime (Node.js, Express) | $0 | Open-source, MIT license |
| Frontend framework (React, Vite) | $0 | Open-source, MIT license |
| Database (PostgreSQL) | $0 | Open-source; hosted locally during demo |
| AI inference (@xenova/transformers, ONNX) | $0 | Open-source; in-process inference, no cloud API cost |
| Image processing (sharp) | $0 | Open-source, Apache 2.0 license |
| Version control (GitHub) | $0 | Free for student/educational accounts |
| CI pipeline (GitHub Actions) | $0 | Free tier — 2,000 minutes/month on public repositories |
| Testing frameworks (Jest, Playwright, RTL) | $0 | Open-source |
| Hosting (local demo environment) | $0 | Demo runs on team hardware; no cloud hosting required |
| Custom domain (optional) | $10–15 | Not required for course demo; included as an optional future cost |
| **Total** | **$0–15** | Minimal to zero cost for course scope |

### 9.2.2 Human Resource Cost

The implementation effort is constrained to the team's allocated academic working time. The total estimated effort across all project phases is **160 person-hours**, distributed across five team members over the semester. No external contractors, paid consultants, or paid cloud services were used.

| Phase | Estimated Effort (person-hours) |
|---|---|
| Requirements and Planning | 15 |
| Design | 15 |
| Development | 70 |
| AI Matching and Explainability | 30 |
| Testing and QA | 20 |
| Deployment and Documentation | 10 |
| **Total** | **160** |

### 9.2.3 Economic Limitations and Trade-offs

The zero-cost constraint shaped several key design and scope decisions:

- **In-process AI inference** (`@xenova/transformers` ONNX) was selected over paid cloud ML APIs (OpenAI embeddings, AWS SageMaker) to avoid per-call inference costs.
- **Local filesystem image storage** was used instead of cloud object storage (AWS S3, Cloudinary) to avoid storage and egress costs during the demo period.
- **PostgreSQL on local hardware** was preferred over managed database services (RDS, Supabase paid tier) for the same reason.
- **Password reset and email notifications** were deferred as out-of-scope partly because integrating a transactional email service (SendGrid, Mailgun) would introduce cost and external API dependency.
- **Malware scanning for uploads** was deferred because cloud-based scanning services are not free at the required volume.

For a hypothetical production deployment beyond the course scope, the primary cost drivers would be: cloud server hosting (~$20–50/month for a VPS), managed PostgreSQL (~$15–30/month), cloud image storage (usage-based), and a transactional email service (usage-based). These are acknowledged as future economic constraints outside the current project boundary.

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
