**Requirements Document**

**TABLE OF CONTENTS**

- Introduction
- Document Authorship
- Document-Specific Task Matrix
- Functional Requirements
- Non-Functional Requirements
- Product Backlog
- Effort Estimation
- Task Assignment
- Conclusion

**Introduction :**

This document defines the system requirements for the Campus Lost & Found Digital Board. The system aims to provide a centralized digital platform where students can report lost or found items on campus. Users can post items, search existing listings.

**Document Authorship :**

Document Title: Requirements Document

Project Name:MatchProof

Date: 03.02.2026

Team Members:

• Alp Eren Köksal

• Mehmet Gür

• Yiğit Yıldız

• Elif Beyza Turan

• Zehra Atalay

Contributors to this document:

• Zehra Atalay

• Mehmet Gür

**Document-Specific Task Matrix :**

| Task | Responsible | Status |
| --- | --- | --- |
| Functional Requirements writing | Zehra Atalay | Completed |
| Non-Functional Requirements writing | Zehra Atalay | Completed |
| Effort Estimation (tables aligned with 04-task-effort-estimation) | Mehmet Gür | Completed |
| Task assignments table (aligned with 04-task-effort-estimation) | Mehmet Gür | Completed |
| Formatting & ToC | Zehra Atalay | Completed |

**Functional Requirements :**

FR1 - Users must be able to register and log in to the system.

FR2 - Users must be able to create a lost item post including title, description, category, and location.

FR3 - Users must be able to create a found item post including item details and discovery location.

FR4 - Users must be able to upload photos of lost or found items.

FR5 - Users must be able to search items using keyword-based text search.

FR6 - Users must be able to filter items by category and date.

FR7 - Users must be able to mark items as claimed or resolved.

FR8 - Users must be able to view the basic contact information of the person who created an item post in order to coordinate item return.

FR9 - Admin must be able to remove inappropriate or duplicate posts.

FR10 - Users must be able to edit or delete their own posts.

FR11 – The system must analyze uploaded item photos using AI techniques to identify basic object characteristics such as object type and dominant color.

FR12 – The system must generate similarity scores between lost and found items using AI-based analysis of text descriptions and images.

FR13 – The system must present users with a ranked list of potential matching items based on similarity scores.

FR14 – The system must provide a brief explanation indicating why two items are considered similar (e.g., color, category, or description similarity).

**Non-Functional Requirements :**

NFR1 – The system must respond to user actions within 2 seconds under normal operating conditions.

NFR2 – The system must provide a user-friendly and intuitive interface suitable for non-technical users.

NFR3 – The system must be accessible through modern desktop web browsers (Chrome, Firefox, Edge).

NFR4 – The system must ensure basic data privacy by restricting access to user-generated content to authorized users only.

NFR5 – The system must be designed to allow future extension of AI models without major architectural changes.

NFR6 - The system must be available for at least 95% of the planned testing and demo period.

**Product Backlog :**

The initial Product Backlog for MatchProof is maintained as a separate document in `docs/assignment-1/05-product-backlog.md`. Backlog items are linked to FR1–FR14 and NFR1–NFR6 and prioritize an MVP-first delivery (no in-app messaging/chat, no notifications).

**Effort Estimation :**

| Phase | Estimated (person-hours) |
| --- | --- |
| Requirements & Planning | 15  |
| Design | 15  |
| Development | 70  |
| AI matching & explainability | 30  |
| Testing & QA | 20  |
| Deployment | 5   |
| Documentation & closure | 5   |
| Total Project Effort | 160 |

(Note : Estimation Method : Expert Judgment + Analogy-based Estimation)

**Task Assignments :**

| Task | Responsible | Support |
| --- | --- | --- |
| Requirements baseline (FR/NFR + acceptance checklist) | Yiğit Yıldız | Zehra Atalay |
| Documentation package (Assignment docs alignment) | Yiğit Yıldız | Elif Beyza Turan |
| Requirements traceability (FR→tasks) + acceptance review | Yiğit Yıldız | Mehmet Gür |
| Project coordination (milestones, risks, change requests) | Zehra Atalay | Yiğit Yıldız |
| QA plan + test execution + bug triage | Zehra Atalay | Elif Beyza Turan |
| Release/deploy checklist | Zehra Atalay | Alp Eren Köksal |
| UI/UX + core screens (post, browse/search, details, status actions) | Elif Beyza Turan | Yiğit Yıldız |
| Moderation/admin UI + content policy workflow | Elif Beyza Turan | Zehra Atalay |
| Responsive/accessibility polish (basic) | Elif Beyza Turan | Mehmet Gür |
| Backend core (auth, listings, status flow) | Alp Eren Köksal | Elif Beyza Turan |
| Media pipeline (image validation, storage) | Alp Eren Köksal | Mehmet Gür |
| Search + data access (filters, pagination) | Alp Eren Köksal | Yiğit Yıldız |
| AI similarity scoring + ranking (text+image) | Mehmet Gür | Alp Eren Köksal |
| Explainable matching (brief reasons) | Mehmet Gür | Alp Eren Köksal |
| AI evaluation & tuning (sample cases, thresholds) | Mehmet Gür | Zehra Atalay |

**Conclusion :**

This document defines the functional and non-functional requirements for the MatchProof and provides task allocation and effort estimation to guide successful development.
