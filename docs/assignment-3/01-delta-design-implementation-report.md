# Delta Design & Implementation Report

**Project Name:** MatchProof  
**Course:** BIL 481  
**Version:** 1.0  
**Date:** 2026-04-13

## List of Contributors

### Team Members
- Mehmet Gür
- Zehra Atalay
- Elif Beyza Turan
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Mehmet Gür

## Table of Contents

1. Document-Specific Task Matrix
2. Review Context and Feedback Summary
3. Selected Improvements for the Demo Scenario
4. Effort Estimation
5. Delta Design and Architecture Impact
6. Implemented Improvements and Findings
7. Impact on Quality Factors, Metrics, and Tests
8. Testing and Bugfixing

## 1. Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Review feedback analysis | Mehmet Gür | - | Completed |
| Improvement selection and justification | Mehmet Gür | - | Completed |
| Delta architecture and design update writing | Mehmet Gür | - | Completed |
| Effort estimation | Mehmet Gür | - | Completed |
| Testing and bugfixing summary | Mehmet Gür | - | Completed |
| Formatting and table of contents | Mehmet Gür | - | Completed |

---

## 2. Review Context and Feedback Summary

This report is based on the review document in `docs/reviews/MatchProof.odt`. The review concluded with **Weak Accept** and highlighted that the project had a solid MVP scope and working prototype, but several issues should be improved before the final demo.

The main review points were:

- AI matching fallback behavior was not concrete enough from the user perspective.
- Contact visibility raised privacy concerns.
- Sensitive item images required stronger privacy protection.
- Input validation and upload policy needed clearer enforcement and documentation.
- The absence of a CI pipeline weakened confidence in regression safety.
- The previous availability target (`99% uptime`) was too ambitious for the remaining implementation scope and course setting.

For the final demo period, the team selected only the feedback items that could be implemented with limited risk, low integration cost, and direct benefit to the selected demo scenario.

### Selected demo scenario

The selected demo scenario is:

> A student loses a sensitive campus item such as an ID card or wallet, another user posts a found-item listing, the owner searches or opens the detail page, sees possible matches, uses the available owner contact card, and completes the claim/resolution workflow.

This scenario is the best fit for the selected improvements because it directly touches **privacy**, **AI fallback**, **contact visibility**, and **test confidence**.

---

## 3. Selected Improvements for the Demo Scenario

| Review Feedback | Selected? | Justification | Implementation Scope |
|---|---|---|---|
| Privacy concern on visible contact details | Yes | Low effort, high user impact, directly relevant to the demo scenario. The concern can be handled without removing basic handoff information entirely. | Keep the item detail contact card limited to basic `name + email`, and avoid adding phone/chat or extra contact channels. |
| Sensitive image handling for private/special items | Yes | Directly improves demo credibility for ID cards and similar items. | Force `ID Card` posts to private mode and blur their images for non-owner/non-admin users. |
| AI fallback behavior is unclear | Yes | A small frontend change removes misleading UX and strengthens the demo. | Show an explicit fallback message when AI matching is unavailable. |
| No CI pipeline | Yes | Low implementation effort and strong effect on code confidence. | Add GitHub Actions workflow for automated `test:unit` execution. |
| Availability requirement is unrealistic | Yes | Purely documentation-side correction with high report value. | Reduce NFR6 to a realistic target for planned testing/demo periods. |
| Password reset flow is missing | No | Useful but not necessary for the selected demo scenario. | Deferred due to timeline. |
| Malware scanning for uploads | No | High effort compared with remaining time and infrastructure constraints. | Deferred as future work. |
| Full production AI deployment plan | No | Would require model hosting and more operational work than the course timeline allows. | Deferred as future work. |
| Database backup / data deletion policy implementation | No | Important at product level, but larger than the remaining scope for the selected demo. | Deferred as future work. |

The selected set focuses on **maximum demo value with minimum architectural disruption**.

---

## 4. Effort Estimation

### 4.1 Estimation Method

The delta implementation effort was estimated using the same approach already used in Assignment 1:

- **Expert judgment**
- **Analogy-based estimation**

The effort was estimated according to the current codebase maturity, the number of affected files, test impact, and expected integration risk.

### 4.2 Effort Table

| Improvement | Estimated Effort (person-hours) |
|---|---:|
| Basic contact display clarification (`name + email`) | 2 |
| Sensitive item privacy rule (`ID Card` -> private + blur) | 5 |
| AI fallback UX for unavailable matching service | 3 |
| CI workflow integration | 2 |
| Documentation, quality metric update, delta report alignment | 4 |
| Test updates and verification | 4 |
| **Total** | **20** |

### 4.3 Selection Rationale

These improvements were selected because they:

- fit inside the remaining implementation window,
- are directly observable in the final demo,
- improve both product quality and review response quality,
- do not require a major architecture rewrite,
- and can be verified through concrete tests.

---

## 5. Delta Design and Architecture Impact

### 5.1 Architecture Update

The overall layered architecture did **not** change. MatchProof still follows:

```text
Frontend UI -> API routes -> Services -> Models -> Database/Storage
                           -> Matching service -> Ranked match results
```

The delta changes were intentionally implemented **inside the existing architecture**.

### 5.2 Architectural Changes Applied

| Area | Delta |
|---|---|
| Frontend | Added `src/client/services/itemPrivacy.js` to centralize privacy-related UI decisions. |
| Backend | Added `src/server/services/item-privacy.js` to centralize sensitive-category privacy enforcement. |
| Delivery pipeline | Added `.github/workflows/ci.yml` for automated unit/component test execution. |

