# Business Requirements Document (BRD)
**Project:** The Ultimate Cheat-Meal & Street Food Finder  
**Version:** 1.0  
**Date:** 2026-09-24  
**Status:** DRAFT FOR REVIEW  
**Project Type:** Academic DBMS / Full-Stack Project

## 1. Executive Summary
The Ultimate Cheat-Meal & Street Food Finder provides a centralized way for users to discover local street-food vendors, food trucks, and dishes according to cravings, food categories, price, spice level, ratings, and reviews. The platform addresses the difficulty of finding specific local food options when information is scattered across social media, word of mouth, and individual vendor pages.

The project will demonstrate practical database design and SQL skills through structured vendor, dish, category, user, and review data. It will support relational queries such as JOIN, GROUP BY, AVG, COUNT, filtering, sorting, and foreign-key relationships.

## 2. Business Objectives
| Objective | Metric | Target |
|---|---|---|
| Centralize food information | Vendors/dishes stored in database | Core vendor and dish catalog |
| Improve food discovery | Search/filter usage | Users can find dishes by keyword/category |
| Support informed choices | Ratings and reviews | Every reviewed dish displays rating data |
| Demonstrate relational DBMS concepts | SQL feature coverage | PK, FK, JOIN, GROUP BY, aggregates, constraints |
| Identify popular food options | Rating aggregation | Highest-rated dishes/vendors can be queried |

## 3. Scope
### In Scope
- Vendor and food-truck profiles
- Dish catalog
- Food categories
- Dish search
- Category filtering
- Price and spice-level information
- User accounts
- User ratings and reviews
- Vendor/dish rating aggregation
- SQL-based discovery queries
- Responsive web interface
- Admin/data-management functionality as required by the team

### Out of Scope
- Online payment processing
- Food delivery
- Delivery tracking
- Logistics management
- Restaurant POS integration
- Multi-city commercial deployment
- AI recommendation engine in the MVP
- Real-time delivery tracking

## 4. Stakeholders
| Stakeholder | Need | Influence |
|---|---|---|
| Students / Food Seekers | Find food matching cravings | High |
| Local Vendors / Food Trucks | Display vendors and signature dishes | Medium |
| Project Team | Build and demonstrate the system | High |
| Faculty / Evaluator | Verify DBMS concepts and project quality | Critical |
| Admin / Data Manager | Maintain reliable vendor, dish, and review data | High |

## 5. Functional Requirements
| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | Users can browse vendors | Must Have | Vendor list displays name and basic details |
| FR-02 | Users can view vendor details | Must Have | Vendor page displays location, hours, and dishes |
| FR-03 | Users can browse dishes | Must Have | Dish details include name, price, category, and vendor |
| FR-04 | Dishes belong to categories | Must Have | Each dish can be associated with a category |
| FR-05 | Users can search dishes/vendors | Must Have | Keyword search returns matching records |
| FR-06 | Users can filter dishes | Must Have | Category, price, and relevant food attributes can be filtered |
| FR-07 | Users can submit reviews | Must Have | Authenticated users can submit a rating and review |
| FR-08 | Users can view reviews | Must Have | Dish/vendor pages display review information |
| FR-09 | System can calculate average ratings | Must Have | SQL aggregate query calculates rating averages |
| FR-10 | System can identify highly rated vendors/dishes | Must Have | GROUP BY and ORDER BY queries return aggregated results |
| FR-11 | Admin can manage core data | Should Have | Authorized admin can manage vendors, dishes, categories, and reviews |

## 6. Non-Functional Requirements
- **Usability:** Search and browsing should be understandable to first-time users.
- **Performance:** Normal search requests should return within approximately 2 seconds under expected academic-project load.
- **Security:** Passwords must not be stored in plaintext; database credentials must not be committed to source control.
- **Integrity:** Foreign keys and appropriate constraints must prevent invalid relationships.
- **Availability:** The MVP should remain usable during demonstrations and evaluation.
- **Maintainability:** Database schema, API contracts, and project documentation should remain synchronized.
- **Responsiveness:** The interface should work on desktop and mobile screens.

## 7. Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Incomplete food data | Medium | Prepare representative seed data |
| Duplicate vendors/dishes | Medium | Use validation and unique constraints where appropriate |
| Invalid reviews | Medium | Validate rating range and required fields |
| Poor database relationships | High | Review ER diagram before implementation |
| Scope creep | High | Follow approved BRD and formal change process |
| SQL/query errors | Medium | Maintain and test a dedicated queries.sql file |

## 8. Success Criteria
- Core database tables and relationships implemented.
- Vendor, dish, category, user, and review data can be stored and retrieved.
- Foreign-key relationships work correctly.
- Search/filter functionality works.
- Reviews and ratings are displayed.
- GROUP BY and aggregate queries identify highly rated food options.
- ER diagram and relational schema match the implemented database.
- Documentation is complete and synchronized.

## 9. Assumptions & Dependencies
- The project team can obtain representative local food/vendor data.
- The selected relational DBMS is available to all team members.
- Faculty approves the project scope and documentation.
- The MVP does not require online payment or delivery functionality.
- Users submitting reviews are represented by records in the Users table.

## 10. Approval
Project Reviewer: ____________________  
Date: ____________________  
Project Leader: ____________________  
Date: ____________________
