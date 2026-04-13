# Design Document (Assignment 2)

**Project Name:** MatchProof  
**Course:** BIL 481  
**Version:** 1.0  
**Date:** 2026-02-15

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Mehmet Gür

## Table of Contents

1. System Overview
2. Document-Specific Task Matrix
3. Implementation Details
4. Use Case Support in Design
5. Design Decisions

## 1. System Overview

### 1.1 Brief Project Description

MatchProof is a campus-focused digital lost and found board. Users can post lost or found items, search listings, and complete claim/resolution workflows in a single web platform. The goal is to reduce item recovery time and remove manual communication bottlenecks of physical bulletin boards.

The project includes AI-assisted matching as a practical enhancement, not as a hard dependency for core use. Core flows (post, search, claim, resolve) remain available with standard filtering even if AI ranking is temporarily unavailable.

### 1.2 System Architecture

MatchProof is designed as a simple layered monolith to keep implementation simple and maintainable for a course project:

- Presentation Layer: Web UI (desktop browser support)
- API Layer: REST endpoints for auth, items, search, moderation
- Domain Layer: Auth, Listings, Search, Matching, Moderation services
- Data Layer: Relational database for core entities + image storage

High-level request flow:

```text
Browser UI -> API Controller -> Service Layer -> Model Layer -> Database
                               -> Matching Service -> Ranked Results + Explanation
```

### 1.3 Technology Stack

| Layer | Selected Technology | Purpose |
|---|---|---|
| Frontend | React.js + JavaScript + CSS | User interface and user flows |
| Backend | Node.js + Express.js | REST API and business logic |
| Database | PostgreSQL | Users, posts, statuses, moderation metadata |
| AI Matching | Pre-trained embedding model integration + cosine similarity | Multi-modal ranking and explainable matching |
| Media | Image upload + validation + storage pipeline | Item photo handling |
| Version Control | GitHub | Source control and contribution tracking |

## 2. Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| System overview writing | Mehmet Gür | - | Completed |
| Architecture and technology stack definition | Mehmet Gür | - | Completed |
| Implementation details and interfaces | Mehmet Gür | - | Completed |
| 4 use case design and FR mapping | Mehmet Gür | - | Completed |
| Design decision comparisons | Mehmet Gür | - | Completed |
| Document consistency and scope check | Mehmet Gür | - | Completed |
| Formatting and table of contents | Mehmet Gür | - | Completed |

## 3. Implementation Details

### 3.1 Codebase Structure

Planned structure:

```text
matchproof/
  docs/
    assignment-1/
    assignment-2/
  src/
    client/
      pages/
      components/
      services/
    server/
      routes/
      services/
      models/
```

### 3.2 Key Implementations

- Authentication service: register/login/session handling (FR1)
- Item service: create/edit/delete lost/found posts and media upload (FR2, FR3, FR4, FR10)
- Search service: keyword search + filter by category/date/status/item type with pagination (FR5, FR6)
- Matching service: text+image similarity scoring and ranked candidate generation (FR11, FR12, FR13)
- Explainability service: short explanation generation from top similarity factors (FR14)
- Moderation service: admin removal of duplicate/inappropriate posts (FR9)
- Status service: claimed/resolved lifecycle management (FR7)
- Contact display flow: show owner contact information on item detail page (FR8)

### 3.3 Core Business Logic

- Baseline search score:
  - Keyword relevance in title + description
  - Category match bonus
  - Recency weighting
- AI similarity score:
  - `text_similarity` from normalized description embeddings
  - `image_similarity` from uploaded image embeddings
  - Combined score: `0.6 * text_similarity + 0.4 * image_similarity`
- Explainable match output:
  - Return top reasons such as color similarity, category overlap, and description keyword overlap

### 3.4 Component Interfaces

Core service interfaces (language-neutral signatures):