### 5.3 Related Design Decisions

The main design decisions were:

1. **Privacy enforcement must not depend only on the frontend.**  
   Therefore, the backend now forces `ID Card` posts to remain private even if a client tries to disable privacy.

2. **Fallback behavior should be explicit, not silent.**  
   Previously, an AI failure could appear as “no matches found.” This was misleading. The UI now explicitly distinguishes between “no match” and “AI unavailable.”

3. **Contact data should remain minimal but still usable.**  
   Since the review raised privacy concerns, the final decision was to keep only the basic handoff information in the detail response: owner `name + email`. No phone number, chat module, or extra contact channel was introduced.

4. **No new heavy design pattern was introduced.**  
   The changes were small enough to stay within the existing layered design. Instead of introducing a new formal pattern, privacy rules were extracted into dedicated helper modules to reduce duplication and keep policy decisions centralized.

### 5.4 Impact on Existing Design Patterns

No additional formal design pattern was added as a result of this delta. This was a deliberate decision to avoid over-engineering. The existing route → service → model separation remained valid and sufficient.

---

## 6. Implemented Improvements and Findings

### 6.1 Contact Information Scope Clarified

**Implemented change**

- Item detail responses now expose:

```json
{
  "ownerContact": {
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

**Why this was selected**

- It addresses the review’s privacy concern without harming usability.
- It keeps the handoff scenario understandable for students who need to know who posted the item.
- It is low-cost and easy to verify.

**Finding**

The better balance for this project is not “maximum disclosure” or “email-only,” but a limited contact card with `name + email`. This keeps coordination practical while still avoiding more sensitive contact channels such as phone number or in-app chat.

### 6.2 Sensitive Item Privacy Hardening

**Implemented change**

- `ID Card` category posts are now automatically marked as private.
- Private images are blurred for non-owner and non-admin users.
- This blur behavior now also covers AI match cards, preventing privacy leakage through the “Possible Matches” panel.

**Why this was selected**

- It directly supports the selected demo scenario.
- It solves a realistic privacy concern with limited scope.
- It improves consistency across list/detail/match views.

**Finding**

The earlier implementation allowed privacy to be optional even for clearly sensitive items. That made the system dependent on user caution. The new rule shifts privacy enforcement to the system, which is more defensible.

### 6.3 Explicit AI Fallback UX

**Implemented change**

- If the AI match request fails, the detail page now shows an explicit fallback message instead of incorrectly showing “No matches found.”

**Why this was selected**

- The review specifically criticized the lack of a concrete fallback behavior.
- This was implementable with a small frontend change.
- It strengthens user trust because the UI no longer hides service failure as normal empty output.

**Finding**

An empty state and a failed AI service are not the same product condition. Treating them as the same created ambiguity. The explicit fallback message fixes that ambiguity.

### 6.4 CI-Based Regression Safety

**Implemented change**

- Added GitHub Actions CI workflow at `.github/workflows/ci.yml`.
- The pipeline runs `npm ci` and `npm run test:unit`.

**Why this was selected**

- The review identified missing CI as a weakness.
- This is low effort and high value.
- It improves team coordination and reduces regression risk without changing application behavior.

**Finding**

Given the current project scale, a lightweight CI workflow is sufficient. Full deployment automation was not selected because it would exceed the remaining effort budget.

### 6.5 Availability Requirement Refinement

**Implemented change**

- NFR6 and related quality documents were updated from a blanket `99% uptime` target to a realistic target:
  - `>= 95% availability during the planned testing/demo period`

**Why this was selected**

- The review called the old target unrealistic.
- The new target better matches a course-project context and can be defended in documentation.

**Finding**

This was a design governance correction rather than a code feature. However, it improves consistency between scope, deployment expectations, and QA metrics.

---

## 7. Impact on Quality Factors, Metrics, and Tests

| Improvement | Impacted Quality Factor(s) | Metric / Target Impact | Test Impact |
|---|---|---|---|
| Basic contact display clarification (`name + email`) | Privacy & Access Control, Usability | Keeps contact scope limited to essential handoff information while preserving usability | Backend service mapping checks, detail page rendering checks, and documentation alignment updated |
| Sensitive item privacy hardening | Privacy & Access Control, Usability | Stronger privacy policy for high-risk categories | Added tests for forced-private behavior and blurred private media surfaces |
| AI fallback UX | Usability, Availability | Improves failure transparency during AI service unavailability | Added component test for unavailable-match fallback message |
| CI workflow | Maintainability | Increases confidence that core tests run on each PR/push | Added GitHub Actions workflow for `test:unit` |
| NFR6 refinement | Availability | Replaces unrealistic target with measurable course-appropriate target | QA plan and requirement documentation updated |

---

## 8. Testing and Bugfixing

The selected improvements were implemented together with targeted bugfixing and test updates.

### 8.1 Testing Work

The following were updated:

- backend service tests
- frontend component tests
- documentation for QA metrics
- CI verification workflow

### 8.2 Fixed Bugs Recorded in Test Report

The fixed issues table in `docs/test/01-test-report.md` was extended to include the new delta-stage fixes, especially:

- privacy leakage risk for sensitive category posts,
- contact information policy inconsistency in item detail,
- misleading AI failure behavior,
- and regression-safety improvement through CI-backed verification.

### 8.3 Final Assessment

The selected improvements were chosen because they produce **visible demo value**, **directly answer review feedback**, and remain feasible within the remaining implementation period. The architecture remains stable, the codebase becomes safer, and the final demo scenario becomes easier to justify both functionally and academically.
