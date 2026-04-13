# Product Backlog (Assignment 1)

## Document Authorship

**Document Title:** Product Backlog  
**Project Name:** MatchProof  
**Date:** 2026-02-06

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Mehmet Gür

---

## Table of Contents
- [Introduction](#introduction)
- [Document-Specific Task Matrix](#document-specific-task-matrix)
- [Backlog Format](#backlog-format)
- [Product Backlog](#product-backlog)
- [Notes and Constraints](#notes-and-constraints)

---

## Introduction

This document defines the initial Product Backlog for **MatchProof**, a campus lost & found digital board. Backlog items are traced to the baseline requirements (FR1–FR14, NFR1–NFR6) and prioritized for an MVP-first delivery.

---

## Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Backlog structure & prioritization scheme | Mehmet Gür | - | Completed |
| Mapping backlog items to FR/NFR (traceability) | Mehmet Gür | - | Completed |
| AI-related backlog items (FR11–FR14) | Mehmet Gür | - | Completed |
| UI/UX-related backlog items (screens, usability) | Mehmet Gür | - | Completed |
| Backend/data-related backlog items (auth, listings, media, search) | Mehmet Gür | - | Completed |
| Formatting & ToC | Mehmet Gür | - | Completed |

---

## Backlog Format

- **Priority:** MoSCoW (Must / Should / Could / Won’t)
- **Estimate:** simple story points (relative sizing, not person-hours)
- **Owner:** primary owner aligned with roles in `docs/assignment-1/04-task-effort-estimation.md`

---

## Product Backlog

| PB-ID | Epic | Backlog Item (User Story / Work Item) | Linked Req. | Priority | Estimate (SP) | Owner |
|---:|---|---|---|---|---:|---|
| PB1 | Core | As a user, I can register and log in. | FR1 | Must | 5 | Alp Eren Köksal |
| PB2 | Core | As a user, I can create a lost item post (title/desc/category/location). | FR2 | Must | 3 | Elif Beyza Turan |
| PB3 | Core | As a user, I can create a found item post (details/location). | FR3 | Must | 3 | Elif Beyza Turan |
| PB4 | Core | As a user, I can upload item photos with validation and storage. | FR4 | Must | 5 | Alp Eren Köksal |
| PB5 | Core | As a user, I can search listings using keywords. | FR5 | Must | 3 | Alp Eren Köksal |
| PB6 | Core | As a user, I can filter by category and date. | FR6 | Must | 2 | Alp Eren Köksal |
| PB7 | Core | As a user, I can mark an item as claimed/resolved. | FR7 | Must | 2 | Alp Eren Köksal |
| PB8 | Core | As a user, I can view the basic contact information of the post owner to coordinate handoff. | FR8 | Must | 2 | Elif Beyza Turan |
| PB9 | Core | As an admin, I can remove inappropriate/duplicate posts. | FR9 | Should | 3 | Elif Beyza Turan |
| PB10 | Core | As a user, I can edit/delete my own posts. | FR10 | Should | 3 | Alp Eren Köksal |
| PB11 | AI | System extracts basic visual attributes (object type, dominant color) from photos. | FR11 | Should | 5 | Mehmet Gür |
| PB12 | AI | System computes similarity scores across lost/found items using text+image analysis. | FR12 | Should | 8 | Mehmet Gür |
| PB13 | AI | System shows a ranked list of potential matches based on similarity score. | FR13 | Should | 5 | Mehmet Gür |
| PB14 | AI | System provides brief match explanations (e.g., color/category/description overlap). | FR14 | Should | 5 | Mehmet Gür |
| PB15 | Quality | Response time under 2 seconds for normal actions (browse/search/post). | NFR1 | Must | 3 | Zehra Atalay |
| PB16 | Quality | Usability pass for non-technical users (core flows + error states). | NFR2 | Should | 3 | Elif Beyza Turan |
| PB17 | Quality | Works on modern desktop browsers (Chrome/Firefox/Edge). | NFR3 | Must | 2 | Zehra Atalay |
| PB18 | Quality | Basic privacy & authorization (own-post edit/delete, admin-only moderation). | NFR4 | Must | 3 | Yiğit Yıldız |
| PB19 | Quality | AI module is extensible (swap/upgrade models without major rewrites). | NFR5 | Could | 3 | Mehmet Gür |
| PB20 | Quality | Basic availability target (deployment + simple monitoring/checklist). | NFR6 | Could | 2 | Zehra Atalay |

---

## Notes and Constraints

- **No user-to-user messaging/chat:** The product does not include in-app direct messaging. Coordination is supported via **basic owner contact display** (FR8 / PB8).
- **No notifications:** In-app/push notifications (email/SMS) are out of scope for the initial version.
- **MVP-first:** The system remains usable with keyword search/filtering even if AI items PB11–PB14 are incomplete.

---

## Agile Backlog Refinement Policy

- The Product Backlog is a living artifact and is re-evaluated before each sprint.
- It is **not required** to fully detail all backlog items at once.
- Only items selected for the upcoming sprint are detailed to implementation level.
- Sprint-level detailing includes acceptance criteria, technical subtasks, and test scope.
- Requirement-to-backlog traceability (FR/NFR -> PB items) is preserved as items evolve.