```text
AuthService.register(name, email, password) -> User
AuthService.login(email, password) -> Session
AuthService.logout(session) -> void
AuthService.getCurrentUser(session) -> User

ItemService.createItem(userId, itemType, payload, imageFile) -> Item
ItemService.getItemById(requestUserId, requestUserRole, itemId) -> ItemDetail
ItemService.updateItem(userId, itemId, payload) -> Item
ItemService.deleteItem(userId, itemId) -> void
ItemService.updateStatus(userId, itemId, status) -> Item

SearchService.search(filters) -> Paged<ItemSummary>
MatchingService.rankCandidates(itemId, limit) -> List<MatchCandidate>
MatchingService.explainMatch(sourceItemId, candidateItemId) -> MatchExplanation

ModerationService.removePost(adminUserId, itemId, reason) -> ModerationAction
```

### 3.5 API Endpoint Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Return the authenticated user |
| POST | `/api/items` | Create lost/found item post |
| GET | `/api/items/{itemId}` | Get item detail and contact display data |
| PATCH | `/api/items/{itemId}` | Edit own item post |
| DELETE | `/api/items/{itemId}` | Delete own item post |
| GET | `/api/items/search` | Keyword + filter based search |
| GET | `/api/items/{itemId}/matches` | Ranked AI-assisted matches + explanations |
| PATCH | `/api/items/{itemId}/status` | Mark as claimed/resolved |
| POST | `/api/moderation/items/{itemId}/remove` | Admin moderation action |

### 3.6 Visual Interfaces (Low-Fidelity Wireframes)

1. Login/Register page

```text
+--------------------------------------+
| MatchProof                           |
| [Email           ]                   |
| [Password        ]                   |
| ( Login )   ( Register )             |
+--------------------------------------+
```

2. Create Post page (Lost/Found)

```text
+--------------------------------------------------+
| New Post: [Lost v]                               |
| Title        [____________________]              |
| Category     [____________________]              |
| Location     [____________________]              |
| Description  [______________________________]    |
| Photo        [ Upload ]                          |
|                  ( Save Post )                   |
+--------------------------------------------------+
```

3. Search and Match page

```text
+--------------------------------------------------+
| Search: [wallet] [Category v] [Date v] (Find)    |
| Result A                                         |
|  - Similarity: 0.86                              |
|  - Why: black color, wallet category, key terms  |
| Result B                                         |
|  - Similarity: 0.72                              |
|  - Why: category overlap                         |
+--------------------------------------------------+
```

4. Item Detail page

```text
+--------------------------------------------------+
| Item Title                                       |
| Status: OPEN                                     |
| Owner Name + Email                             |
| (Mark Claimed) (Mark Resolved)                   |
| Admin: (Remove Post)                             |
+--------------------------------------------------+
```

## 4. Use Case Support in Design

### 4.1 Use Case Selection (4 Use Cases)

| Use Case ID | Use Case | Primary Actor |
|---|---|---|
| UC1 | Register and Login | Student/User |
| UC2 | Create Lost/Found Post with Photo | Student/User |
| UC3 | Search and AI-Assisted Match | Student/User |
| UC4 | Claim/Resolve and Moderate Post | User/Admin |

### 4.2 Requirement Mapping

| Use Case ID | Mapped Functional Requirements |
|---|---|
| UC1 | FR1 |
| UC2 | FR2, FR3, FR4, FR10 |
| UC3 | FR5, FR6, FR11, FR12, FR13, FR14 |
| UC4 | FR7, FR8, FR9 |

### 4.3 Use Case Design Details

#### UC1: Register and Login
- Interaction flow: UI -> Auth API -> AuthService -> UserModel
- Data flow: new user record creation and credential verification
- State change: `Guest -> Authenticated`
- Output: authenticated session established for subsequent authorized actions

#### UC2: Create Lost/Found Post with Photo
- Interaction flow: UI form submit -> Item API -> ItemService + Media pipeline
- Data flow: post metadata to database, photo to storage, URL linked to item
- State change: new item is created with `Open` status
- Output: searchable post visible in listing feed

