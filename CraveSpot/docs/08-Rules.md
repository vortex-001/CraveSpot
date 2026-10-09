# Coding Rules & AI Guardrails
**Project:** The Ultimate Cheat-Meal & Street Food Finder  
**Version:** 1.0  
**Status:** ACTIVE

## 1. Mandatory Stack
- Frontend: HTML5, CSS3, JavaScript
- Backend: Node.js + Express
- Database: MySQL or PostgreSQL, selected before implementation
- Version control: Git + GitHub

## 2. Forbidden Practices
- Never commit database passwords or API secrets.
- Never store plaintext passwords.
- Never construct SQL by directly concatenating untrusted user input.
- Do not bypass foreign-key relationships.
- Do not create duplicate tables for the same business entity without approval.
- Do not add major features outside the approved BRD.
- Do not commit untested database changes.

## 3. Database Rules
- Every table must have a primary key.
- Foreign keys must be used for defined relationships.
- Use meaningful snake_case names.
- Use NOT NULL, UNIQUE, CHECK, and other constraints where appropriate.
- Document indexes before adding them.
- Maintain schema.sql and seed.sql.
- Keep test data separate from production-style data.

## 4. Backend Rules
- Validate request data.
- Use parameterized queries/prepared statements.
- Return appropriate HTTP status codes.
- Keep route, controller/service, and database responsibilities separated where practical.
- Do not expose sensitive data.
- Handle database errors safely.

## 5. Frontend Rules
- Use semantic HTML.
- Keep layouts responsive.
- Provide accessible labels and alt text.
- Display user-friendly error states.
- Do not trust client-side validation as a security control.

## 6. AI Coding Guardrails
AI must:
1. Read this Rules.md before generating project code.
2. Reference the relevant BRD/TRD requirement.
3. Include or propose relevant tests with generated implementation.
4. Reuse existing project patterns.
5. Ask when requirements are ambiguous instead of silently inventing requirements.
6. Avoid adding libraries unless the team approves them.
7. Never remove security or validation checks for convenience.
8. Never modify this Rules.md unless the team explicitly approves a documentation change.

## 7. Documentation Sync
- New API → update TRD.
- Database schema change → update TRD/ER documentation.
- Architecture change → update Architecture.md.
- Scope change → update BRD after approval.
- Sprint decision → update Memory.md.
- Breaking change → update affected documentation before merge.

## 8. Git Rules
- Use feature branches.
- Open pull requests for team review.
- Do not push directly to main.
- Every issue should reference BRD/TRD requirements.
