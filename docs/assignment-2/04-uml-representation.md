# 04 - UML Representation (Mandatory)

This document presents the selected Layered Monolithic Architecture with high-level UML diagrams.

## 1) Component Diagram

```mermaid
flowchart LR
  UI[Client UI\nReact]
  API[REST API\nExpress Routes]
  AUTH[Auth Service]
  ITEMS[Items Service]
  SEARCH[Search Service]
  MATCH[Matching Service]
  MOD[Moderation Service]
  DB[(PostgreSQL)]
  UP[(Upload Storage)]

  UI --> API
  API --> AUTH
  API --> ITEMS
  API --> SEARCH
  API --> MATCH
  API --> MOD

  AUTH --> DB
  ITEMS --> DB
  SEARCH --> DB
  MATCH --> DB
  MATCH --> UP
  MOD --> DB
  ITEMS --> UP
```

## 2) Class Diagram

```mermaid
classDiagram
  class User {
    +id: UUID
    +email: string
    +passwordHash: string
    +role: string
    +createdAt: datetime
  }

  class Item {
    +id: UUID
    +ownerId: UUID
    +type: string
    +title: string
    +description: string
    +category: string
    +status: string
    +imageUrl: string
    +createdAt: datetime
  }

  class ModerationAction {
    +id: UUID
    +adminId: UUID
    +itemId: UUID
    +action: string
    +reason: string
    +createdAt: datetime
  }

  class AuthService {
    +register(name, email, password): User
    +login(email, password): Session
    +logout(sessionId): void
    +me(sessionId): User
  }

  class ItemsService {
    +createItem(userId, payload, image): Item
    +updateItem(userId, itemId, payload): Item
    +deleteItem(userId, itemId): void
    +updateStatus(userId, itemId, status): Item
    +getItemById(requestUserId, requestUserRole, itemId): Item
  }

  class SearchService {
    +search(filters): Item[]
  }

  class MatchingService {
    +rankCandidates(itemId, limit): MatchCandidate[]
    +explainMatch(itemAId, itemBId): string
  }

  class ModerationService {
    +removePost(adminId, itemId, reason): ModerationAction
  }

  User "1" --> "many" Item : owns
  User "1" --> "many" ModerationAction : performs
  Item "1" --> "many" ModerationAction : target
```

## 3) Sequence Diagram

Use case: A user performs a search and views matched listings.

```mermaid
sequenceDiagram
  actor U as User
  participant UI as React UI
  participant API as /api/items/search
  participant SS as SearchService
  participant MS as MatchingService
  participant DB as PostgreSQL

  U->>UI: Enters keyword + filters, clicks Find
  UI->>API: GET /api/items/search?query&category&page
  API->>SS: search(filters)
  SS->>DB: SELECT items with filters
  DB-->>SS: candidate rows
  SS->>MS: rankCandidates(referenceItem, limit)
  MS-->>SS: ranked scores + reasons
  SS-->>API: paged ranked result
  API-->>UI: 200 OK + list
  UI-->>U: Results + explanations
```

## 4) Deployment Diagram

```mermaid
flowchart TB
  subgraph ClientMachine[Client Machine]
    B[Browser]
  end

  subgraph AppMachine[Application Machine]
    FE[Vite/React Frontend]
    BE[Node.js Express Backend]
  end

  subgraph DataMachine[Data Machine]
    PG[(PostgreSQL)]
    FS[(Uploads File Storage)]
  end

  B --> FE
  FE --> BE
  BE --> PG
  BE --> FS
```

## UML Scope Note
These diagrams provide a high-level representation for the first phase. Internal component details will be expanded in later iterations.
