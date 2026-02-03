**Requirements Document**

**TABLE OF CONTENTS**

- Introduction
- Document Authorship
- Document-Specific Task Matrix
- Functional Requirements
- Non-Functional Requirements
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

• Elif Beyza Turhan

• Zehra Atalay

Contributors to this document:

• Zehra Atalay

**Document-Specific Task Matrix :**

| Task | Responsible | Status |
| --- | --- | --- |
| Functional Requirements writing | Zehra Atalay | Completed |
| Non-Functional Requirements writing | Zehra Atalay | Completed |
| Effort Estimation | Zehra Atalay | Completed |
| Formatting & ToC | Zehra Atalay | Completed |

**Functional Requirements :**

FR1 - Users must be able to register and log in to the system.

FR2 - Users must be able to create a lost item post including title, description, category, and location.

FR3 - Users must be able to create a found item post including item details and discovery location.

FR4 - Users must be able to upload photos of lost or found items.

FR5 - Users must be able to search items using keyword-based text search.

FR6 - Users must be able to filter items by category and date.

FR7 - Users must be able to mark items as claimed or resolved.

FR8 - Users must be able to contact the person who created an item post via in-app messaging or contact information.

FR9 - Admin must be able to remove inappropriate or duplicate posts.

FR10 - Users must be able to edit or delete their own posts.

FR11 - The system must use AI to analyze uploaded photos and extract basic features (color, object type).

FR12 - The system must enhance text-based searches using AI to improve matching accuracy.

**Non-Functional Requirements :**

NFR1 - The system must respond within 2 seconds.

NFR2 - The interface must be user-friendly.

NFR3 - The system must support desktop browsers.

NFR4 - The system must be available 99% of the time.

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

(Note : Estimation Method : Expert Judgment)

**Task Assignments :**

| Task | Responsible | Support |
| --- | --- | --- |
| Requirements baseline (FR/NFR + acceptance checklist) | Yiğit Yıldız | Zehra Atalay |
| Campus taxonomy (categories + campus locations) | Yiğit Yıldız | Elif Beyza Turan |
| Auth & sessions (register/login/logout) | Alp Eren Köksal | Elif Beyza Turan |
| Listings UI (lost/found create/edit + photo upload UX) | Elif Beyza Turan | Alp Eren Köksal |
| Listings API + DB schema (metadata, status, resolution) | Alp Eren Köksal | Yiğit Yıldız |
| Media pipeline (image validation, storage, resizing) | Alp Eren Köksal | Elif Beyza Turan |
| Search UI (filters : category/location/date/status) | Elif Beyza Turan | Yiğit Yıldız |
| Search backend (filters + pagination) | Alp Eren Köksal | Mehmet Gür |
| Claim flow UI (claim request + verification prompts) | Elif Beyza Turan | Yiğit Yıldız |
| Claim workflow backend (states, approve/reject/resolve) | Alp Eren Köksal | Zehra Atalay |
| Notifications (in-app) | Alp Eren Köksal | Zehra Atalay |
| Report & moderation process (policy + workflow) | Zehra Atalay | Yiğit Yıldız |
| Admin moderation UI (queue : hide/remove/restore) | Elif Beyza Turan | Zehra Atalay |
| Multi-modal similarity ranking (text + image) | Mehmet Gür | Alp Eren Köksal |
| Explainable matching (match reasons + score breakdown) | Mehmet Gür | Yiğit Yıldız |
| Match suggestions UI (ranked list + explanations) | Elif Beyza Turan | Mehmet Gür |
| Test cases & acceptance checks | Yiğit Yıldız | Elif Beyza Turan |
| Release/deploy checklist | Alp Eren Köksal | Zehra Atalay, Mehmet Gür |

**Conclusion :**

This document defines the functional and non-functional requirements for the MatchProof and provides task allocation and effort estimation to guide successful development.