# Renovate — Modern SaaS Dashboard Template

A reusable, deeply-customizable dashboard scaffold for SaaS / CRM products. Built with Next.js 14 App Router, TypeScript strict, an atomic design system, a JSON-file repository layer (swappable for Postgres/Mongo), an admin-driven theme customizer, and a dynamic page-builder with a plugin-style widget API.

This file is the **operator manual** — what each part of the system does, how to extend it, and how to deploy it. Browse `app/design-system` in the running app for a live reference of every primitive.

---

## Goals

- Be a foundation, not a finished product. Add your domain on top.
- Look like a paid template. Restrained palette, careful typography, real empty states.
- Stay extensible. Pages, navigation, theme, widgets, and storage are all hot-swappable from outside the core code.

---

## Tech stack

| Concern        | Choice                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| Framework      | Next.js 14.2 App Router, React 18, TypeScript 5 (strict)                 |
| Styling        | Tailwind CSS 3.4 + CSS variables (theme-driven)                         |
| Backend        | Next.js Route Handlers (`app/api/*`) — no separate server               |
| Storage        | `lowdb` JSON in `/data` behind a repository interface (swappable)        |
| Auth           | NextAuth.js 4 credentials provider, bcrypt-hashed passwords             |
| Client state   | Zustand                                                                 |
| Server state   | TanStack Query                                                          |
| Forms          | React Hook Form + Zod                                                   |
| Tables         | TanStack Table                                                          |
| Charts         | Recharts                                                                |
| Drag & drop    | @dnd-kit (kanban board, navigation builder)                             |
| Icons          | Lucide React                                                            |
| Animations     | Framer Motion (used sparingly), Tailwind keyframes                      |
| Tooling        | ESLint, Prettier, Husky, lint-staged, commitlint (Conventional Commits) |

---

## Folder structure

```
app/                        Next.js App Router routes
  (auth)/                   Public auth flows (login / register / forgot)
  (dashboard)/              Authenticated dashboard segment
    layout.tsx              Server layout: loads user, navigation, notifications
    DashboardShell.tsx      Client wrapper around DashboardLayout
    page.tsx                Overview (home)
    analytics/, customers/, products/, orders/, invoices/, calendar/,
      kanban/, messages/, reports/, profile/, notifications/
    customers/[id]/         Customer detail page
    admin/                  Admin-only routes (theme, pages, navigation, users, settings, activity)
    [...slug]/              Catch-all renderer for admin-built pages
  api/                      Route Handlers (auth, theme, pages, navigation, users, ...)
  design-system/            Mini Storybook documenting atoms & molecules
  not-found.tsx, error.tsx, 403/                  Branded error pages

src/
  components/
    atoms/      Button, Input, Label, Badge, Avatar, Spinner, Switch, Checkbox, Skeleton, Kbd, Select
    molecules/  FormField, SearchBar, Card, DropdownMenu, Tooltip, StatCard,
                Tabs, Pagination, ColorPicker, EmptyState, SegmentedControl
    organisms/  Sidebar, Header, DataTable, ChartCard, Modal, Drawer,
                ConfirmDialog, ActivityTimeline, WidgetRenderer, charts/
    templates/  AuthLayout, DashboardLayout
  design-system/
    tokens.ts   Spacing, fontSize, radius, font families, color presets
    theme.ts    ThemeConfig + applyThemeToDocument() (mutates CSS vars on <html>)
  widgets/
    registry.ts Plugin API: registerWidget(), getWidget(), listWidgets()
    builtins/   Built-in widget definitions (loaded at module import)
  lib/
    db.ts                 Memoized lowdb instance
    repositories/
      base.ts             Repository<T> interface + LowdbRepository implementation
      index.ts            Concrete instances (userRepo, customerRepo, themeRepo, …)
    auth.ts               NextAuth options + getCurrentUser / requireUser / requireRole
    activity.ts           logActivity(user, action, target) audit-log helper
    utils/                cn, format helpers
  hooks/                  useTheme (Zustand-backed)
  stores/                 (room for future Zustand stores)
  types/                  Domain types (User, Customer, Page, Widget, NavItem, …)

plugins/
  example-counter-widget/ End-to-end example of a 3rd-party widget plugin

data/                     Generated at runtime by lowdb (gitignored)
  seed/                   (committed seed source if you add one)
  db.json                 lowdb database file

scripts/
  seed.ts                 Populates data/db.json with demo data + admin user

middleware.ts             Auth gate (everything except /login, /register, /api/auth, etc.)
```

