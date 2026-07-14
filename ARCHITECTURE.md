# Laravel Admin Skeleton

A production-ready Laravel Admin Skeleton built for rapid project development.

---

# Philosophy

This project is **NOT** an admin template.

It is a reusable, opinionated Laravel starter kit designed to start new projects in minutes instead of rebuilding the same foundation every time.

Every decision in this project should prioritize:

- Simplicity
- Maintainability
- Reusability
- Consistency
- Production readiness

---

# Technology Stack

## Backend

- Laravel 13
- PHP 8.3+
- MySQL
- Inertia.js

## Frontend

- React 19
- JavaScript (No TypeScript)
- Tailwind CSS v4
- shadcn/ui
- Lucide Icons
- Vite 8
- next-themes
- Sonner
- Axios

Future

- Sanctum
- Ziggy
- Spatie Permission

---

# Development Principles

## 1. File-by-file development

Never modify multiple files at once.

Complete one file.

Test.

Commit.

Move to the next file.

---

## 2. Never assume project structure

Always inspect the current file before making changes.

---

## 3. Every commit must build successfully

Workflow

Code

↓

Build

↓

Test

↓

Commit

Never commit broken code.

---

## 4. Reusable before page-specific

If something can be reused,

create a reusable component.

Never duplicate UI.

---

# Folder Structure

```
resources/js

Components/
    app/
    shared/
    ui/

Layouts/

Pages/

Providers/

hooks/

lib/

services/

utils/

constants/
```

Backend

```
app/

Actions/

Enums/

Helpers/

Services/

Traits/

Support/
```

---

# Naming Convention

Use PascalCase.

Examples

```
Dashboard/
    Index.jsx

Users/
    Index.jsx
    Create.jsx
    Edit.jsx
```

Components

```
AppSidebar.jsx

AppHeader.jsx

AppTable.jsx

AppPagination.jsx

AppSearch.jsx
```

---

# Providers

All global providers belong inside

```
AppProvider
```

Examples

- ThemeProvider
- TooltipProvider
- Sonner
- Future QueryProvider

The app entry file should stay minimal.

```
<AppProvider>
    <App />
</AppProvider>
```

Never place business logic inside app.jsx.

---

# Layout Architecture

```
AuthenticatedLayout

├── AppSidebar

└── Content

     ├── AppHeader

     └── children
```

Pages must never contain

- Sidebar
- Header
- Theme logic

They belong to the layout.

---

# Header

Header should contain

- Sidebar Toggle
- Logo
- Application Name
- Search
- Notifications
- Theme Toggle
- User Dropdown

---

# Sidebar

Keep it minimal.

Default menu

```
Dashboard
```

Every project can extend it.

---

# User Dropdown

Only

- Profile
- Logout

---

# Notifications

UI only.

Backend implementation later.

---

# Theme

Support

- Light
- Dark
- System

using next-themes.

---

# Search

Header search only.

Backend implementation is project specific.

---

# Reusable Components

## Layout

- AppSidebar
- AppHeader
- AppPageHeader

---

## Data

- AppTable
- AppPagination
- AppSearch

---

## UI

- AppLoading
- AppEmptyState
- AppStatusBadge
- AppConfirmDialog
- AppDeleteDialog

---

# AppPageHeader

Should support

- title
- description
- actions

Example

```jsx
<AppPageHeader
    title="Users"
    description="Manage application users."
    actions={<Button>Create User</Button>}
/>
```

---

# Tables

Every project should use

```jsx
<AppTable
    columns={columns}
    data={users}
/>
```

Pagination

```jsx
<AppPagination
    paginator={users}
    filters={filters}
/>
```

Use server-side pagination.

Never use client-side pagination.

---

# Authentication

Admin only.

Includes

- Login
- Forgot Password
- Reset Password
- Profile
- Logout

API authentication will be added later.

---

# Git Commit Rules

Each milestone should have its own commit.

Example

```
Initial Laravel 13 installation

Setup React foundation

Initialize shadcn/ui

Setup app providers

Build authenticated layout

Build sidebar

Build header

Implement dashboard
```

---

# Versioning

Use semantic versioning.

Examples

```
v0.1.0

Foundation

v0.2.0

Layout

v0.3.0

Authentication

v1.0.0

Stable Skeleton
```

---

# Current Status

Completed

- Laravel 13
- React 19
- Inertia
- Tailwind CSS v4
- shadcn/ui
- Sidebar
- Theme package
- Sonner
- AppProvider
- Build passing

---

# Next Milestone

Build reusable layout components

1. AppSidebar
2. AppHeader
3. AuthenticatedLayout
4. Dashboard

No architecture changes after this point.
