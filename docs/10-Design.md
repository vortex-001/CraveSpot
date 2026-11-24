# CraveSpot UI Design System

**Project:** CraveSpot — Hyper-Local Restaurant Discovery & Intelligent Craving Recommendation Engine  
**Version:** 2.0  
**Design Lead:** Simran & Taranpreet (Frontend Engineers)  
**System Architect:** Harsh Garg  

---

## 1. Visual Direction & Design Philosophy

The CraveSpot user interface is crafted to evoke appetite, discovery, and clarity. It employs a warm culinary color palette accented by modern tech navy tones, responsive mobile-first grid layouts, subtle micro-interactions, and accessible high-contrast typography.

---

## 2. Color Palette & Design Tokens

| Token | Hex Value | Description / Usage |
|---|---|---|
| `--color-primary` | `#FF6B35` | Vibrant Warm Orange — Primary CTA buttons, active chips, brand highlights |
| `--color-primary-dark` | `#E8551E` | Deep Orange — Button hover states, emphasized badges |
| `--color-secondary` | `#0B7E9C` | Oceanic Teal — Section tags, informative badges, link highlights |
| `--color-navy-dark` | `#10305B` | Deep Navy — Navigation bars, card headers, high-emphasis text |
| `--color-body` | `#1B2B45` | Slate Charcoal — High-contrast readable body text and paragraph content |
| `--color-muted` | `#5A6B87` | Steel Grey — Secondary descriptions, captions, timestamps |
| `--color-surface` | `#FFFFFF` | Pure White — Card surfaces, modal backgrounds, input fields |
| `--color-bg` | `#F8FAFC` | Light Slate — Page background fill |
| `--color-success` | `#16A34A` | Forest Green — Pure Veg badges, successful toast notifications |
| `--color-danger` | `#DC2626` | Crimson Red — Non-Veg badges, destructive actions, error states |

---

## 3. Typography Hierarchy

- **Font Family:** `Segoe UI`, `-apple-system`, `BlinkMacSystemFont`, `Roboto`, `sans-serif`
- **Heading 1:** 2.25rem (36px), Bold, line-height 1.2
- **Heading 2:** 1.75rem (28px), Semi-bold, line-height 1.3
- **Heading 3:** 1.25rem (20px), Semi-bold, line-height 1.4
- **Body Text:** 1.0rem (16px), Regular, line-height 1.6
- **Captions & Badges:** 0.8125rem (13px), Medium, line-height 1.4
- **Code / Monospace:** `Consolas`, `Monaco`, `monospace`

---

## 4. UI Components & Patterns

- **Craving Mood Chips:** Rounded pill elements (`border-radius: 9999px`) with hover elevation and toggle states.
- **Dish Cards:** Elevation-styled containers with fixed 16:9 authentic photography headers, diet badges, spice indicators, and price tags.
- **Distance Slider:** Interactive HTML5 range slider displaying real-time radius updates in kilometers.
- **Location Modal:** Quick modal for switching between active cities (Chandigarh, Mohali, Panchkula) or triggering browser GPS coordinate detection.