---

## Setup

```bash
# 1. Install
npm install

# 2. Seed the database with demo data + accounts (idempotent — safe to re-run)
npm run seed

# 3. Copy env file
cp .env.example .env.local
# Set NEXTAUTH_SECRET to a long random string. NEXTAUTH_URL is fine for local dev.

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### Default credentials (seeded)

| Role   | Email                  | Password    |
| ------ | ---------------------- | ----------- |
| Admin  | `admin@example.com`    | `admin123`  |
| Editor | `editor@example.com`   | `editor123` |
| Viewer | `viewer@example.com`   | `viewer123` |

> **Production:** Run `npm run seed` once to bootstrap, then immediately reset every demo password from `Admin → Users & roles`. The repo's middleware will refuse anonymous traffic but not weak demo creds.

### Scripts

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start Next.js in development mode             |
| `npm run build`     | Build for production                          |
| `npm start`         | Run the production build                      |
| `npm run lint`      | ESLint                                        |
| `npm run typecheck` | `tsc --noEmit`                                |
| `npm run seed`      | Reset and seed `data/db.json`                 |
| `npm run format`    | Format the workspace with Prettier            |

### Environment variables

| Var                | Required | Notes                                                          |
| ------------------ | -------- | -------------------------------------------------------------- |
| `NEXTAUTH_SECRET`  | yes      | Long random string. `openssl rand -base64 32` works.           |
| `NEXTAUTH_URL`     | dev only | E.g. `http://localhost:3000`. Vercel sets this automatically.  |

There are no secrets you should commit. `data/db.json` is gitignored.

---

## Design system usage

Every primitive consumes Tailwind utilities that resolve to CSS variables (`bg-primary`, `text-fg-muted`, `border-border`, `rounded-md`, etc.). Those variables are mutated at runtime by `applyThemeToDocument()` in `src/design-system/theme.ts`.

### Adding a new color preset

1. Open `src/design-system/tokens.ts` and append to `colorPresets`:

   ```ts
   {
     id: 'plum',
     label: 'Plum',
     primary: '286 60% 38%',
     primaryFg: '0 0% 100%',
     primarySoft: '286 60% 94%',
     accent: '160 60% 40%',
     accentFg: '0 0% 100%',
     accentSoft: '160 60% 92%',
   }
   ```

2. Add `'plum'` to the enum in `app/api/theme/route.ts`'s Zod schema.
3. The customizer picks it up automatically.

### Live preview, instant apply

The Theme Customizer (`/admin/theme`) writes into the Zustand `themeStore`, which calls `applyThemeToDocument()` on every change. **Save** persists to `data/db.json` via `PUT /api/theme`. On the next request, the SSR root layout picks up the saved theme and inlines the CSS vars on `<html>` — no flash.

---

## How to add a new widget

Two paths.

### Path 1 — built-in widget (lives in this repo)

1. Create `src/widgets/builtins/MyWidget.tsx` with a default-exported component:

   ```tsx
   'use client';
   export function MyWidget({ config }: { config: Record<string, unknown> }) {
     // your component
   }
   ```

2. Open `src/widgets/builtins/index.tsx` and register it:

   ```tsx
   registerWidget({
     type: 'my-widget',
     label: 'My widget',
     icon: <Sparkles size={14} />,
     description: 'Does the thing.',
     schema: z.object({ message: z.string().default('Hello') }),
     defaultConfig: { message: 'Hello' },
     defaultSpan: 6,
     Component: MyWidget,
   });
   ```

3. The widget appears in `Admin → Pages → (any page) → Add widget`.

### Path 2 — external plugin (no core changes)

See `plugins/example-counter-widget/index.tsx`. The shape is the same — call `registerWidget(...)` from a module that's imported before pages render. This repo imports the example from `app/providers.tsx`. For your own plugins, do the same.

You can publish a plugin as an npm package; consumers just `import 'my-plugin'` from `providers.tsx` to register it.

---

## How to add a new page

### Without code (admin panel)

1. Sign in as admin.
2. `Admin → Pages → New page`. Set a title and a slug (`my-dashboard`).
3. Open the page builder and add widgets. Save.
4. Navigate to `/my-dashboard` — it renders via the catch-all `app/(dashboard)/[...slug]/page.tsx`.
5. Optional: open `Admin → Navigation` to drag the new page into a sidebar group.

Pages are stored in `data/db.json`. No deploy needed.

### With code (a hand-built route)