#### UC3: Search and AI-Assisted Match
- Interaction flow: search request -> SearchService -> candidate retrieval -> MatchingService ranking
- Data flow: keyword and filters query database; AI module calculates similarity and explanations
- State change: query state only (no item lifecycle transition)
- Output: ranked list with concise explainable reasons

#### UC4: Claim/Resolve and Moderate Post
- Interaction flow (user): item detail -> owner contact display -> status update action
- Interaction flow (admin): moderation panel -> remove post action
- Data flow: status/moderation updates persisted with actor metadata
- State change: `Open -> Claimed -> Resolved` (and optional `Open -> Removed` by admin)
- Output: item lifecycle is controlled and inappropriate content can be removed

### 4.4 Demo Requirement

The final project demo will include full implementation of UC1, UC2, UC3, and UC4. Demonstration scenarios will verify:

- Correctness of end-to-end behavior
- Completeness of mapped requirement support
- Consistency between design definitions and implemented system behavior

## 5. Design Decisions

### 5.1 Technology Comparisons

1. Backend Framework: Express.js vs FastAPI
- Express.js advantages: team familiarity, direct JavaScript stack alignment, fast iteration
- FastAPI advantages: strong typing support and built-in validation
- Decision: Express.js selected to keep one primary stack and reduce onboarding overhead

2. Database: PostgreSQL vs MongoDB
- PostgreSQL advantages: strong relational integrity for users/posts/status/moderation relations
- MongoDB advantages: flexible schema for evolving item attributes
- Decision: PostgreSQL selected for predictable relations and query consistency

3. Architecture Style: Layered Monolith vs Microservices
- Layered monolith advantages: simpler deployment, lower operational complexity, faster course delivery
- Microservices advantages: independent scaling and service isolation
- Decision: layered monolith selected for assignment scope and timeline feasibility

### 5.2 Decision Justifications

- The selected stack minimizes integration risk and supports the planned 160 person-hour effort budget.
- AI matching is integrated as a module with fallback behavior, so core platform value does not depend on model availability.
- Design prioritizes maintainability and demonstrability over distributed-system complexity.

# AI Matching Module Design Pattern Decisions

## Problem 1: Inflexible Management of Matching Criteria

In the AI matching module, multiple criteria are used to match lost and found items. These include category, location, description text, image similarity, and posting date. If all these comparisons are implemented within a single class using fixed and nested `if-else` structures, the system becomes difficult to maintain. Additionally, adding a new similarity method or modifying an existing one would require changes across the entire module.

## Solution: Strategy Pattern

To address this problem, the **Strategy Pattern** has been adopted. Each similarity calculation method is modeled as a separate strategy class. This allows the system to compute each criterion independently and makes it easy to extend with new strategies when needed.

### Example Strategies
- `CategorySimilarityStrategy`
- `LocationSimilarityStrategy`
- `TextSimilarityStrategy`
- `ImageSimilarityStrategy`
- `DateSimilarityStrategy`

## Architectural Placement

The Strategy Pattern is used within the **AI Matching Service layer** of the backend architecture.  
Instead of implementing all similarity calculations directly inside `MatchingService`, the service delegates each calculation to the appropriate strategy class. Thus, the service acts as an orchestrator rather than containing algorithm-specific logic.

## UML Diagram Update

Before applying the Strategy Pattern, similarity calculations could be implemented as internal methods of the `MatchingService`.  
After applying the pattern, the UML design was updated as follows:

- A common interface `SimilarityStrategy` was introduced.
- Each similarity type is implemented as a separate concrete class.
- `MatchingService` depends on the abstraction (`SimilarityStrategy`) instead of concrete implementations.

This change reduces coupling and improves modularity.

## Design Decision Rationale

The similarity algorithms in the matching module are expected to evolve over time:

- Text similarity may evolve from basic string matching to embedding-based semantic similarity.
- Image similarity may use different models in the future.
- Location scoring may become more advanced.

