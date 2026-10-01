# Architecture Document
**Project:** The Ultimate Cheat-Meal & Street Food Finder  
**Version:** 1.0  
**Date:** 2026-09-24

## 1. System Context
```mermaid
graph TB
    U[User]
    A[Admin]
    FE[Web Frontend]
    API[Express REST API]
    DB[(Relational Database)]

    U --> FE
    A --> FE
    FE --> API
    API --> DB
```

## 2. Component Breakdown
### Frontend
- Home/search interface
- Category browser
- Vendor listing/details
- Dish listing/details
- Review display/form
- Responsive navigation

### Backend
- Vendor module
- Category module
- Dish module
- Review module
- User/authentication module
- Search/filter module
- Admin/data-management module

### Database
- vendors
- categories
- dishes
- users
- user_reviews

## 3. Data Relationships
```mermaid
erDiagram
    VENDORS ||--o{ DISHES : offers
    CATEGORIES ||--o{ DISHES : contains
    USERS ||--o{ USER_REVIEWS : writes
    DISHES ||--o{ USER_REVIEWS : receives

    VENDORS {
        int vendor_id PK
        string vendor_name
        string vendor_type
    }

    CATEGORIES {
        int category_id PK
        string category_name
    }

    DISHES {
        int dish_id PK
        int vendor_id FK
        int category_id FK
        string dish_name
        decimal price
        int spice_level
    }

    USERS {
        int user_id PK
        string full_name
        string email
    }

    USER_REVIEWS {
        int review_id PK
        int user_id FK
        int dish_id FK
        int rating
        string review_text
    }
```

## 4. Request Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Express API
    participant DB as Database

    U->>FE: Search for food
    FE->>API: GET /api/dishes?search=...
    API->>DB: Parameterized query
    DB-->>API: Matching dishes
    API-->>FE: JSON results
    FE-->>U: Display results
```

## 5. Architectural Principles
- Keep frontend, backend, and database responsibilities separated.
- Keep SQL/database logic out of UI code.
- Validate input at the API boundary.
- Use foreign keys for relational integrity.
- Use parameterized queries.
- Keep documentation synchronized with implementation.
