# 04 - Risk Management (7.3)

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
- Yiğit Yıldız
- Mehmet Gür

## Table of Contents

1. Document-Specific Task Matrix
2. Risk Classification
3. Risk Analysis and Mitigation Strategies (7.3)
4. Risk Monitoring Plan

---

## 1. Document-Specific Task Matrix

| Task | Responsible | Support | Status |
|---|---|---|---|
| Risk identification | Mehmet Gür | Yiğit Yıldız | Completed |
| Risk analysis (likelihood × impact) | Mehmet Gür | Alp Eren Köksal | Completed |
| Mitigation strategy definition | Yiğit Yıldız | Alp Eren Köksal | Completed |
| Risk monitoring plan | Yiğit Yıldız | Alp Eren Köksal | Completed |

---

## 2. Risk Classification

Risks are scored using a **Likelihood × Impact** matrix. Each dimension is rated 1–3:

| Score | Likelihood | Impact |
|---|---|---|
| 1 | Low — unlikely to occur | Low — minor inconvenience, no delivery impact |
| 2 | Medium — may occur | Medium — delays a feature or sub-component |
| 3 | High — likely to occur | High — blocks a core requirement or the demo |

**Risk Level** = Likelihood × Impact:

| Score | Level |
|---|---|
| 1–2 | 🟢 Low |
| 3–4 | 🟡 Medium |
| 6–9 | 🔴 High |

---

## 3. Risk Analysis and Mitigation Strategies (7.3)

### 3.1 Technical Risks

| Risk ID | Risk Description | Likelihood | Impact | Level | Mitigation Strategy | Contingency |
|---|---|---|---|---|---|---|
| RT-01 | **AI model inference is too slow** on the team's local hardware, causing timeouts during demo | 3 | 2 | 🔴 High | `MATCHING_MODE=stub` is already implemented and tested; AI inference is an optional enhancement, not a core dependency | Run demo in stub mode; AI shown as "integration-ready but hardware-constrained" |
| RT-02 | **PostgreSQL connection failures** due to misconfigured environment or port conflicts | 2 | 3 | 🔴 High | Validated `.env.example` and setup documentation in place; CI pipeline catches environment issues early | Fall back to local SQLite for demo if PostgreSQL is unavailable |
| RT-03 | **Image upload pipeline breaks** due to file size limits, MIME type mismatch, or storage path issues | 2 | 2 | 🟡 Medium | SEC-07 enforces MIME type and size validation; upload middleware has unit test coverage | Allow demo with text-only posts; image upload is an enhancement feature |
| RT-04 | **Session management inconsistency** — user appears logged out unexpectedly on page refresh | 1 | 2 | 🟢 Low | `GET /api/auth/me` is the source of truth for session state; AuthContext test suite covers this behavior | Reproduce and fix before demo; auth flow covered in E2E tests |
| RT-05 | **Frontend build breaks** due to missing dependencies or Vite/React version conflicts | 1 | 2 | 🟢 Low | `package-lock.json` committed; CI uses `npm ci`; Node.js >= 18 documented in README | Use the canonical demo machine for the final build |
| RT-06 | **CI pipeline unexpectedly fails** due to test environment differences between local and GitHub Actions runner | 2 | 1 | 🟢 Low | All tests are environment-agnostic with mocked external dependencies; CI runs on ubuntu-latest with identical `npm ci` setup | Investigate runner logs; known workarounds documented in SETUP.md |
| RT-07 | **Sensitive item privacy regression** — privacy blur removed by frontend code change | 2 | 2 | 🟡 Medium | `item-privacy.js` enforces privacy server-side; backend enforcement does not depend on frontend correctness | Backend privacy enforcement catches this even if frontend is broken |

### 3.2 Process and Team Risks

| Risk ID | Risk Description | Likelihood | Impact | Level | Mitigation Strategy | Contingency |
|---|---|---|---|---|---|---|
| RP-01 | **Uneven workload distribution** — delta improvements concentrated on one or two members | 2 | 2 | 🟡 Medium | Document-specific task matrices assign clear ownership; weekly sync reviews the matrix | Redistribute tasks mid-sprint; pair-program on bottleneck areas |
| RP-02 | **Scope creep beyond selected delta improvements** — adding features not in the delta selection table | 2 | 2 | 🟡 Medium | Delta scope is frozen to the five improvements in `01-delta-design-implementation-report.md`; new ideas are deferred | Revert incomplete features before demo |
| RP-03 | **Key member unavailability** during the final demo preparation window | 1 | 3 | 🔴 High | Documentation and code comments enable any team member to pick up another's work | Redistribute critical tasks immediately; notify instructor if necessary |
| RP-04 | **Merge conflicts** on the main branch during CI integration | 1 | 1 | 🟢 Low | Feature branches used; PRs squash-merged; conflicts resolved before opening PRs | Revert to last stable commit and re-apply changes |

### 3.3 External and Operational Risks

| Risk ID | Risk Description | Likelihood | Impact | Level | Mitigation Strategy | Contingency |
|---|---|---|---|---|---|---|
| RX-01 | **Demo environment instability** — internet or machine failure during the live presentation | 1 | 3 | 🔴 High | Local demo environment runs fully offline; full demo dry run performed one day before | Screen recording as backup; second machine on standby |
| RX-02 | **Third-party library breaking change** in a patch release of Express, React, or Jest | 1 | 2 | 🟢 Low | All dependencies pinned to exact versions in `package-lock.json`; no unreviewed `npm update` | Rollback to pinned version from lock file |
| RX-03 | **Data loss** — local database wiped between demo sessions | 1 | 2 | 🟢 Low | Seed script (`npm run db:seed`) restores demo data in under 5 minutes; SQL dump kept | Re-run seed script before demo |

---

## 4. Risk Monitoring Plan

### 4.1 Monitoring Cadence

| Activity | Frequency | Owner |
|---|---|---|
| Review GitHub Issues for new risk signals | Weekly | All team |
| Confirm CI passes (GitHub Actions) | Before every PR merge | Feature branch owner |
| Update risk register if new risk identified | As needed | Mehmet Gür |
| Full demo dry run on presentation machine | 1 day before demo | All team |

### 4.2 Risk Escalation

If a **🔴 High** risk materializes and cannot be mitigated within 48 hours, the team lead (Mehmet Gür) notifies all team members and, if it affects deliverable scope or demo viability, informs the course instructor.

### 4.3 Risk Register Summary

| Level | Count | Risk IDs |
|---|---|---|
| 🔴 High | 4 | RT-01, RT-02, RP-03, RX-01 |
| 🟡 Medium | 4 | RT-03, RT-07, RP-01, RP-02 |
| 🟢 Low | 6 | RT-04, RT-05, RT-06, RP-04, RX-02, RX-03 |
| **Total** | **14** | — |
