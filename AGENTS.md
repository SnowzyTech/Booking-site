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

- **`app/(public)`** — landing page (`/`): hero, how-it-works, services, about,
  FAQ, contact band. Plus `/contact`, the dedicated contact page that holds the
  message form; the landing band carries the same details and links to it.
- **`app/book`** — booking wizard with a 4-dot stepper. Two branches keyed off each
  service's `flow`:
  - `scheduled`: `/book` → `/book/schedule` (date/time + virtual/in-person) →
    `/book/details` (contact) → `/book/payment` (bank transfer + WhatsApp receipt).
  - `assisted` (Corporate, Events): `/book` → `/book/assisted` (WhatsApp hand-off).
  - `/book` (the picker, step 1) is reached only from the hero's "Explore
    Services" — a specific service's own CTA (landing page Services section,
    or the booking-flow service cards) skips it and deep-links straight into
    step 2 with `?service=<slug>`, read by `<ServiceFromQuery>` since
    `BookingProvider` only mounts under `/book/*`.
- **`app/admin`** — dashboard under `/admin/*`: `/admin/appointments` and
  `/admin/clients` (real screens), `/admin/settings` (placeholder),
  `/admin/login`. The guarded pages live in the `(dashboard)` route group;
  login sits outside it. `/admin/clients` is the One-on-One Premium roster —
  premium is billed monthly and arranged over WhatsApp, so it never appears on
  the appointments board.

## Content vs. data (important boundary)

The **catalogue stays in code**: services (`lib/services.ts`), FAQ (`lib/faq.ts`),
site copy (`lib/site.ts`), availability rules (`lib/availability.ts`). Only
**transactional data** (clients, bookings, appointments) lives in Postgres. A
`Booking` snapshots the service it was made against (`serviceSlug` + `serviceName`)
rather than referencing a Service table.

## Backend

- Schema: `prisma/schema.prisma`. Models: `User` (admin/staff), `Client`,
  `Booking`, `Appointment` + enums (`Role`, `ServiceFlow`, `BookingKind`,
  `BookingStatus`, `PaymentStatus`, `AppointmentState`, `BookingMode`).
- Prisma client singleton: `lib/prisma.ts` (import `prisma` from `@/lib/prisma`).
- Connection: `DATABASE_URL` (pooled) + `DIRECT_URL` (migrations) in `.env`
  (gitignored). For reliable migrations, point `DIRECT_URL` at Neon's **non-pooled**
  host (drop `-pooler`).
- Payments are **manual bank transfer**: client transfers, taps "sent notification"
  (`PaymentStatus.NOTIFIED`), an admin verifies (`VERIFIED`). No payment gateway.
  `/book/payment` offers two choices (`components/booking/payment-actions.tsx`):
  **Manually Pay** opens a modal with the account details, and confirming there
  is what persists the booking; **Pay with Paystack** is a placeholder — no
  gateway is wired up, so it only explains that card payment isn't live yet.
- Virtual vs in-person: chosen on the schedule step (`components/booking/
  mode-picker.tsx`), carried in the booking context, stored as
  `Booking.mode` (`BookingMode`, default `VIRTUAL`) and shown as a chip on the
  admin board. It deliberately does **not** gate Confirm — falling through to
  virtual by inaction is recoverable, whereas defaulting to physical would send
  someone across Lagos for a meeting nobody prepared for.
- E-mail: `lib/email.ts`, posted straight to **Resend**'s REST API (no SDK —
  one `fetch`, so no extra dependency). `createScheduledBooking` calls
  `notifyNewBooking` *after* the transaction commits, which sends two messages:
  the "new booking" alert to `BOOKING_NOTIFICATION_EMAIL` and a receipt to the
  customer. Sending is best-effort and never fails a committed booking. Env:
  `RESEND_API_KEY`, `EMAIL_FROM` (a Resend-verified sender),
  `BOOKING_NOTIFICATION_EMAIL` — leave them blank and sends are skipped with a
  console warning, which is how local dev runs. Confirm / Decline in the admin
  dashboard still send nothing.
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
  service filters; **Auth.js admin login** guarding the admin routes + actions;
  **`/admin/clients`** — the premium roster with its month stepper, "Opt out",
  and the add-client dialog (`getPremiumClients`, `createPremiumClient`,
  `optOutClient`).
- The planned backend scope is complete. Remaining before deploy: change the
  default `ADMIN_PASSWORD`, point `DIRECT_URL` at Neon's non-pooled host, and set
  the same env vars in the deploy environment.

`scripts/seed-admin.mjs` seeds sample bookings and premium clients for local
testing (`node --env-file=.env scripts/seed-admin.mjs`, `--clean` to remove).

## Known content gaps (flagged in code)

- Contact has no Figma frame (the export ends at the footer, and the nav's
  "Contacts" link used to land there). `components/sections/contact.tsx` (band)
  and `contact-page.tsx` (`/contact`) reuse the geometry of the other bands and
  share `contact-channels.tsx`; `contact-form.tsx` composes enquiries into a
  WhatsApp or `mailto:` hand-off — there is no mail transport in the project.
- Availability weekday conflict in the mockups — Tue/Thu implemented, caption kept
  verbatim (`lib/availability.ts`).
- Settings still has no design — `_mockups/2x/update/` covers Clients only, so
  `/admin/settings` remains the placeholder.
- The Clients frames repeat one client name and initial across every row, and
  the add-client frame repeats "Address" in its sixth cell; both are Figma
  duplication, so the row derives its initial from the name and the field list
  stays at five (same call as `admin-modal-fields.png`).
- Most FAQ answers are `null` and render a "copy pending" state (`lib/faq.ts`).
- Fonts/images are stand-ins (Plus Jakarta Sans; `#D9D9D9` placeholder blocks).
