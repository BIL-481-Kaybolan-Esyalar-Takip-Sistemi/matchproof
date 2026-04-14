# 05 - Design Document (Initial Phase)

## Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Initial architecture summary writing | Yiğit Yıldız | - | Completed |
| High-level component structure definition | Yiğit Yıldız | - | Completed |
| Component interface descriptions | Yiğit Yıldız | - | Completed |
| Interface input/output specification | Yiğit Yıldız | - | Completed |
| Initial phase scope boundary definition | Yiğit Yıldız | - | Completed |

## 1. Selected Software Architecture
- Architecture: Layered Monolithic Architecture
- Goal: Fast delivery, clear layering, straightforward testing, and simple deployment.

## 2. High-Level Component Structure
1. Client UI (React)
2. API Gateway/Routes (Express)
3. Auth Component
4. Item Management Component
5. Search Component
6. Matching Component
7. Moderation Component
8. Persistence Component (PostgreSQL + Upload Storage)

## 3. Interfaces Between Components

### 3.1 UI -> API
- HTTP/JSON REST requests
- Session cookie/header for authenticated requests

### 3.2 API -> Services
- Route handlers are responsible for calling service methods.
- Input validation starts in the API layer, while business rules are enforced in the service layer.

### 3.3 Services -> Data Layer
- CRUD operations through model functions
- Service-level transaction control where required

## 4. Interface Input/Output Parameters

### Auth
- POST /api/auth/register
  - Input: { name, email, password }
  - Output: { user: { id, name, email, role } }
- POST /api/auth/login
  - Input: { email, password }
  - Output: { user, session }
- POST /api/auth/logout
  - Input: session
  - Output: { ok: true }

### Items
- POST /api/items
  - Input: { type, title, description, category, location, date }, imageFile?
  - Output: { item }
- PATCH /api/items/:itemId
  - Input: partial item payload
  - Output: { item }
- DELETE /api/items/:itemId
  - Input: path param itemId
  - Output: { ok: true }
- PATCH /api/items/:itemId/status
  - Input: { status }
  - Output: { item }
- GET /api/items/:itemId
  - Input: path param itemId
  - Output: { itemDetail }

### Search
- GET /api/items/search
  - Input (query): { q, category, dateFrom, dateTo, status, page, limit }
  - Output: { items, page, total }

### Matching
- GET /api/items/:itemId/matches
  - Input: path param itemId, query { limit }
  - Output: { matches: [{ itemId, score, reason }] }

### Moderation
- POST /api/moderation/items/:itemId/remove
  - Input: { reason }
  - Output: { actionId, removedItemId, removedBy, reason }

## 5. Initial Phase Scope Boundary
This version is intentionally high-level. Internal class-level details, error scenarios, and performance optimizations will be refined in later sprints.
