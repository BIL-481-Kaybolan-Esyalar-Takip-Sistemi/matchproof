# MatchProof Test Strategy

## Table of Contents
- [1. Overview](#1-overview)
- [2. Test Layers](#2-test-layers)
- [3. E2E Environment](#3-e2e-environment)
- [4. Commands](#4-commands)
- [5. Covered Flows](#5-covered-flows)

## 1. Overview

MatchProof test strategy is organized in three layers:

1. **Backend Jest tests** for services, models, middleware, and route contracts
2. **Frontend Jest tests** for page-level component behavior
3. **Playwright E2E tests** for real user flows across frontend and backend

This structure keeps fast regression checks while also validating real browser behavior.

## 2. Test Layers

### Backend Jest

Backend tests cover:

- authentication rules
- item create, update, delete, search, and status logic
- moderation flow
- matching service contract
- route-level error contracts

### Frontend Jest

Frontend tests cover:

- `AuthPage`
- `SearchPage`
- `PostFormPage`
- `DetailPage`
- `AdminPage`

These tests validate UI behavior and API usage patterns at component level.

### Playwright E2E

Playwright validates complete user flows in a real browser:

- register and login
- create a new lost item post
- search and open the created item
- view AI possible matches
- update item status from `open` to `claimed` to `resolved`
- remove a post through the admin moderation panel

## 3. E2E Environment

E2E uses a deterministic test environment:

- backend runs in `NODE_ENV=test`
- `MATCHING_MODE=stub` is enabled for predictable AI match results
- test data is reset and seeded before the backend starts
- default test database URL is `pg-mem://matchproof_e2e`

Seeded data includes:

- one admin user
- one normal user
- open lost/found fixtures
- one removed item fixture
- one moderation target fixture

If needed, `DATABASE_URL_TEST` can also point to a real PostgreSQL test database instead of the default in-memory setup.

## 4. Commands

```bash
npm run test:unit
npm run test:e2e
npm run test:all
```

Command summary:

- `test:unit` → backend + frontend Jest suites
- `test:e2e` → Playwright browser tests
- `test:all` → full verification pipeline

CI summary:

- `.github/workflows/ci.yml` runs `npm run test:unit` on push and pull request events
- browser-level E2E remains a local/pre-release verification step because it is heavier than the baseline CI gate

## 5. Covered Flows

The current automated strategy is intended to catch:

- broken API contracts
- frontend regressions in page behavior
- authentication/session problems
- invalid item status transitions
- moderation authorization problems
- missing or unstable AI match rendering in the detail page
