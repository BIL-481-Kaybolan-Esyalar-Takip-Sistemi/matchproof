# Project Definition Document (Assignment 1)
# Project Definition Document

## Document Authorship

**Document Title:** Project Definition Document  
**Project Name:** MatchProof  
**Date:** 03.02.2026

### Team Members
- Mehmet Gür
- Elif Beyza Turan
- Zehra Atalay
- Yiğit Yıldız
- Alp Eren Köksal

### Contributors to this document
- Elif Beyza Turan
- Mehmet Gür

---

## Table of Contents
- [Introduction](#introduction)
- [Document-Specific Task Matrix](#document-specific-task-matrix)
- [Project Name](#project-name)
- [Project Summary](#project-summary)
- [Objectives](#objectives)
- [Scope](#scope)
- [Target Audience](#target-audience)
- [Key Features](#key-features)
- [Deliverables](#deliverables)
- [Budget and Resources](#budget-and-resources)
- [Risks and Mitigation Strategies](#risks-and-mitigation-strategies)
- [Project Success Criteria](#project-success-criteria)

---

## Introduction

This document defines the MatchProof project, a campus lost and found digital platform. It outlines the project's objectives, scope, key features, target audience, deliverables, resource requirements, potential risks, and success criteria to guide the development team throughout the project lifecycle.

---

## Document-Specific Task Matrix

| Task | Responsible Person | Status / Date / Notes |
|------|-------------------|----------------------|
| Project name definition | Mehmet Gür, Elif Beyza Turan, Zehra Atalay, Yiğit Yıldız, Alp Eren Köksal | Completed |
| Problem statement writing | Elif Beyza Turan | Completed |
| Stakeholder analysis | Elif Beyza Turan | Completed |
| Scope & out-of-scope definition | Elif Beyza Turan | Completed |
| Risk identification and mitigation strategies | Elif Beyza Turan | Completed |
| Project summary writing | Elif Beyza Turan | Completed |
| Objectives definition | Elif Beyza Turan | Completed |
| Target audience analysis | Elif Beyza Turan | Completed |
| Key features specification | Elif Beyza Turan | Completed |
| Deliverables listing | Elif Beyza Turan | Completed |
| Budget and resources planning | Mehmet Gür | Completed |
| Success criteria definition | Elif Beyza Turan | Completed |
| Document editing and formatting | Elif Beyza Turan | Completed |
| Table of Contents creation | Elif Beyza Turan | Completed |

---

## Project Name

**MatchProof**

---

## Project Summary

MatchProof is a digital lost and found platform designed specifically for campus environments. Students and staff frequently lose personal items around campus such as books, electronics, keys, clothing, and ID cards. Currently, there is no centralized, efficient system to report and reclaim these items, leading to frustration and permanent loss of valuable belongings.

MatchProof solves this problem by providing a centralized digital bulletin board where users can post lost or found items, search through existing listings using text and AI-powered image analysis, and connect with others to reclaim their belongings. The platform leverages artificial intelligence to analyze uploaded photos, extract visual features, and provide explainable matching recommendations with ranked similarity scores, making it easier and more transparent to match lost items with found ones.

---

## Objectives

- Develop a functional web-based lost and found platform accessible from desktop browsers
- Implement secure user authentication and authorization system with registration, login, and session management
- Create an intuitive user interface for posting lost and found items with photos, descriptions, categories, and campus locations
- Integrate multi-modal AI similarity ranking combining text and image analysis for improved matching accuracy
- Implement explainable matching system that provides match reasons and score breakdowns to users
- Develop intelligent search functionality with filtering by category, location, date, and status
- Enable claim workflow with request, verification, and resolution capabilities
- Implement administrative moderation tools for content management and policy enforcement
- Achieve system response time under 2 seconds and 99% uptime availability

---

## Scope

### Included in Scope

- User registration, login, logout, and session management
- Lost item posting with title, description, category, campus location, and photo upload
- Found item posting with item details, discovery location, and photo upload
- Campus taxonomy including item categories and campus location mapping
- Media pipeline with image validation, storage, and resizing
- Search interface with filters for category, location, date, and status
- Search backend with filtering and pagination capabilities
- Multi-modal AI similarity ranking using text and image embeddings
- Explainable matching with match reasons and score breakdown visualization
- Match suggestions UI displaying ranked list with explanations
- Claim workflow with request submission, verification prompts, and approve/reject/resolve states
- Post editing and deletion by original poster
- Report and moderation policy with defined workflow
- Administrative moderation UI with queue management (hide/remove/restore posts)
- Desktop browser support
- Comprehensive test cases and acceptance checks
- Release and deployment checklist

### Excluded from Scope

- Mobile native applications (iOS/Android apps)
- Notifications (in-app or push notifications via email/SMS)
- Payment or reward systems
- In-app direct messaging/chat between users
- Integration with campus security systems or physical lost and found offices
- Multi-campus or multi-institution support in initial version
- Advanced analytics dashboards or reporting features
- Social media integration or sharing
- Automated item categorization

---

## Target Audience

- University and college students who have lost or found items on campus
- Campus staff and faculty members
- Campus security personnel responsible for lost and found management
- Campus administrators who need to monitor and moderate item listings

---

## Key Features

### User Authentication System
Secure registration and login functionality with session management, allowing users to create accounts and safely access the platform

### Lost & Found Item Posting
Create detailed posts for lost or found items including title, description, category, campus location, and photo uploads with validation and storage

### Campus Taxonomy
Structured categorization system for items and standardized campus location mapping to improve search and organization

### Multi-Modal AI Similarity Ranking
Advanced matching algorithm that combines text embeddings and image analysis to rank potential matches between lost and found items

### Explainable Matching
Transparent AI system that provides users with match reasons, similarity score breakdowns, and visual explanations for why items are suggested as matches

### Intelligent Search & Filtering
Comprehensive search interface with filters for category, campus location, date range, and item status, backed by efficient pagination

### Claim Workflow System
Structured process for claiming items with verification prompts and state management (request, approve, reject, resolve)

### Post Management
Users can edit and delete their own posts, with metadata tracking and status management

### Administrative Moderation
Comprehensive admin tools with moderation queue for hiding, removing, and restoring posts based on established policies

---

## Deliverables

- Fully functional web application accessible via desktop browsers
- Complete source code repository on GitHub with clear commit history showing individual contributions
- Project Definition Document (this document)
- Requirements Document detailing functional and non-functional requirements
- Project Plan Document with timeline, milestones, and resource allocation
- System architecture and design documentation
- Database schema and data model documentation
- User interface mockups and design specifications
- AI matching model documentation including algorithm explanation and performance metrics
- Test cases, acceptance criteria, and testing documentation
- Deployment guide and release checklist
- User manual and help documentation
- Final project presentation

---

## Budget and Resources

### Human Resources

The team consists of 5 members with clearly defined roles:

| Team Member | Role | Estimated Effort (hours) |
|-------------|------|--------------------------|
| Zehra Atalay | Project Manager & Coordinator | 32 |
| Yiğit Yıldız | Requirements Analyst & Documentation | 26 |
| Elif Beyza Turan | UI/UX & Frontend | 34 |
| Alp Eren Köksal | Backend & Database | 38 |
| Mehmet Gür | AI/ML Matching | 30 |
| **Total** | | **160** |

### Effort Distribution by Phase

| Phase | Estimated Effort (hours) |
|-------|--------------------------|
| Requirements & Planning | 15 |
| Design | 15 |
| Development | 70 |
| AI Matching & Explainability | 30 |
| Testing & QA | 20 |
| Deployment | 5 |
| Documentation & Closure | 5 |
| **Total** | **160** |

### Software and Tools

- **Frontend:** React.js, HTML5, CSS3, JavaScript (free, open-source)
- **Backend:** Node.js, Express.js (free, open-source)
- **Database:** PostgreSQL or MongoDB (free, open-source)
- **AI/ML:** Pre-trained embeddings (CLIP for images, Sentence-BERT for text) via API or local inference (free tier available)
- **Version Control:** GitHub (free for students)
- **Development Environment:** VS Code (free)
- **Design Tools:** Figma (free tier)
- **Testing Framework:** Jest, React Testing Library (free, open-source)

### Infrastructure

- **Hosting:** Vercel or Netlify free tier for frontend, Heroku or Railway for backend
- **Cloud storage:** Cloudinary free tier or AWS S3 free tier for image storage
- **Database hosting:** MongoDB Atlas free tier or ElephantSQL for PostgreSQL
- **Domain (optional):** Estimated $10-15 per year if custom domain required

### Learning Resources

- Official documentation for React, Node.js, Express.js, and chosen database
- AI/ML tutorials for embedding-based similarity matching
- Online courses and tutorials on full-stack web development
- Academic papers and articles on explainable AI and matching systems

### Total Estimated Budget

**$0-15** (minimal to zero cost, leveraging free tiers and open-source tools)

---

## Risks and Mitigation Strategies

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| AI model accuracy limitations and false positive matches | High | Medium | Use well-tested pre-trained embeddings (CLIP, SBERT), implement threshold tuning based on validation data, provide explainability to help users understand match quality, gather user feedback for continuous improvement |
| Time constraints due to academic workload and competing deadlines | High | High | Create realistic timeline with 20% buffer time, prioritize core features using MoSCoW method, use agile sprints for iterative development, conduct weekly progress reviews |
| Technical skill gaps in AI/ML integration and embedding systems | Medium | Medium | Allocate dedicated learning time in project schedule, use well-documented libraries and APIs, pair programming for knowledge transfer, seek instructor guidance early, have fallback to simpler text-only matching |
| Database performance issues with image storage and query optimization | Medium | Low | Use dedicated cloud storage (Cloudinary/S3) for images with only metadata in DB, implement database indexing on frequently queried fields, use pagination for all list views, conduct load testing early |
| Security vulnerabilities in authentication and user data protection | High | Low | Use established authentication libraries (Passport.js, bcrypt), implement input validation and sanitization, follow OWASP security best practices, conduct security code review, use HTTPS for all communications |
| Low user adoption and engagement after deployment | Medium | Medium | Design intuitive UI/UX with user testing, create comprehensive user guide and onboarding flow, conduct usability testing with target users, promote within campus community, gather and act on user feedback |
| Scope creep affecting timeline and deliverables | High | Medium | Clearly define and document scope in this document, use strict change control process, prioritize features and defer non-critical items to future versions, limit changes during development phase, maintain feature freeze before testing |
| Integration challenges between frontend, backend, and AI components | Medium | Medium | Define clear API contracts early, use modular architecture with well-defined interfaces, conduct integration testing throughout development, maintain comprehensive API documentation, hold regular team sync meetings |
| Free tier limitations on cloud services affecting functionality | Low | Low | Monitor usage carefully, optimize resource usage (image compression, efficient queries), have backup providers identified, scale down non-essential features if needed, request student credits from providers |

---

## Project Success Criteria

- **Functional Completeness:** All 14 functional requirements (FR1-FR14 from Requirements Document) are successfully implemented and operational
- **Performance Standards:** System achieves sub-2-second response time for 95% of user operations and maintains 99% uptime during 2-week testing period
- **Usability Achievement:** At least 80% of test users (minimum 10 users) successfully complete key tasks (post item, search, view matches, claim) without assistance on first attempt
- **AI Matching Effectiveness:** Multi-modal similarity ranking returns at least one correct match in top 5 results for 75% of test cases with known ground truth
- **Explainability Quality:** At least 80% of users understand why items are matched based on provided explanations (verified through user survey)
- **Code Quality:** All code follows team coding standards, has meaningful comments, passes ESLint checks, and receives approval in code review
- **Testing Coverage:** At least 80% of critical user flows have corresponding test cases with successful execution, all acceptance criteria validated
- **Documentation Completeness:** All required deliverables are submitted on time with comprehensive documentation meeting course requirements
- **User Satisfaction:** Test users rate the platform at least 4 out of 5 stars for ease of use, usefulness, and AI matching quality
- **GitHub Repository Quality:** Project maintains clear commit history with meaningful messages, shows individual contributions per team member, follows branching strategy, includes README with setup instructions
- **Deployment Success:** Application is successfully deployed to production environment, accessible via public URL, with all features working as expected
- **Project Timeline:** Project is completed within the allocated 160 person-hours with all major milestones met on schedule
