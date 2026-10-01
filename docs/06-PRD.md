# Product Requirements Document (PRD)
**Project:** The Ultimate Cheat-Meal & Street Food Finder  
**Version:** 1.0  
**Date:** 2026-09-24  
**BRD Reference:** v1.0

## 1. Product Vision
Provide a simple food-discovery experience where users can search local vendors and dishes, explore categories, compare food information, and use ratings/reviews to understand what other users thought about a dish.

## 2. Target Personas
| Persona | Goal | Frustration |
|---|---|---|
| Food Seeker | Find a specific craving | Food information is scattered |
| Student | Find affordable local food | Hard to compare prices |
| Food Explorer | Discover new dishes | Does not know which vendors offer them |
| Vendor/Data Manager | Maintain accurate listings | Information becomes outdated |

## 3. User Stories
| ID | User Story | Priority | BRD |
|---|---|---|---|
| US-01 | As a user, I want to search for a dish so I can find food matching my craving. | Must Have | FR-05 |
| US-02 | As a user, I want to browse categories so I can explore food types. | Must Have | FR-04 |
| US-03 | As a user, I want to view vendor details so I know where a dish is available. | Must Have | FR-02 |
| US-04 | As a user, I want to see price and food attributes before choosing a dish. | Must Have | FR-03 |
| US-05 | As a user, I want to read reviews and ratings before choosing a dish. | Must Have | FR-08 |
| US-06 | As a user, I want to submit a review after trying a dish. | Must Have | FR-07 |
| US-07 | As a user, I want to see highly rated vendors/dishes. | Must Have | FR-09, FR-10 |
| US-08 | As an administrator, I want to manage food data. | Should Have | FR-11 |

## 4. Product Flows
### Search Flow
Home → Search → Keyword/filter → Results → Dish → Vendor → Reviews

### Review Flow
Login → Dish → Write Review → Rating + Text → Validate → Save → Display

### Discovery Flow
Home → Category → Dishes → Dish Details → Vendor Details

## 5. Product Requirements
- Search by dish or vendor name.
- Filter by category.
- Display vendor and dish information.
- Display price and food attributes.
- Display average ratings.
- Display individual reviews.
- Allow authenticated users to submit reviews.
- Provide top-rated query results.

## 6. MVP Exclusions
- Payments
- Delivery
- Delivery tracking
- AI recommendations
- Commercial multi-city logistics

## 7. Product Acceptance
The MVP is acceptable when a user can discover a dish, identify its vendor/category, view ratings/reviews, and the underlying database demonstrates correct relational integrity and required SQL operations.