A monolithic implementation would make these changes costly and error-prone. Therefore, the Strategy Pattern was selected because it supports **algorithm variability**, **extensibility**, and **independent testing**.

Alternative approaches such as implementing all logic in a single service class were rejected due to poor maintainability and high coupling.

## Quality Factors

- **Modifiability**: New similarity algorithms can be added easily.
- **Maintainability**: Each algorithm is isolated in its own class.
- **Testability**: Each strategy can be tested independently.
- **Reusability**: Strategies can be reused across different scenarios.
- **Low Coupling**: The service depends on abstractions rather than concrete classes.

## Quality Criteria

- Adding a new similarity method should require minimal changes to existing code.
- Each strategy must have a single responsibility.
- Each strategy should be independently unit-testable.
- The `MatchingService` should depend only on the `SimilarityStrategy` interface.

## Trade-offs

The Strategy Pattern increases the number of classes and introduces additional abstraction. While this may seem complex for small systems, it is justified here due to the expected evolution of matching algorithms.

---

## Problem 2: Monolithic Matching Workflow

The matching process consists of multiple stages:

- selecting candidate items
- validating constraints
- calculating similarity scores
- aggregating results
- producing the final decision

If all these steps are implemented within a single service, the system becomes complex, hard to read, and difficult to extend.

## Solution: Chain of Responsibility Pattern

To solve this problem, the **Chain of Responsibility Pattern** has been applied.  
The matching process is divided into sequential processing steps, where each handler performs a specific task and passes the result to the next handler.

### Example Handler Structure
- `CandidateSelectionHandler`
- `CategoryValidationHandler`
- `LocationScoringHandler`
- `TextScoringHandler`
- `ImageScoringHandler`
- `DateScoringHandler`
- `FinalDecisionHandler`

## Architectural Placement

This pattern is used in the **matching workflow layer** of the AI Matching Module.  
A `MatchingContext` object is passed through the handler chain, and each handler processes and updates this context.

## UML Diagram Update

Before applying this pattern, the workflow could be represented as a single method inside a service.  
After applying the pattern:

- An abstract class `MatchHandler` was introduced.
- Each processing step is implemented as a concrete handler.
- Handlers are connected via a `nextHandler` reference.
- A shared `MatchingContext` object is introduced.

This results in a more modular and extensible design.

## Matching Context

The `MatchingContext` carries all necessary data throughout the pipeline, including:

- source item
- candidate items
- partial similarity scores
- matched fields
- explanation reasons
- final results

This allows handlers to remain loosely coupled.

## Design Decision Rationale

The matching process is inherently multi-step and expected to grow.  
New steps such as:

- brand similarity
- color similarity
- user confidence scoring

may be added in the future.

The Chain of Responsibility Pattern enables easy extension by inserting new handlers without modifying existing ones.

A monolithic approach was rejected due to poor scalability and maintainability.

## Quality Factors

- **Extensibility**: New steps can be added easily.
- **Separation of Concerns**: Each handler has a single responsibility.
- **Readability**: The workflow is clearly structured.
- **Scalability**: The system can grow with new handlers.
- **Testability**: Each handler can be tested independently.

## Quality Criteria

- Each handler must have exactly one responsibility.
- Handlers should communicate via `MatchingContext`.
- New handlers should be added without modifying existing ones.
- Each handler should be independently testable.

## Trade-offs

The pattern introduces additional complexity and may make debugging harder due to distributed flow. However, this trade-off is acceptable given the flexibility and scalability it provides.

---

## Overall Evaluation

Initially, the AI matching system had a more centralized and tightly coupled structure.  
After applying the Strategy Pattern and Chain of Responsibility Pattern:

- The system became more modular and extensible.
- Similarity algorithms are decoupled from the core service.
- The matching workflow is structured and easier to extend.

Together, these patterns provide both **algorithmic flexibility** and **process modularity**.

