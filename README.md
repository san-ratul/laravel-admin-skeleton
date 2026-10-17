# Laravel Admin Skeleton

A production-ready Laravel Admin Skeleton designed to accelerate development of modern web applications.

This project is **not an admin template**. It is a reusable, opinionated Laravel starter kit that provides a clean architecture, consistent conventions, and production-ready foundations for future projects.

---

# Philosophy

Every decision in this project prioritizes:

- Simplicity
- Maintainability
- Reusability
- Consistency
- Laravel Best Practices
- Production Readiness

The goal is to eliminate repetitive setup work so every new project starts with a solid foundation.

---

# Features

## Authentication

- Login
- Registration
- Password Reset
- Email Verification
- Profile Management
- Password Update
- Avatar Upload

## Admin Panel

- Responsive Sidebar
- Responsive Header
- Dark / Light Theme
- User Navigation
- Flash Messages
- Shared Layouts

## Roles & Permissions

- Role CRUD (create, update, delete)
- Multiple roles per user
- Permission attach / detach per role
- Super Admin role with full bypass
- `permission` / `role` route middleware
- Gate-based permission checks (`$user->can('users.create')`)
- Shared permissions with the frontend (`useAuth().can()`)
- Read-only permission registry (permissions are never deletable)

### Permission Command

Create full CRUD permissions for a key:

```bash
php artisan permission:create users
# Creates: users.view, users.create, users.update, users.delete
```

Options:

```bash
# Custom actions only
php artisan permission:create invoices --actions=view,export,pay

# Assign the created permissions to roles
php artisan permission:create users --role=editor,manager
```

The command is idempotent — existing keys are skipped, never duplicated.

### Permission Seeder

The `PermissionSeeder` truncates the permissions table (clearing role
relations first) and rebuilds it from the `config/permissions.php`
registry. Keys are unique — re-running never inserts duplicates.

```bash
php artisan db:seed --class=PermissionSeeder
```

Run `php artisan migrate --seed` on a fresh install to seed permissions,
roles, and the initial super admin account (`admin@example.com` /
`password`). Add new keys to `config/permissions.php` so they survive a
re-seed.

### Protecting Routes

```php
Route::get('/posts', ...)->middleware('permission:posts.view');

// Any-of multiple permissions
Route::post('/posts', ...)->middleware('permission:posts.create,posts.update');

// By role slug
Route::get('/audit', ...)->middleware('role:super-admin');
```

## API Foundation

- Standardized API Responses
- API Response Builder
- Business Error Codes
- Global Exception Handling
- Pagination Responses
- Trace ID Support
- Consistent JSON Structure

## Testing

- API Response Tests
- Validation Tests
- Pagination Tests

---

# Technology Stack

## Backend

- Laravel 13
- PHP 8.3+
- MySQL
- Inertia.js

## Frontend

- React 19
- JavaScript
- Tailwind CSS v4
- shadcn/ui
- Base UI
- Ziggy
- Axios
- Sonner
- next-themes
- Vite 8

## Planned

- Laravel Sanctum
- Scramble API Documentation

---

# Project Structure

```
app/
├── Actions
├── Enums
├── Helpers
├── Services
├── Support
└── Traits

resources/js/
├── Components
├── Layouts
├── Pages
├── Providers
├── hooks
├── services
├── constants
└── utils

routes/
├── web.php
├── auth.php
├── admin.php
└── api.php
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
composer install
npm install
```

Create environment

```bash
cp .env.example .env
```

Generate application key

```bash
php artisan key:generate
```

Run migrations

```bash
php artisan migrate
```

Start development server

```bash
composer run dev
```

---

# Available Commands

Development

```bash
composer run dev
```

Run Tests

```bash
php artisan test
```

Build Assets

```bash
npm run build
```

Code Formatting

```bash
vendor/bin/pint
```

---

# API Response Format

## Success

```json
{
    "success": true,
    "status": 200,
    "code": "SUCCESS",
    "message": "Success.",
    "data": {},
    "meta": {
        "trace_id": "..."
    }
}
```

## Validation Error

```json
{
    "success": false,
    "status": 422,
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "errors": {},
    "meta": {
        "trace_id": "..."
    }
}
```

## Pagination

```json
{
    "success": true,
    "status": 200,
    "code": "SUCCESS",
    "message": "Paginated.",
    "data": [],
    "meta": {
        "trace_id": "...",
        "pagination": {
            "current_page": 1,
            "last_page": 1,
            "per_page": 10,
            "total": 10,
            "from": 1,
            "to": 10,
            "has_more_pages": false
        }
    }
}
```

---

# Development Principles

- Work file-by-file
- Follow Laravel conventions
- Avoid unnecessary abstractions
- Prefer reusable components
- Keep the architecture simple
- Build → Test → Commit

---

# Roadmap

## v1.0

- Authentication
- Admin Layout
- Profile Management
- Theme Support
- API Foundation
- Testing

## Future

- Scramble API Documentation
- Laravel Sanctum
- Settings Module
- Activity Log

---

# License

This project is open-sourced software licensed under the MIT License.
