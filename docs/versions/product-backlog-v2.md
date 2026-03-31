# MatchProof – Product Backlog v2

**Project Name:** MatchProof
**Course:** BIL 481
**Version:** 2.0
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
- Mehmet Gür

---

## Table of Contents

- [Introduction](#introduction)
- [Document-Specific Task Matrix](#document-specific-task-matrix)
- [Changes from v1](#changes-from-v1)
- [Product Backlog](#product-backlog)
- [Status Summary](#status-summary)

---

## Introduction

This is version 2 of the MatchProof Product Backlog. It extends the initial backlog from Assignment 1 (`docs/assignment-1/05-product-backlog.md`) with sprint assignments, implementation status, and refined acceptance criteria based on the actual system behavior established during Sprints 1–3.

Backlog items remain traced to baseline requirements FR1–FR14 and NFR1–NFR6.

---

## Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Status update for PB1–PB10 (backend/frontend items) | Elif Beyza Turan | Alp Eren Köksal | Completed |
| Status update for PB11–PB14 (AI items) | Mehmet Gür | — | Completed |
| Sprint assignment column | Elif Beyza Turan | — | Completed |
| Acceptance criteria refinement | Zehra Atalay | Yiğit Yıldız | Completed |
| Formatting and consistency check | Yiğit Yıldız | — | Completed |

---

## Changes from v1

| Change | Detail |
|---|---|
| Sprint column added | Each item is now assigned to a sprint |
| Status column added | Reflects implementation state as of 2026-03-31 |
| PB4 split | Image upload acceptance criteria clarified (5 MB limit, image/* only) |
| PB11 scope narrowed | Visual attribute extraction is done via perceptual hashing (not a CV classifier) |
| PB15 acceptance updated | Response time target verified for search and post creation |

---

## Product Backlog

| PB-ID | Epic | User Story / Work Item | Req. | Priority | SP | Sprint | Owner | Status |
|---:|---|---|---|---|---:|---:|---|---|
| PB1 | Auth | As a user, I can register with name/email/password and log in to the system. | FR1 | Must | 5 | 1 | Alp Eren Köksal | Done |
| PB2 | Core | As a user, I can create a lost item post with title, description, category, and location. | FR2 | Must | 3 | 2 | Elif Beyza Turan | Done |
| PB3 | Core | As a user, I can create a found item post with item details and discovery location. | FR3 | Must | 3 | 2 | Elif Beyza Turan | Done |
| PB4 | Core | As a user, I can upload a photo (JPEG/PNG/WEBP, max 5 MB) when creating or editing a post. | FR4 | Must | 5 | 2 | Alp Eren Köksal | Done |
| PB5 | Core | As a user, I can search listings using keywords matched against title and description. | FR5 | Must | 3 | 2 | Alp Eren Köksal | Done |
| PB6 | Core | As a user, I can filter listings by category, item type (lost/found), status, and date range. | FR6 | Must | 2 | 2 | Alp Eren Köksal | Done |
| PB7 | Core | As a post owner, I can mark my item as claimed (open→claimed) and then resolved (claimed→resolved). | FR7 | Must | 2 | 2 | Alp Eren Köksal | Done |
| PB8 | Core | As a user, I can view the name and email of the post owner on the item detail page. | FR8 | Must | 2 | 3 | Elif Beyza Turan | Done |
| PB9 | Admin | As an admin, I can remove inappropriate or duplicate posts with a mandatory reason. | FR9 | Should | 3 | 3 | Elif Beyza Turan | Done |
| PB10 | Core | As a post owner, I can edit or delete my own posts. | FR10 | Should | 3 | 2 | Alp Eren Köksal | Done |
| PB11 | AI | System computes a perceptual image signature (average hash, difference hash, color histogram) for uploaded photos. | FR11 | Should | 5 | 4 | Mehmet Gür | Done |
| PB12 | AI | System computes text similarity using sentence embeddings (Xenova/all-MiniLM-L6-v2) and image similarity using perceptual hashing; produces a combined weighted score. | FR12 | Should | 8 | 4 | Mehmet Gür | Done |
| PB13 | AI | System presents a ranked list (up to 3) of potential matching items on the item detail page. | FR13 | Should | 5 | 4 | Elif Beyza Turan | Done |
| PB14 | AI | System provides brief match explanations (e.g., "Same category", "Semantically similar description", "Close location"). | FR14 | Should | 5 | 4 | Mehmet Gür | Done |
| PB15 | Quality | Search and item creation respond within 2 seconds under normal load (excluding first AI model load). | NFR1 | Must | 3 | 5 | Zehra Atalay | Done |
| PB16 | Quality | Core flows (register, post, search, claim) are usable without technical knowledge; error states are shown. | NFR2 | Should | 3 | 3 | Elif Beyza Turan | Done |
| PB17 | Quality | Application works correctly on Chrome, Firefox, and Edge (desktop). | NFR3 | Must | 2 | 5 | Zehra Atalay | In Progress |
| PB18 | Quality | Users can only edit/delete their own posts; moderation endpoints require admin role. | NFR4 | Must | 3 | 2 | Yiğit Yıldız | Done |
| PB19 | Quality | AI matching module is decoupled (Strategy + CoR patterns) so similarity algorithms can be swapped independently. | NFR5 | Could | 3 | 4 | Mehmet Gür | Done |
| PB20 | Quality | Application starts correctly from a clean environment using documented setup steps. | NFR6 | Could | 2 | 5 | Zehra Atalay | In Progress |

---

## Status Summary

| Status | Count |
|---|---|
| Done | 18 |
| In Progress | 2 |
| Not Started | 0 |
| **Total** | **20** |

### Done (18/20)
PB1, PB2, PB3, PB4, PB5, PB6, PB7, PB8, PB9, PB10, PB11, PB12, PB13, PB14, PB15, PB18, PB19

### In Progress (2/20)
- **PB17** – Cross-browser verification pending (Firefox and Edge not yet tested)
- **PB20** – Deployment and availability checklist in progress