Add a normal Next.js route under `app/(dashboard)/<route>/page.tsx`. It will inherit the dashboard layout (sidebar, header, auth gate). For admin-only pages, also call `await requireRole('admin')` at the top of the server component.

---

## RBAC

Three roles: `admin`, `editor`, `viewer`.

- `admin` — everything: theme, pages, navigation, users, settings, activity.
- `editor` — can create and edit pages, but not theme/users/navigation.
- `viewer` — read-only on dashboard pages.

Server-side enforcement lives in:

- `src/lib/auth.ts` — `requireUser()`, `requireRole(role | role[])`.
- Each admin route handler calls `await requireRole('admin')` first.
- The dashboard layout filters out admin nav items for non-admins.

If a non-admin browses to an admin URL, `requireRole` redirects to `/403`.

---

## How to swap the storage layer

The repository pattern is the seam. Each entity repo (`userRepo`, `customerRepo`, …) implements `Repository<T>` from `src/lib/repositories/base.ts`. To replace lowdb with Postgres/Mongo:

1. Implement a new class against your driver:

   ```ts
   class PgUserRepository implements Repository<User> {
     async list(opts) { /* SELECT … */ }
     async findById(id) { /* SELECT … WHERE id = $1 */ }
     async create(input) { /* INSERT … RETURNING * */ }
     async update(id, patch) { /* UPDATE … RETURNING * */ }
     async delete(id) { /* DELETE … */ }
     async count() { /* SELECT count(*) */ }
   }
   ```

2. In `src/lib/repositories/index.ts`, swap the export:

   ```ts
   export const userRepo = new PgUserRepository(pool);
   ```

3. Pages & route handlers don't change — they only know the interface.

You can migrate incrementally — keep some entities on lowdb while moving others to Postgres.

---

## Deployment

### Vercel

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set `NEXTAUTH_SECRET` in environment variables.
4. **Important:** the lowdb file is *local*. On Vercel's serverless platform, the filesystem is ephemeral and cross-instance writes don't sync. Before deploying to Vercel, swap to a real database (see "Swap the storage layer"). For demos, you can run on Vercel without writes — reads still work because the seed data ships in the repo if you commit `data/db.json` (currently gitignored).

### Self-hosted (Docker / VPS)

`npm run build && npm start` works as a long-running Node process. Mount `/data` as a persistent volume so writes survive restarts.

---

## Tier-of-polish disclosure

This template was scoped to ship 24 pages plus an admin panel in a single session. The result is:

- **Tier A (high polish):** Login, Register, Forgot Password, Overview, Customers, Customer Detail, Products, Orders, Theme Customizer, Page Builder, Navigation Builder, Users & Roles, Design System docs, 404, 500, 403.
- **Tier B (functional, lighter polish):** Analytics, Invoices, Calendar, Kanban, Messages, Reports, Profile, Notifications, Settings, Activity Log.

Everything in Tier B is wired end-to-end and renders real data; the surface treatment is more utilitarian. If you adopt this as a foundation, expect to spend some hours raising the floor on Tier B before showing it to a customer.

### Known gaps / TODOs

- **Forgot password** is UI-only. No email transport. Integrate Resend / Postmark / SES in a route handler.
- **PDF preview** on invoices is a placeholder. Wire up `react-pdf` or a server-side renderer.
- **CSV export** in Reports uses a basic Blob — fine for small lists, replace with streaming for large tables.
- **Avatar upload** writes to `public/uploads/` (gitignored). Move to S3 or similar before production.
- **Tests** are not included. The repository pattern makes them easy to add — recommended starting points are repository unit tests and a Playwright auth smoke.

---

## Coding conventions

- TypeScript strict; avoid `any`. Where TanStack's column types force `any`, an inline ESLint disable comment justifies it.
- No comments unless the *why* is non-obvious.
- Components are prop-driven and have JSDoc with one usage example.
- Forms use React Hook Form + Zod resolver. Validation schemas live next to the component.
- Routes prefix data fetching with `requireUser()` or `requireRole()` — never trust the client.
- Audit-write actions (admin route handlers) call `logActivity(user, action, target)`.

### Commit message format (Conventional Commits)

```
feat: add navigation builder with drag-drop
fix: correct contrast on dark-mode badges
chore: configure husky and lint-staged
docs: add CLAUDE.md
refactor: extract widget plugin API
style: align stat card metric typography
```

Husky's `commit-msg` hook runs commitlint with `@commitlint/config-conventional`.
