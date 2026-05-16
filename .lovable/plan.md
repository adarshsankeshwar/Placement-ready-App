
# Placement Readiness Platform

## Overview
A placement preparation app with a public landing page and a dashboard area for students to practice, assess, and track their progress.

## Color Scheme
- Indigo/purple theme with primary color `hsl(245, 58%, 51%)` applied throughout the app

## Pages & Features

### 1. Landing Page (`/`)
- **Hero Section**: "Ace Your Placement" heading, "Practice, assess, and prepare for your dream job" subheading, and a prominent "Get Started" button that navigates to the Dashboard
- **Features Grid**: Three cards in a responsive grid:
  - "Practice Problems" with a code icon and short description
  - "Mock Interviews" with a video icon and short description
  - "Track Progress" with a chart icon and short description
- **Footer**: Simple copyright text

### 2. Dashboard Layout (shared shell for all dashboard routes)
- **Sidebar**: Navigation links with lucide-react icons for Dashboard, Practice, Assessments, Resources, and Profile — with active route highlighting
- **Header**: "Placement Prep" branding and a user avatar placeholder
- **Content Area**: Renders child routes via `<Outlet />`

### 3. Dashboard Pages (placeholder content for each)
- `/dashboard` — Dashboard overview
- `/dashboard/practice` — Practice problems
- `/dashboard/assessments` — Assessments
- `/dashboard/resources` — Resources
- `/dashboard/profile` — Profile

All pages will be responsive and styled with the indigo/purple color scheme.
