# Requirements Document

**Project Name:** MatchProof  
**Date:** 03.02.2026

## Table of Contents

1. Introduction
2. Document Authorship
3. Requirements Specification
4. Product Backlog
5. Effort Estimation
6. Task Assignments
7. Conclusion

## 1. Introduction

This document defines the system requirements for MatchProof, a campus lost-and-found platform. The system provides a centralized digital space where students can report lost or found items, search existing listings, and coordinate item return.

## 2. Document Authorship

### 2.1 Team Members

- Alp Eren Köksal
- Mehmet Gür
- Yiğit Yıldız
- Elif Beyza Turan
- Zehra Atalay

### 2.2 Contributors to This Document

- Zehra Atalay
- Mehmet Gür

## 3. Requirements Specification

### 3.1 Document-Specific Task Matrix

| Task | Responsible | Status |
| --- | --- | --- |
| Functional requirements writing | Zehra Atalay | Completed |
| Non-functional requirements writing | Zehra Atalay | Completed |
| Effort estimation (aligned with `04-task-effort-estimation.md`) | Mehmet Gür | Completed |
| Task assignments table (aligned with `04-task-effort-estimation.md`) | Mehmet Gür | Completed |
| Formatting and table of contents | Zehra Atalay | Completed |

### 3.2 Functional Requirements

The baseline FR set is listed below in a traceable format. The "User Scenario Traceability" column links each requirement to the user scenarios later formalized in `docs/assignment-3/05-user-stories.md`, so the requirements can be reviewed together with end-user workflows.

| FR ID | Functional Requirement | User Scenario Traceability | Primary Outcome |
| --- | --- | --- | --- |
| FR1 | Users must be able to register and log in to the system. | US-01, US-02 | A user can create an account and start an authenticated session. |
| FR2 | Users must be able to create a lost item post including title, description, category, and location. | US-03 | A user can publish a lost-item listing. |
| FR3 | Users must be able to create a found item post including item details and discovery location. | US-04 | A user can publish a found-item listing. |
| FR4 | Users must be able to upload photos of lost or found items. | US-03, US-04, US-11 | A listing can include item imagery, including privacy-sensitive item handling. |
| FR5 | Users must be able to search items using keyword-based text search. | US-05 | Users can locate relevant listings through text search. |
| FR6 | Users must be able to filter items by category and date. | US-05 | Users can narrow search results to likely matches. |
| FR7 | Users must be able to mark items as claimed or resolved. | US-08 | Owners can update the recovery lifecycle of their posts. |
| FR8 | Users must be able to view the basic contact information of the person who created an item post in order to coordinate item return. | US-07 | Authenticated users can contact owners using name and email. |
| FR9 | Admin must be able to remove inappropriate or duplicate posts. | US-10 | Administrators can moderate board content. |
| FR10 | Users must be able to edit or delete their own posts. | US-09 | Owners can correct or remove their listings. |
| FR11 | The system must analyze uploaded item photos using AI techniques to identify basic object characteristics such as object type and dominant color. | US-06 | The AI pipeline can derive visual item signals. |
| FR12 | The system must generate similarity scores between lost and found items using AI-based analysis of text descriptions and images. | US-06 | Candidate matches can be ranked using combined evidence. |
| FR13 | The system must present users with a ranked list of potential matching items based on similarity scores. | US-06 | Users see the most promising matches first. |
| FR14 | The system must provide a brief explanation indicating why two items are considered similar (for example: color, category, or description similarity). | US-06 | Users understand the basis of each suggested match. |

### 3.3 Non-Functional Requirements

| NFR ID | Non-Functional Requirement | Quality Focus |
| --- | --- | --- |
| NFR1 | The system must respond to user actions within 2 seconds under normal operating conditions. | Performance |
| NFR2 | The system must provide a user-friendly and intuitive interface suitable for non-technical users. | Usability |
| NFR3 | The system must be accessible through modern desktop web browsers (Chrome, Firefox, Edge). | Compatibility |
| NFR4 | The system must ensure basic data privacy by restricting access to user-generated content to authorized users only. | Security and privacy |
| NFR5 | The system must be designed to allow future extension of AI models without major architectural changes. | Maintainability |
| NFR6 | The system must be available for at least 95% of the planned testing and demo period. | Availability |

## 4. Product Backlog

The initial Product Backlog for MatchProof is maintained as a separate document in `docs/assignment-1/05-product-backlog.md`. Backlog items are linked to FR1-FR14 and NFR1-NFR6 and prioritize MVP-first delivery (no in-app messaging/chat, no notifications).

## 5. Effort Estimation

| Phase | Estimated (person-hours) |
| --- | --- |
| Requirements and planning | 15 |
| Design | 15 |
| Development | 70 |
| AI matching and explainability | 30 |
| Testing and QA | 20 |
| Deployment | 5 |
| Documentation and closure | 5 |
| Total project effort | 160 |

Estimation method: Expert judgment + analogy-based estimation.

## 6. Task Assignments

| Task | Responsible | Support |
| --- | --- | --- |
| Requirements baseline (FR/NFR + acceptance checklist) | Yiğit Yıldız | Zehra Atalay |
| Documentation package (assignment docs alignment) | Yiğit Yıldız | Elif Beyza Turan |
| Requirements traceability (FR to tasks) and acceptance review | Yiğit Yıldız | Mehmet Gür |
| Project coordination (milestones, risks, change requests) | Zehra Atalay | Yiğit Yıldız |
| QA plan, test execution, and bug triage | Zehra Atalay | Elif Beyza Turan |
| Release and deploy checklist | Zehra Atalay | Alp Eren Köksal |
| UI/UX and core screens (post, browse/search, details, status actions) | Elif Beyza Turan | Yiğit Yıldız |
| Moderation/admin UI and content policy workflow | Elif Beyza Turan | Zehra Atalay |
| Responsive/accessibility polish (basic) | Elif Beyza Turan | Mehmet Gür |
| Backend core (auth, listings, status flow) | Alp Eren Köksal | Elif Beyza Turan |
| Media pipeline (image validation, storage) | Alp Eren Köksal | Mehmet Gür |
| Search and data access (filters, pagination) | Alp Eren Köksal | Yiğit Yıldız |
| AI similarity scoring and ranking (text + image) | Mehmet Gür | Alp Eren Köksal |
| Explainable matching (brief reasons) | Mehmet Gür | Alp Eren Köksal |
| AI evaluation and tuning (sample cases, thresholds) | Mehmet Gür | Zehra Atalay |

## 7. Conclusion

This document defines the functional and non-functional requirements for MatchProof and now presents the functional baseline in a user-scenario-traceable format for easier review against later design, QA, and acceptance artifacts.
