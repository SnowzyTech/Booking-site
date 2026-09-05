<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!--
  Everything below this marker is project documentation and is safe from
  `next dev`: the generator only rewrites the text *between* the
  BEGIN/END:nextjs-agent-rules markers above. Keep app context here.
-->

# Booking site — project guide

Marketing + booking site for **Linda Chikaodi Austin**, a clinical nutritionist
(Nucle Limited / Nutriticare). Built from Figma PNG mockups referenced in code as
`_mockups/2x/...`.

## Stack

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS v4** + Radix UI primitives
- **Prisma 6 (classic ORM)** against **Neon Postgres** — chosen over the installed
  Prisma 8 RC platform CLI for stability and Node 22.1 compatibility.

## App areas (routes)

- **`app/(public)`** — landing page (`/`): hero, how-it-works, services, about, FAQ.
- **`app/book`** — booking wizard with a 4-dot stepper. Two branches keyed off each
  service's `flow`:
  - `scheduled`: `/book` → `/book/schedule` (date/time) → `/book/details` (contact) →
    `/book/payment` (bank transfer + WhatsApp receipt).
  - `assisted` (Corporate, Events): `/book` → `/book/assisted` (WhatsApp hand-off).
- **`app/admin`** — dashboard under `/admin/*`: `/admin/appointments` (real
  screen), `/admin/clients` + `/admin/settings` (placeholders), `/admin/login`.
  The guarded pages live in the `(dashboard)` route group; login sits outside it.

## Content vs. data (important boundary)

The **catalogue stays in code**: services (`lib/services.ts`), FAQ (`lib/faq.ts`),
site copy (`lib/site.ts`), availability rules (`lib/availability.ts`). Only
**transactional data** (clients, bookings, appointments) lives in Postgres. A
`Booking` snapshots the service it was made against (`serviceSlug` + `serviceName`)
rather than referencing a Service table.

## Backend

- Schema: `prisma/schema.prisma`. Models: `User` (admin/staff), `Client`,
  `Booking`, `Appointment` + enums (`Role`, `ServiceFlow`, `BookingKind`,
  `BookingStatus`, `PaymentStatus`, `AppointmentState`).
- Prisma client singleton: `lib/prisma.ts` (import `prisma` from `@/lib/prisma`).
- Connection: `DATABASE_URL` (pooled) + `DIRECT_URL` (migrations) in `.env`
  (gitignored). For reliable migrations, point `DIRECT_URL` at Neon's **non-pooled**
  host (drop `-pooler`).
- Payments are **manual bank transfer**: client transfers, taps "sent notification"
  (`PaymentStatus.NOTIFIED`), an admin verifies (`VERIFIED`). No payment gateway.
- Admin auth: **Auth.js (NextAuth v5)**, single shared admin, credentials from env.
  Config in `auth.ts`; optimistic gate in `proxy.ts`; secure gate via
  `requireAdmin()` (`lib/dal.ts`) in the admin layout/pages and `assertAdmin()`
  in `lib/admin-actions.ts`. Login at `/admin/login`. Env: `AUTH_SECRET`, `ADMIN_EMAIL`,
  `ADMIN_PASSWORD` (all in `.env`, gitignored). Next 16 uses `proxy.ts`, not
  `middleware.ts`.

### Commands

- `npm run dev` — dev server
- `npm run db:migrate` — create/apply a migration (`prisma migrate dev`)
- `npm run db:generate` — regenerate the client
- `npm run db:studio` — open Prisma Studio

## Status

Backend build in progress:
- **Done:** data model + migrations; public scheduled-booking flow writes to the
  DB on "Sent Notification of Payment" (`lib/booking-actions.ts`); real slot
  availability; admin `/admin/appointments` reads live data via `lib/admin-data.ts`
  with the derived New badge (red pending / yellow confirmed-not-started / none);
  admin actions — Confirm / Decline / Re-Schedule / Complete & Continue and the
  "new booking" create dialog (`lib/admin-actions.ts`); working month / day /
  service filters; **Auth.js admin login** guarding the admin routes + actions.
- The planned backend scope is complete. Remaining before deploy: change the
  default `ADMIN_PASSWORD`, point `DIRECT_URL` at Neon's non-pooled host, and set
  the same env vars in the deploy environment.

`scripts/seed-admin.mjs` seeds sample bookings for local testing
(`node scripts/seed-admin.mjs`, `--clean` to remove).

## Known content gaps (flagged in code)

- Availability weekday conflict in the mockups — Tue/Thu implemented, caption kept
  verbatim (`lib/availability.ts`).
- Most FAQ answers are `null` and render a "copy pending" state (`lib/faq.ts`).
- Fonts/images are stand-ins (Plus Jakarta Sans; `#D9D9D9` placeholder blocks).
