# 05 - User Stories (8.1 Target Audience + 8.2 User Stories)

**Project Name:** MatchProof  
**Course:** BIL 481  
**Version:** 1.0  
**Date:** 2026-04-16

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Alp Eren Köksal

## Table of Contents

1. Document-Specific Task Matrix
2. Target Audience (8.1)
3. User Stories (8.2)
4. Story-to-Requirement Traceability Matrix

---

## 1. Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Target audience definition | Alp Eren Köksal | - | Completed |
| User story writing (US-01 – US-10) | Alp Eren Köksal | - | Completed |
| FR traceability mapping | Alp Eren Köksal | - | Completed |
| Acceptance criteria per story | Alp Eren Köksal | - | Completed |
| Delta stories reflecting Assignment 3 improvements | Alp Eren Köksal | - | Completed |

---

## 2. Target Audience (8.1)

MatchProof targets three distinct user types within a university campus environment:

| User Type | Description | Technical Proficiency |
|---|---|---|
| **Student / Regular User** | Any enrolled student or campus member who has lost or found an item. The primary actor in the system. | Low to moderate — comfortable with web browsing and form submission |
| **Administrator** | A designated campus staff member or power user responsible for content moderation and platform integrity. | Moderate — familiar with basic admin workflows |
| **Guest (Unauthenticated Visitor)** | A visitor who can browse public listings but cannot post, claim, or contact owners. | Low — read-only interaction |

**Key characteristics of the target audience:**
- Access the platform primarily via desktop browsers on campus networks (Chrome, Firefox, and Edge are the supported targets)
- Have limited time and expect quick, intuitive workflows with clear validation feedback
- Are not expected to understand how the AI matching algorithm works internally
- Expect contact information to be protected and only visible to logged-in users
- May post sensitive items (ID cards, wallets) and expect the system to enforce appropriate privacy controls automatically

---

## 3. User Stories (8.2)

User stories follow the standard format:
> *As a [user type], I want to [action], so that [benefit].*

Each story is assigned a unique ID, mapped to functional requirements, and paired with acceptance criteria. Stories marked with **[Δ Delta]** reflect improvements added during the Assignment 3 delta implementation phase.

---

### US-01: User Registration

**As a** campus student,  
**I want to** create an account with my name, email, and password,  
**so that** I can access all platform features including posting and claiming items.

**Mapped FR:** FR1  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Registration form accepts name, email, and password
- [ ] Submitting a valid form creates a new user record
- [ ] Duplicate email addresses are rejected with a clear error message
- [ ] After successful registration, the user is automatically logged in

---

### US-02: User Login and Logout

**As a** registered user,  
**I want to** log in and out of my account securely,  
**so that** my session is protected and I can end it when I finish.

**Mapped FR:** FR1  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Login form accepts email and password
- [ ] Correct credentials establish an authenticated session
- [ ] Incorrect credentials return a clear error without revealing whether the email or password is wrong
- [ ] Logging out terminates the session and redirects to the login page

---

### US-03: Create a Lost Item Post

**As an** authenticated student,  
**I want to** post a listing describing an item I have lost,  
**so that** other users can see it and contact me if they find it.

**Mapped FR:** FR2, FR4, FR10  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Form requires item type (Lost), title, category, location, and description
- [ ] An image can optionally be uploaded; invalid file types or oversized files are rejected with a clear error
- [ ] Submitted post becomes searchable and visible on the board with "Open" status
- [ ] Post is associated with the logged-in user's account
- [ ] **[Δ Delta]** If the selected category is "ID Card", the post is automatically marked as private

---

### US-04: Create a Found Item Post

**As an** authenticated student,  
**I want to** post a listing describing an item I have found on campus,  
**so that** the rightful owner can identify and claim it.

**Mapped FR:** FR3, FR4, FR10  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Form requires item type (Found), title, category, location, and description
- [ ] An image can optionally be uploaded
- [ ] Submitted post is immediately visible in search results with "Open" status
- [ ] Post is associated with the logged-in user's account

---

### US-05: Search and Filter Listings

**As a** user (authenticated or guest),  
**I want to** search for items by keyword and filter by category, status, or date,  
**so that** I can quickly narrow down relevant listings.

**Mapped FR:** FR5, FR6  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Keyword input searches across item title and description
- [ ] Users can filter by category (e.g., Wallet, Keys, Electronics, ID Card)
- [ ] Users can filter by status (Open, Claimed, Resolved)
- [ ] Results are paginated and display the most recent items first

