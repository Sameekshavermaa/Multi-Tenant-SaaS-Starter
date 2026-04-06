# Multi-Tenant SaaS Starter (Next.js + Supabase + Stripe)

Production-ready starter kit for building B2B SaaS with robust tenant isolation, team management, and Stripe billing.

## Stack
- **Next.js 15** (App Router, server components, route handlers)
- **Supabase** (Auth + PostgreSQL + RLS)
- **Stripe** (subscription checkout + webhooks)
- **TypeScript + Tailwind CSS**

## Features
- Auth via Supabase (email/password)
- Multi-tenancy with organizations and memberships
- Role-based access control (`admin`, `member`)
- Organization CRUD
- Team invitations (send, accept, decline)
- Dashboard with activity and usage stats
- Billing (Free vs Pro)
- Plan-based usage gating
- Audit logs and usage analytics
- Middleware-protected API routes
- Responsive, modern dashboard UI with sidebar
- Dark-mode-ready design tokens

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in Supabase + Stripe values.
4. Run SQL schema in `db/schema.sql` in your Supabase SQL editor.
5. Start app:
   ```bash
   npm run dev
   ```

## Architecture

```text
app/
  (auth)/
  dashboard/
  api/
components/
  layout/
  ui/
lib/
  auth/
  billing/
  db/
  supabase/
  tenancy/
db/schema.sql
```

## Security & Tenant Isolation
- Middleware ensures protected routes require auth.
- Organization access is verified in server helpers and API routes.
- Supabase RLS policies restrict rows to workspace members.
- Admin-only operations enforced both in API checks and SQL policies.

## Stripe Flow
1. User starts checkout from Billing page.
2. API creates Stripe checkout session for Pro plan.
3. Stripe webhook updates `subscriptions` table.
4. API logic enforces free-plan limits where required.

## Deploy to Vercel
- Add all environment variables from `.env.example`.
- Configure Stripe webhook endpoint: `/api/stripe/webhook`.
- Ensure Supabase URL/keys are set for production project.
- Optional: use Supabase service role on server-only operations when needed.

## Notes
- OAuth can be added by extending auth UI and Supabase provider config.
- Invitations endpoint currently stores invite records; integrate an email provider to send links.
