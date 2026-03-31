# MatchProof – Software Architecture Document

**Project Name:** MatchProof
**Course:** BIL 481
**Version:** 1.0
**Date:** 2026-02-20

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Elif Beyza Turan
- Alp Eren Köksal

---

## Table of Contents

1. [Architecture Style](#1-architecture-style)
2. [System Overview](#2-system-overview)
3. [Component Diagram](#3-component-diagram)
4. [Class Diagram](#4-class-diagram)
5. [Sequence Diagrams](#5-sequence-diagrams)
6. [Deployment Diagram](#6-deployment-diagram)
7. [Component Interfaces](#7-component-interfaces)

---

## 1. Architecture Style

### Selected Architecture: Layered Monolith

MatchProof uses a **Layered (N-Tier) Monolithic Architecture** organized into four distinct layers:

| Layer | Responsibility |
|---|---|
| **Presentation Layer** | React SPA — user interface, routing, state management |
| **API Layer** | Express.js REST endpoints — request handling, auth guards |
| **Business Logic Layer** | Service modules — validation, authorization, AI matching |
| **Data Access Layer** | Model modules — SQL queries, database interaction |

### Why Layered Monolith?

| Factor | Decision |
|---|---|
| Team size | 5 members — single deployment unit is manageable |
| Timeline | 10-week project — microservices overhead not justified |
| Complexity | Course-scoped system — distributed tracing/service mesh unnecessary |
| Extensibility | Layers are independently modifiable; AI module is isolated as a service |

This architecture aligns with the Assignment 2 design decision rationale: maintainability and demonstrability are prioritized over distributed-system complexity.

---

## 2. System Overview

```
Browser
  │
  ▼
React SPA (src/client/)
  │  AuthContext · ToastContext · React Router
  │  Pages: Auth · Search · PostForm · Detail · Admin
  │  API Client (fetch + credentials)
  │
  ▼  HTTP / REST (port 3000 → proxy → 3001)
Express Server (src/server/)
  │  Session middleware · CORS · Multer
  │  Routes: /api/auth · /api/items · /api/moderation
  │
  ▼
Service Layer
  │  AuthService · ItemsService · SearchService
  │  MatchingService · ModerationService · UploadService
  │
  ▼
Model Layer
  │  UserModel · ItemModel · ModerationActionModel
  │
  ▼
PostgreSQL Database          File Storage (uploads/)
```

---

## 3. Component Diagram

```mermaid
graph TB
    subgraph Browser["Presentation Layer (Browser)"]
        direction TB
        Pages["Pages\nAuthPage · SearchPage\nDetailPage · PostFormPage\nAdminPage"]
        Components["Components\nHeader · UI Library"]
        AuthCtx["AuthContext\nuser · login · logout · register"]
        ToastCtx["ToastContext\nshowToast"]
        APIClient["API Client\nAuth · Items · Moderation"]
    end

    subgraph Server["API + Business Logic Layer (Node.js)"]
        direction TB
        AuthRoutes["/api/auth"]
        ItemRoutes["/api/items"]
        ModRoutes["/api/moderation"]
        AuthSvc["AuthService\nregister · login · logout · me"]
        ItemSvc["ItemsService\ncreate · get · update · delete\nstatus · search"]
        MatchSvc["MatchingService\ntextSimilarity · imageSimilarity\nrankCandidates · generateReasons"]
        ModSvc["ModerationService\nremovePost"]
        UploadSvc["UploadService\nvalidate · store · delete"]
        Session["Session Middleware\ncookie-based · PostgreSQL store"]
    end

    subgraph Data["Data Layer"]
        UserModel["UserModel"]
        ItemModel["ItemModel"]
        ModModel["ModerationActionModel"]
        DB[("PostgreSQL\nusers · items\nmoderation_actions\nuser_sessions")]
        Storage[("File Storage\nuploads/")]
    end

    Pages --> AuthCtx
    Pages --> ToastCtx
    Pages --> APIClient
    Components --> AuthCtx

    APIClient -->|"HTTP REST\ncredentials: include"| AuthRoutes
    APIClient --> ItemRoutes
    APIClient --> ModRoutes

    AuthRoutes --> Session
    ItemRoutes --> Session
    ModRoutes --> Session

    AuthRoutes --> AuthSvc
    ItemRoutes --> ItemSvc
    ItemRoutes --> MatchSvc
    ModRoutes --> ModSvc

    ItemSvc --> UploadSvc
    ModSvc --> UploadSvc

    AuthSvc --> UserModel
    ItemSvc --> ItemModel
    MatchSvc --> ItemModel
    ModSvc --> ItemModel
    ModSvc --> ModModel

    UserModel --> DB
    ItemModel --> DB
    ModModel --> DB
    UploadSvc --> Storage
    Session --> DB
```

---

## 4. Class Diagram

### 4.1 Core Domain Entities

```mermaid
classDiagram
    class User {
        +id : bigint
        +name : string
        +email : string
        +passwordHash : string
        +role : string
        +createdAt : timestamp
        +updatedAt : timestamp
    }

    class Item {
        +id : bigint
        +ownerId : bigint
        +itemType : string
        +title : string
        +description : string
        +category : string
        +location : string
        +status : string
        +imagePath : string
        +isPrivate : boolean
        +createdAt : timestamp
        +updatedAt : timestamp
    }

    class ModerationAction {
        +id : bigint
        +itemId : bigint
        +adminUserId : bigint
        +reason : string
        +actionType : string
        +createdAt : timestamp
    }

    class MatchResult {
        +itemId : bigint
        +score : float
        +reasons : string[]
        +matchedFields : MatchedFields
        +item : ItemSummary
    }

    class MatchedFields {
        +category : boolean
        +location : boolean
        +textSimilarity : float
        +imageSimilarity : float
        +stage1Score : float
    }

    User "1" --> "0..*" Item : owns
    User "1" --> "0..*" ModerationAction : performs
    Item "1" --> "0..*" ModerationAction : subject of
    Item "1" --> "0..*" MatchResult : produces
    MatchResult "1" --> "1" MatchedFields : contains
```

### 4.2 Service Layer

```mermaid
classDiagram
    class AuthService {
        +register(payload) User
        +login(payload) User
        +getCurrentUser(userId) User
        -validateRegistrationInput(payload) void
        -validateLoginInput(payload) void
    }

    class ItemsService {
        +createItem(userId, payload, file) Item
        +getItemById(itemId, ctx) Item
        +updateItem(itemId, userId, payload, file) Item
        +deleteItem(itemId, userId) void
        +updateStatus(itemId, userId, status) Item
        +searchItems(queryParams) PagedResult
        +getItemMatches(itemId, ctx) MatchResponse
    }

    class MatchingService {
        +getMatchesForItem(itemId, itemModel, limit) MatchResponse
        -textSimilarity(itemA, itemB) float
        -imageSimilarity(pathA, pathB) float
        -locationSimilarity(locA, locB) float
        -categoryMatch(itemA, itemB) int
        -recencyScore(dateA, dateB) float
        -scoreMatchStage1(item, candidate) Stage1Result
        -scoreMatchStage2(item, candidate, stage1) MatchScore
        -generateReasons(item, candidate, details) string[]
    }

    class ModerationService {
        +removePost(adminUserId, itemId, reason) ModerationResult
    }

    class UploadService {
        +singleImageUpload : Middleware
        +deleteStoredImage(filename) void
        +toPublicImageUrl(path) string
    }

    ItemsService --> MatchingService : delegates matching
    ItemsService --> UploadService : delegates upload
    ModerationService --> UploadService : delegates cleanup
```

### 4.3 AI Matching – Strategy Pattern

```mermaid
classDiagram
    class SimilarityStrategy {
        <<interface>>
        +compute(itemA, itemB) float
    }

    class TextSimilarityStrategy {
        +compute(itemA, itemB) float
        -getEmbedding(text) float[]
        -cosineSimilarity(vecA, vecB) float
        -meanPoolEmbedding(output) float[]
    }

    class ImageSimilarityStrategy {
        +compute(itemA, itemB) float
        -getImageSignature(path) ImageSignature
        -buildAverageHash(pixels) string
        -buildDifferenceHash(pixels, w, h) string
        -buildColorHistogram(pixels, channels) float[]
    }

    class CategorySimilarityStrategy {
        +compute(itemA, itemB) float
    }

    class LocationSimilarityStrategy {
        +compute(itemA, itemB) float
        -tokenizeLocation(loc) string[]
        -jaccardSimilarity(a, b) float
    }

    class RecencyScoringStrategy {
        +compute(itemA, itemB) float
    }

    SimilarityStrategy <|.. TextSimilarityStrategy
    SimilarityStrategy <|.. ImageSimilarityStrategy
    SimilarityStrategy <|.. CategorySimilarityStrategy
    SimilarityStrategy <|.. LocationSimilarityStrategy
    SimilarityStrategy <|.. RecencyScoringStrategy

    MatchingService --> SimilarityStrategy : uses
```

---

## 5. Sequence Diagrams

### 5.1 User Login

```mermaid
sequenceDiagram
    actor User
    participant AuthPage
    participant AuthContext
    participant APIClient
    participant AuthRoute
    participant AuthService
    participant UserModel
    participant DB

    User->>AuthPage: enter email + password, click Login
    AuthPage->>AuthContext: login(payload)
    AuthContext->>APIClient: Auth.login(payload)
    APIClient->>AuthRoute: POST /api/auth/login
    AuthRoute->>AuthService: loginUser(payload)
    AuthService->>UserModel: findUserByEmail(email)
    UserModel->>DB: SELECT * FROM users WHERE email = $1
    DB-->>UserModel: user row
    UserModel-->>AuthService: user
    AuthService->>AuthService: bcrypt.compare(password, hash)
    AuthService-->>AuthRoute: user
    AuthRoute->>AuthRoute: session.regenerate()
    AuthRoute->>AuthRoute: session.userId = user.id
    AuthRoute-->>APIClient: 200 { user }
    APIClient-->>AuthContext: user object
    AuthContext->>AuthContext: setUser(user)
    AuthContext-->>AuthPage: user set
    AuthPage->>AuthPage: navigate("/")
```

### 5.2 Create Lost/Found Post

```mermaid
sequenceDiagram
    actor User
    participant PostFormPage
    participant APIClient
    participant ItemRoute
    participant SessionMiddleware
    participant ItemsService
    participant UploadService
    participant ItemModel
    participant DB
    participant Storage

    User->>PostFormPage: fill form + select image, click Save
    PostFormPage->>APIClient: Items.create(form, imageFile)
    APIClient->>ItemRoute: POST /api/items (multipart/form-data)
    ItemRoute->>SessionMiddleware: requireAuth
    SessionMiddleware-->>ItemRoute: session.userId
    ItemRoute->>UploadService: singleImageUpload (multer)
    UploadService->>Storage: validate + save image
    Storage-->>UploadService: filename
    ItemRoute->>ItemsService: createItem(userId, payload, file)
    ItemsService->>ItemsService: validatePayload()
    ItemsService->>ItemModel: createItem(data)
    ItemModel->>DB: INSERT INTO items ...
    DB-->>ItemModel: { id }
    ItemModel->>DB: SELECT item with owner JOIN
    DB-->>ItemModel: full item row
    ItemModel-->>ItemsService: item
    ItemsService-->>ItemRoute: publicItem
    ItemRoute-->>APIClient: 201 { item }
    APIClient-->>PostFormPage: item
    PostFormPage->>PostFormPage: navigate("/items/:id")
```

### 5.3 AI-Assisted Match

```mermaid
sequenceDiagram
    actor User
    participant DetailPage
    participant APIClient
    participant ItemRoute
    participant ItemsService
    participant MatchingService
    participant ItemModel
    participant DB

    User->>DetailPage: open item detail page
    DetailPage->>APIClient: Items.get(itemId)
    APIClient->>ItemRoute: GET /api/items/:itemId
    ItemRoute-->>APIClient: 200 { item }
    APIClient-->>DetailPage: item loaded

    DetailPage->>APIClient: Items.getMatches(itemId)
    APIClient->>ItemRoute: GET /api/items/:itemId/matches
    ItemRoute->>ItemsService: getItemMatches(itemId, ctx)
    ItemsService->>MatchingService: getMatchesForItem(itemId, itemModel, limit=3)
    MatchingService->>ItemModel: findItemById(itemId)
    ItemModel->>DB: SELECT item
    DB-->>ItemModel: source item
    MatchingService->>ItemModel: findMatchCandidates(oppositeType, open)
    ItemModel->>DB: SELECT candidates
    DB-->>ItemModel: candidate list

    loop For each candidate
        MatchingService->>MatchingService: scoreMatchStage1(item, candidate)
        Note right of MatchingService: textSimilarity (embeddings)<br/>categoryMatch<br/>locationSimilarity<br/>recencyScore
    end

    MatchingService->>MatchingService: filter stage1Score >= 0.15, top 10

    loop For each stage1 match
        MatchingService->>MatchingService: scoreMatchStage2(item, candidate)
        Note right of MatchingService: imageSimilarity (perceptual hash)<br/>finalScore = 0.8*imageSim + 0.2*stage1
        MatchingService->>MatchingService: generateReasons(details)
    end

    MatchingService-->>ItemsService: { sourceItemId, matches[] }
    ItemsService-->>ItemRoute: publicMatchResponse
    ItemRoute-->>APIClient: 200 { matches }
    APIClient-->>DetailPage: matches array
    DetailPage->>DetailPage: render AI Possible Matches section
```

### 5.4 Admin Remove Post

```mermaid
sequenceDiagram
    actor Admin
    participant AdminPage
    participant APIClient
    participant ModRoute
    participant RequireAdmin
    participant ModerationService
    participant ItemModel
    participant ModModel
    participant UploadService
    participant DB
    participant Storage

    Admin->>AdminPage: click Remove, enter reason, confirm
    AdminPage->>APIClient: Moderation.removePost(itemId, reason)
    APIClient->>ModRoute: POST /api/moderation/items/:itemId/remove
    ModRoute->>RequireAdmin: check session.userRole === 'admin'
    RequireAdmin-->>ModRoute: authorized
    ModRoute->>ModerationService: removePost(adminUserId, itemId, reason)
    ModerationService->>ItemModel: findItemById(itemId)
    ItemModel->>DB: SELECT item
    DB-->>ItemModel: item (with imagePath)
    ModerationService->>ItemModel: markItemAsRemovedById(itemId)
    ItemModel->>DB: UPDATE items SET status='removed', image_path=NULL
    ModerationService->>ModModel: createModerationAction(data)
    ModModel->>DB: INSERT INTO moderation_actions
    ModerationService->>UploadService: deleteStoredImage(imagePath)
    UploadService->>Storage: unlink file
    ModerationService-->>ModRoute: { item, moderationAction }
    ModRoute-->>APIClient: 200 { item, moderationAction }
    APIClient-->>AdminPage: success
    AdminPage->>AdminPage: showToast + refresh list
```

---

## 6. Deployment Diagram

```mermaid
graph TB
    subgraph Developer["Developer Machine / Single Server"]
        direction TB
        subgraph FE["Frontend Process (Vite Dev Server :3000)"]
            ReactApp["React SPA\nsrc/client/"]
        end

        subgraph BE["Backend Process (Node.js :3001)"]
            ExpressApp["Express App\nsrc/server/"]
            SessionStore["Session Store\n(connect-pg-simple)"]
        end

        subgraph DB["Database Process"]
            PG[("PostgreSQL :5432\nmatchproof DB\n─────────────\nusers\nitems\nmoderation_actions\nuser_sessions\nschema_migrations")]
        end

        subgraph FS["File System"]
            Uploads["uploads/\n(item images)"]
        end

        ReactApp -->|"proxy /api → :3001"| ExpressApp
        ExpressApp --> SessionStore
        SessionStore --> PG
        ExpressApp --> PG
        ExpressApp --> Uploads
    end

    Browser["Browser\n(Chrome / Firefox / Edge)"] -->|":3000"| ReactApp
```

> **Note:** This deployment reflects the current development setup. Both frontend and backend run on the same machine. A production deployment would place the built React bundle behind a static file server (e.g., nginx) and run the Node.js backend as a separate process, both pointing to the same PostgreSQL instance.

---

## 7. Component Interfaces

### 7.1 API Client → Backend

All requests use `credentials: 'include'` for session cookie propagation.

| Interface | Input | Output |
|---|---|---|
| `Auth.register(payload)` | `{ name, email, password }` | `{ user }` |
| `Auth.login(payload)` | `{ email, password }` | `{ user }` |
| `Auth.logout()` | — | `204 No Content` |
| `Auth.me()` | — | `{ user }` |
| `Items.search(filters)` | `{ query, category, itemType, status, dateFrom, dateTo, page, pageSize }` | `{ items[], pagination, filters }` |
| `Items.get(itemId)` | `itemId: string` | `{ item }` |
| `Items.create(data, imageFile)` | `FormData { itemType, title, category, location, description, image? }` | `{ item }` |
| `Items.update(itemId, data, imageFile)` | `FormData (partial fields + image?)` | `{ item }` |
| `Items.delete(itemId)` | `itemId: string` | `204 No Content` |
| `Items.updateStatus(itemId, status)` | `{ status: 'claimed' \| 'resolved' }` | `{ item }` |
| `Items.getMatches(itemId)` | `itemId: string` | `{ sourceItemId, sourceItemType, matches[] }` |
| `Moderation.removePost(itemId, reason)` | `{ reason: string }` | `{ item, moderationAction }` |

### 7.2 Service Layer Interfaces

| Service | Method | Input | Output |
|---|---|---|---|
| AuthService | `registerUser(payload)` | `{ name, email, password }` | `User` |
| AuthService | `loginUser(payload)` | `{ email, password }` | `User` |
| AuthService | `getCurrentUser(userId)` | `userId: number` | `User` |
| ItemsService | `createItem({ userId, payload, file })` | userId, validated fields, optional file | Public `Item` |
| ItemsService | `getItemById(itemId, { userId, userRole })` | itemId, auth context | Public `Item` |
| ItemsService | `searchItems(queryParams)` | filter params | `{ items[], pagination, filters }` |
| ItemsService | `updateStatus({ itemId, userId, status })` | itemId, userId, next status | Public `Item` |
| ItemsService | `updateItem({ itemId, userId, payload, file })` | itemId, userId, partial update | Public `Item` |
| ItemsService | `deleteItem({ itemId, userId })` | itemId, userId | `void` |
| ItemsService | `getItemMatches({ itemId, userId, userRole })` | itemId, auth context | Match response |
| MatchingService | `getMatchesForItem({ itemId, itemModel, limit })` | itemId, model ref, limit | `{ sourceItemId, sourceItemType, matches[] }` |
| ModerationService | `removePost({ adminUserId, itemId, reason })` | adminId, itemId, reason string | `{ item, moderationAction }` |

### 7.3 Data Models

| Model | Key Methods |
|---|---|
| UserModel | `createUser`, `findUserByEmail`, `findUserById` |
| ItemModel | `createItem`, `findItemById`, `searchItems`, `updateItemById`, `updateItemStatusById`, `markItemAsRemovedById`, `deleteItemById`, `findMatchCandidates` |
| ModerationActionModel | `createModerationAction` |
