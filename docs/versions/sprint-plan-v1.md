# MatchProof – Sprint Plan v1

**Project Name:** MatchProof
**Course:** BIL 481
**Version:** 1.0
**Date:** 2026-03-10

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Elif Beyza Turan
- Zehra Atalay

---

## Table of Contents

- [Overview](#overview)
- [Sprint 1 – Foundation](#sprint-1--foundation)
- [Sprint 2 – Core Backend](#sprint-2--core-backend)
- [Sprint 3 – Frontend Integration](#sprint-3--frontend-integration)
- [Sprint 4 – AI Matching](#sprint-4--ai-matching)
- [Sprint 5 – QA and Polish](#sprint-5--qa-and-polish)
- [Backlog Coverage Summary](#backlog-coverage-summary)

---

## Overview

| Sprint | Dates | Goal | Status |
|---|---|---|---|
| Sprint 1 | 2026-02-16 → 2026-03-01 | Backend foundation: auth, DB, sessions | Done |
| Sprint 2 | 2026-03-02 → 2026-03-08 | Items CRUD, image upload, search | Done |
| Sprint 3 | 2026-03-09 → 2026-03-22 | Frontend setup, all pages integrated | Done |
| Sprint 4 | 2026-03-23 → 2026-03-29 | AI matching module + frontend display | Done |
| Sprint 5 | 2026-03-30 → 2026-04-06 | QA, cross-browser, polish, docs | In Progress |

**Methodology:** Agile / Scrum-lite
**Sprint length:** 1–2 weeks
**Ceremony cadence:** sprint planning at start, retrospective at end, daily stand-up async (team chat)

---

## Sprint 1 – Foundation

**Dates:** 2026-02-16 → 2026-03-01
**Goal:** Establish the full backend foundation — database schema, sessions, and authentication endpoints working end-to-end.
**Status:** Done

### Sprint Backlog

| SB-ID | PB-ID | Task | Owner | Status |
|---|---|---|---|---|
| S1-1 | PB1 | Set up Express server with CORS, session middleware, error handler | Alp Eren Köksal | Done |
| S1-2 | PB1 | Design and write PostgreSQL migration files (users, items, sessions, moderation_actions) | Alp Eren Köksal | Done |
| S1-3 | PB1 | Implement UserModel (createUser, findUserByEmail, findUserById) | Alp Eren Köksal | Done |
| S1-4 | PB1 | Implement AuthService (register, login, getCurrentUser, bcrypt hashing) | Alp Eren Köksal | Done |
| S1-5 | PB1 | Implement auth routes: POST /register, POST /login, POST /logout, GET /me | Alp Eren Köksal | Done |
| S1-6 | PB1 | Implement requireAuth and requireAdmin middleware | Yiğit Yıldız | Done |
| S1-7 | PB18 | Implement session-based authorization guards | Yiğit Yıldız | Done |
| S1-8 | — | Set up Jest test infrastructure (jest.config, babel, setup-env) | Zehra Atalay | Done |
| S1-9 | — | Write unit tests: AuthService, requireAuth, requireAdmin | Zehra Atalay | Done |

### Definition of Done – Sprint 1
- [ ] `npm run db:migrate` creates all required tables from scratch
- [ ] `POST /api/auth/register` creates a user and returns session cookie
- [ ] `POST /api/auth/login` validates credentials and sets session
- [ ] `GET /api/auth/me` returns current user for authenticated session
- [ ] `POST /api/auth/logout` destroys session
- [ ] All Sprint 1 tests pass (`npm test`)

---

## Sprint 2 – Core Backend

**Dates:** 2026-03-02 → 2026-03-08
**Goal:** Complete items CRUD, image upload pipeline, search with filters and pagination, moderation endpoint, and status lifecycle.
**Status:** Done

### Sprint Backlog

| SB-ID | PB-ID | Task | Owner | Status |
|---|---|---|---|---|
| S2-1 | PB2, PB3 | Implement ItemModel (createItem, findItemById, deleteItemById, updateItemById) | Alp Eren Köksal | Done |
| S2-2 | PB5, PB6 | Implement ItemModel.searchItems (keyword, category, itemType, status, date, pagination) | Alp Eren Köksal | Done |
| S2-3 | PB4 | Implement UploadService (multer, mime validation, 5 MB limit, filename generation) | Alp Eren Köksal | Done |
| S2-4 | PB2, PB3, PB4, PB10 | Implement ItemsService (createItem, getItemById, updateItem, deleteItem) | Alp Eren Köksal | Done |
| S2-5 | PB7 | Implement ItemsService.updateStatus with allowed transition validation | Alp Eren Köksal | Done |
| S2-6 | PB5, PB6 | Implement ItemsService.searchItems with filter parsing and pagination | Alp Eren Köksal | Done |
| S2-7 | PB9 | Implement ModerationService and ModerationActionModel | Yiğit Yıldız | Done |
| S2-8 | PB9 | Implement POST /api/moderation/items/:itemId/remove (admin-only) | Yiğit Yıldız | Done |
| S2-9 | PB2, PB3, PB4, PB5, PB6, PB7, PB10 | Implement all items routes with upload middleware | Alp Eren Köksal | Done |
| S2-10 | PB18 | Write unit tests: ItemsService, ModerationService | Zehra Atalay | Done |
| S2-11 | PB18 | Write integration tests: API routes (supertest) | Zehra Atalay | Done |

### Definition of Done – Sprint 2
- [ ] `POST /api/items` creates item with optional image upload
- [ ] `GET /api/items/search` returns filtered, paginated results (removed items excluded)
- [ ] `PATCH /api/items/:itemId/status` enforces open→claimed→resolved transitions
- [ ] `DELETE /api/items/:itemId` is restricted to the owner
- [ ] `POST /api/moderation/items/:itemId/remove` requires admin role and reason
- [ ] All Sprint 2 tests pass

---

## Sprint 3 – Frontend Integration

**Dates:** 2026-03-09 → 2026-03-22
**Goal:** Build complete React frontend — all pages implemented, API client connected, auth and toast contexts working, Vite dev server configured.
**Status:** Done

### Sprint Backlog

| SB-ID | PB-ID | Task | Owner | Status |
|---|---|---|---|---|
| S3-1 | — | Set up Vite + React, vite.config.js with proxy, index.html | Elif Beyza Turan | Done |
| S3-2 | PB1 | Implement `src/client/api/index.js` (Auth, Items, Moderation clients) | Elif Beyza Turan | Done |
| S3-3 | PB1 | Implement `src/client/context/AuthContext.jsx` (user, login, register, logout, me) | Elif Beyza Turan | Done |
| S3-4 | — | Implement `src/client/context/ToastContext.jsx` (showToast, toast display) | Elif Beyza Turan | Done |
| S3-5 | PB1 | Connect AuthPage to AuthContext (login + register forms) | Elif Beyza Turan | Done |
| S3-6 | PB5, PB6 | Connect SearchPage to Items.search (filters, pagination) | Elif Beyza Turan | Done |
| S3-7 | PB2, PB3, PB4, PB10 | Connect PostFormPage to Items.create + Items.update (multipart upload) | Elif Beyza Turan | Done |
| S3-8 | PB7, PB8 | Connect DetailPage to Items.get, Items.updateStatus, Items.delete | Elif Beyza Turan | Done |
| S3-9 | PB9 | Connect AdminPage to Items.search + Moderation.removePost | Elif Beyza Turan | Done |
| S3-10 | PB16 | Implement Header with user info, nav links, logout | Elif Beyza Turan | Done |
| S3-11 | PB16 | Add route guards (ProtectedRoute) and auth-based navigation | Elif Beyza Turan | Done |
| S3-12 | — | Write frontend unit tests: AuthPage, SearchPage | Zehra Atalay | Done |
| S3-13 | — | Fix useEffect dependency warnings (SearchPage, AdminPage) | Elif Beyza Turan | Done |

### Definition of Done – Sprint 3
- [ ] `npm run dev:client` starts Vite dev server on port 3000
- [ ] User can register, login, and see session persist on page refresh
- [ ] User can browse, filter, and search items
- [ ] User can create a post with photo upload
- [ ] User can view detail page, update status, edit, and delete own posts
- [ ] Admin can remove posts from the admin panel
- [ ] Toast notifications appear for all user actions

---

## Sprint 4 – AI Matching

**Dates:** 2026-03-23 → 2026-03-29
**Goal:** Implement and integrate the full AI matching pipeline — text embeddings, perceptual image hashing, combined scoring, explainable reasons, and the "AI Possible Matches" section on the detail page.
**Status:** Done

### Sprint Backlog

| SB-ID | PB-ID | Task | Owner | Status |
|---|---|---|---|---|
| S4-1 | PB11 | Implement image signature computation (averageHash, differenceHash, colorHistogram) using sharp | Mehmet Gür | Done |
| S4-2 | PB12 | Implement text embedding pipeline using Xenova/all-MiniLM-L6-v2 with caching | Mehmet Gür | Done |
| S4-3 | PB12 | Implement cosine similarity, mean pooling, category match, location Jaccard similarity | Mehmet Gür | Done |
| S4-4 | PB12 | Implement Stage 1 scoring (text 50% + category 25% + location 15% + recency 10%) | Mehmet Gür | Done |
| S4-5 | PB12 | Implement Stage 2 scoring (image similarity blended with Stage 1) | Mehmet Gür | Done |
| S4-6 | PB14 | Implement generateReasons() to produce human-readable match explanations | Mehmet Gür | Done |
| S4-7 | PB12 | Implement ItemModel.findMatchCandidates for opposite item type lookup | Mehmet Gür | Done |
| S4-8 | PB13 | Implement GET /api/items/:itemId/matches endpoint | Mehmet Gür | Done |
| S4-9 | PB13 | Add AI Possible Matches section to DetailPage (MatchCard, MatchScore, reasons) | Elif Beyza Turan | Done |
| S4-10 | PB19 | Write unit tests for MatchingService (mocked transformers + sharp) | Zehra Atalay | Done |
| S4-11 | — | Add sample data pairs to DB for testing AI matching | Elif Beyza Turan | Done |

### Definition of Done – Sprint 4
- [ ] `GET /api/items/:itemId/matches` returns ranked matches with scores and reasons
- [ ] Detail page shows "AI Possible Matches" section with score bars and reason tags
- [ ] Lost items match against found items and vice versa
- [ ] Removed/resolved items are excluded from match candidates
- [ ] MatchingService unit tests pass

---

## Sprint 5 – QA and Polish

**Dates:** 2026-03-30 → 2026-04-06
**Goal:** Cross-browser verification, QA test execution, documentation completion, final review.
**Status:** In Progress

### Sprint Backlog

| SB-ID | PB-ID | Task | Owner | Status |
|---|---|---|---|---|
| S5-1 | PB17 | Verify application on Firefox and Edge (desktop) | Zehra Atalay | In Progress |
| S5-2 | PB15 | Measure and verify response times (search, post creation) | Zehra Atalay | In Progress |
| S5-3 | PB20 | Write and verify clean-setup documentation (env, migrate, run) | Zehra Atalay | In Progress |
| S5-4 | — | Architecture document (Component, Class, Sequence, Deployment UML) | Elif Beyza Turan | Done |
| S5-5 | — | Product Backlog v2 update with sprint assignments and status | Elif Beyza Turan | Done |
| S5-6 | — | Sprint Plan v1 document | Elif Beyza Turan | Done |
| S5-7 | — | End-to-end demo scenario preparation (UC1–UC4) | Yiğit Yıldız | In Progress |
| S5-8 | — | Final code review and bug triage | All | In Progress |
| S5-9 | — | Fix .env.example to use generic placeholder values | Elif Beyza Turan | Done |

### Definition of Done – Sprint 5
- [ ] All 20 Product Backlog items are Done or documented as deferred with justification
- [ ] `npm test` passes with 0 failures
- [ ] Application verified on Chrome, Firefox, and Edge
- [ ] Architecture, backlog, and sprint plan documents committed to `docs/assignment-3/`
- [ ] Demo script covers UC1 (register/login), UC2 (create post), UC3 (search + AI match), UC4 (claim/resolve + admin remove)

---

## Backlog Coverage Summary

| Sprint | PB Items Covered | Story Points |
|---|---|---|
| Sprint 1 | PB1, PB18 | 8 |
| Sprint 2 | PB2, PB3, PB4, PB5, PB6, PB7, PB9, PB10, PB18 | 21 |
| Sprint 3 | PB1, PB2, PB3, PB4, PB5, PB6, PB7, PB8, PB9, PB10, PB16 | 26 |
| Sprint 4 | PB11, PB12, PB13, PB14, PB19 | 26 |
| Sprint 5 | PB15, PB17, PB20 | 7 |
| **Total** | **PB1–PB20** | **88** |

> Story point totals reflect backlog estimates. Actual effort varies; AI model cold-start time is excluded from NFR1 response time measurement.