---

### US-06: View AI-Suggested Matches

**As an** authenticated user viewing an item detail page,  
**I want to** see a list of similar items that the system has ranked as potential matches,  
**so that** I can quickly identify items that might be related to my lost or found post.

**Mapped FR:** FR11, FR12, FR13, FR14  
**Priority:** Should Have

**Acceptance Criteria:**
- [ ] A "Possible Matches" section is visible on the item detail page
- [ ] Each match shows a similarity score and a short explanation (e.g., "similar description, same category")
- [ ] Clicking a match navigates to the matched item's detail page
- [ ] **[Δ Delta]** If the AI matching service is unavailable, an explicit fallback message is shown (not "No matches found")
- [ ] **[Δ Delta]** Private item images in the match cards are blurred for non-owner, non-admin users

---

### US-07: Contact the Post Owner

**As an** authenticated user who believes I found the owner of an item,  
**I want to** view the owner's name and email on the item detail page,  
**so that** I can reach out to coordinate item return.

**Mapped FR:** FR8  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Owner name and email are visible to authenticated users on the detail page
- [ ] Contact information is not visible to unauthenticated (guest) visitors
- [ ] **[Δ Delta]** Only name and email are shown; no phone number or additional contact channel is exposed

---

### US-08: Update Item Status

**As** the owner of an item post,  
**I want to** mark my post as "Claimed" then "Resolved" as the recovery progresses,  
**so that** the listing stays accurate and other users know the item is no longer needed.

**Mapped FR:** FR7  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Owner can transition status from `Open → Claimed`
- [ ] Owner can transition status from `Claimed → Resolved`
- [ ] Reverse transitions (e.g., `Resolved → Open`) are not permitted
- [ ] Only the post owner can change the status of their own post

---

### US-09: Edit or Delete My Post

**As** the owner of an item post,  
**I want to** edit the details of my post or delete it entirely,  
**so that** I can correct mistakes or remove the listing when it is no longer relevant.

**Mapped FR:** FR10  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Post owner can edit title, description, category, location, and image
- [ ] Post owner can permanently delete their listing
- [ ] Other users cannot edit or delete posts they do not own (HTTP 403 returned)

---

### US-10: Moderate and Remove Inappropriate Posts (Admin)

**As an** administrator,  
**I want to** remove posts that are inappropriate or duplicated,  
**so that** the board remains clean and trustworthy for all users.

**Mapped FR:** FR9  
**Priority:** Must Have

**Acceptance Criteria:**
- [ ] Admin can remove any post from the moderation panel with a required reason field
- [ ] Removed posts no longer appear in search results or the public listing feed
- [ ] A moderation action record is created and linked to the removed post
- [ ] Non-admin users cannot access the moderation panel (HTTP 403 returned)

---

### US-11: View Blurred Images for Private Items **[Δ Delta]**

**As a** user viewing a sensitive item post (e.g., an ID Card),  
**I want to** see that the item photo is appropriately obscured,  
**so that** sensitive images are not exposed to anyone other than the post owner and admins.

**Mapped FR:** FR4, NFR4  
**Priority:** Should Have (Delta improvement)

**Acceptance Criteria:**
- [ ] Item photos for posts in the "ID Card" category are blurred in the detail view for non-owners and non-admins
- [ ] Blurred images also appear blurred in AI match cards on other items' detail pages
- [ ] The item owner and admin users can view the unblurred image
- [ ] The privacy state cannot be overridden by a client-side request

---

## 4. Story-to-Requirement Traceability Matrix

| User Story | Functional / Non-Functional Requirements |
|---|---|
| US-01 (Register) | FR1 |
| US-02 (Login/Logout) | FR1 |
| US-03 (Lost Post + Auto-Privacy) | FR2, FR4, FR10, NFR4 |
| US-04 (Found Post) | FR3, FR4, FR10 |
| US-05 (Search & Filter) | FR5, FR6 |
| US-06 (AI Matches + Fallback + Blur) | FR11, FR12, FR13, FR14, NFR4 |
| US-07 (Contact Owner — name+email only) | FR8, NFR4 |
| US-08 (Update Status) | FR7 |
| US-09 (Edit/Delete Post) | FR10 |
| US-10 (Admin Moderation) | FR9 |
| US-11 (Private Item Blur — Delta) | FR4, NFR4 |
