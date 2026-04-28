# Renovate

A modern, deeply-customizable SaaS dashboard template — built as a foundation for products that need a polished admin surface from day one.

> 24 pages · atomic design system · live theme customizer · admin-driven page & navigation builder · plugin-style widget API · file-based storage swappable for Postgres/Mongo.

## Screenshots

> _(Drop screenshots into `docs/screenshots/` and reference them here.)_

```
docs/screenshots/overview.png        ← KPIs, revenue chart, activity feed
docs/screenshots/customers.png       ← Searchable CRM with detail drawer
docs/screenshots/theme.png           ← Live theme customizer
docs/screenshots/page-builder.png    ← Widget composition
docs/screenshots/design-system.png   ← /design-system reference
```

## Highlights

- **Next.js 14 + TypeScript strict** — App Router throughout.
- **Atomic design** — atoms / molecules / organisms / templates with a `/design-system` route that documents every primitive.
- **Theme customizer** — change palette, radius, typography, sidebar style; saved to JSON, applied via CSS variables. No redeploy.
- **Page builder** — admin creates pages composed of widgets (KPIs, charts, tables, rich text, plugins). Rendered by a catch-all dynamic route.
- **Navigation builder** — drag-drop reorder/group sidebar items.
- **RBAC** — admin / editor / viewer roles enforced server-side via `requireRole()`.
- **Repository pattern** — every entity goes through `Repository<T>`. Swap lowdb for Postgres or Mongo without touching pages.
- **Plugin widget API** — third-party widgets register via `registerWidget(...)` from any imported module.

## Quick start

```bash
git clone https://github.com/RizwanSuvo99/dashboard-renovate.git
cd dashboard-renovate
npm install
npm run seed          # populates data/db.json with demo data + accounts
cp .env.example .env.local
# set NEXTAUTH_SECRET
npm run dev
```

Open <http://localhost:3000> and sign in with `admin@example.com / admin123` (also `editor@example.com / editor123` and `viewer@example.com / viewer123`).

For the operator manual — folder structure, design tokens, widget plugin API, RBAC, deployment notes — see [CLAUDE.md](./CLAUDE.md).

## What's inside

| Area              | Routes                                                                    |
| ----------------- | ------------------------------------------------------------------------- |
| Public            | `/login` · `/register` · `/forgot-password`                                |
| Dashboard         | `/` (overview) · `/analytics` · `/customers` · `/customers/[id]` · `/products` · `/orders` · `/invoices` · `/calendar` · `/kanban` · `/messages` · `/reports` · `/profile` · `/notifications` |
| Admin             | `/admin/theme` · `/admin/pages` · `/admin/pages/[id]` · `/admin/navigation` · `/admin/users` · `/admin/settings` · `/admin/activity` |
| Reference         | `/design-system`                                                          |
| Errors            | `/403` · `404` · `500`                                                    |

## Stack

Next.js · TypeScript · Tailwind CSS · NextAuth · lowdb · TanStack Query / Table · Zustand · React Hook Form + Zod · Recharts · @dnd-kit · Lucide React · Radix UI primitives · Framer Motion.

## License

MIT — use it, fork it, ship things.
