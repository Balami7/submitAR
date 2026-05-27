# Submitar — Full-Stack Integration Guide

A Next.js document submission management platform.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Environment Setup](#environment-setup)
5. [Database Setup (Prisma + PostgreSQL)](#database-setup)
6. [File Storage Setup (Supabase)](#file-storage-setup)
7. [Authentication Setup (NextAuth)](#authentication-setup)
8. [Installation](#installation)
9. [Running the App](#running-the-app)
10. [API Reference](#api-reference)
11. [Page-by-Page Changes](#page-by-page-changes)
12. [Deployment](#deployment)
13. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
submitar/
├── app/
│   ├── layout.tsx                    ← Wrap with FormProvider + SessionProvider
│   ├── get-started/
│   │   └── page.tsx                  ← ✏️  EDITED — posts to /api/orders
│   ├── review/
│   │   └── page.tsx                  ← ✏️  EDITED — reads sessionStorage from API response
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx              ← ✏️  EDITED — uses NextAuth signIn()
│   │   └── dashboard/
│   │       └── page.tsx              ← ✏️  EDITED — live data from /api/orders
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts          ← 🆕  NextAuth handler
│       ├── orders/
│       │   ├── route.ts              ← 🆕  GET all orders / POST new order
│       │   └── [id]/
│       │       └── route.ts          ← 🆕  GET single order / PATCH status
│       └── admin/
│           └── seed/
│               └── route.ts          ← 🆕  One-time admin seed (delete after use)
├── context/
│   └── FormContext.tsx               ← 🆕  Global form state across pages
├── lib/
│   ├── prisma.ts                     ← 🆕  Prisma client singleton
│   └── uploadFile.ts                 ← 🆕  Supabase file upload utility
├── prisma/
│   └── schema.prisma                 ← 🆕  Full database schema
├── middleware.ts                     ← 🆕  Protects /admin/* routes
└── .env.local                        ← 🆕  Environment variables
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js v4 (Credentials provider) |
| File Storage | Supabase Storage |
| Validation | Zod (optional, recommended) |
| Styling | Tailwind CSS (existing) |

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **PostgreSQL** running locally or a hosted instance (e.g. [Neon](https://neon.tech), [Supabase DB](https://supabase.com), [Railway](https://railway.app))
- **Supabase account** (free tier works) for file storage — [supabase.com](https://supabase.com)
- A package manager: `npm`, `yarn`, or `pnpm`

---

## Environment Setup

Create a `.env.local` file in the root of your project:

```env
# ── Database ──────────────────────────────────────────────────────────────────
# Local PostgreSQL example:
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/submitar"

# Neon (cloud) example:
# DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/submitar?sslmode=require"

# ── NextAuth ──────────────────────────────────────────────────────────────────
NEXTAUTH_SECRET="generate-a-random-string-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# ── Supabase File Storage ─────────────────────────────────────────────────────
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-key-from-supabase-dashboard"
SUPABASE_BUCKET="submitar-uploads"
```

> **Tip:** Generate a strong `NEXTAUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

---

## Database Setup

### 1. Create the Prisma schema

Create the file `prisma/schema.prisma` with the full schema (see the schema provided in the integration guide).

### 2. Run migrations

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init
```

### 3. Verify in Prisma Studio (optional)

```bash
npx prisma studio
# Opens a GUI at http://localhost:5555
```

---

## File Storage Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project.

### 2. Create a storage bucket

In the Supabase dashboard:
- Go to **Storage** → **New Bucket**
- Name it `submitar-uploads`
- Set it to **Public** (so uploaded files can be viewed)

### 3. Set bucket policy (allow uploads)

In the Supabase dashboard → Storage → Policies → `submitar-uploads` bucket, add a policy:

```sql
-- Allow anyone to upload (anon key)
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'submitar-uploads');

-- Allow public read
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'submitar-uploads');
```

### 4. Get your keys

Dashboard → Settings → API:
- Copy `Project URL` → `SUPABASE_URL`
- Copy `anon public` key → `SUPABASE_ANON_KEY`

---

## Authentication Setup

NextAuth is pre-configured to use a `credentials` provider backed by your `admins` table. No additional OAuth setup is needed.

The session strategy is **JWT** (no database sessions table needed).

Admin passwords are hashed with **bcrypt** (12 rounds).

---

## Installation

```bash
# 1. Install all dependencies
npm install prisma @prisma/client next-auth bcryptjs @supabase/supabase-js uuid zod
npm install -D @types/bcryptjs

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev --name init
```

---

## Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

The app runs at **http://localhost:3000**.

---

## API Reference

### Orders

#### `POST /api/orders`
Submit a new service request.

- **Content-Type:** `multipart/form-data`
- **Body:** All form fields as FormData entries. Files must be appended as `File` objects.
- **File fields:** `uploadFile`, `repFile`, `companyIdCard`, `companyAuthLetter`, `authLetter`, `identityImage`, `identitySelfie`
- **JSON fields (stringify before appending):** `addOns`, `lineItems`
- **Response:**
  ```json
  { "success": true, "csn": "CSN-2405141", "id": "clxxxxx" }
  ```

#### `GET /api/orders`
Fetch all orders (admin only after middleware is applied).

- **Query params:**
  - `status` — filter by status label e.g. `Pending`, `In Progress`
  - `search` — search by CSN, name, or city
- **Response:**
  ```json
  {
    "orders": [...],
    "counts": [{ "status": "PENDING", "_count": { "status": 12 } }],
    "total": 125
  }
  ```

#### `GET /api/orders/[id]`
Fetch a single order by its database ID.

#### `PATCH /api/orders/[id]`
Update an order's status or admin notes.

- **Body:**
  ```json
  { "status": "IN_PROGRESS", "adminNotes": "Called customer" }
  ```

### Auth

#### `POST /api/auth/callback/credentials`
Handled automatically by NextAuth. Do not call directly — use `signIn('credentials', { email, password })` from the client.

---

## Page-by-Page Changes

### `get-started/page.tsx`
**What changed:** The `handleSubmit` function now builds a `FormData` object from all state variables and POSTs it to `/api/orders`. On success, minimal order data is stored in `sessionStorage` and the user is redirected to `/review`.

**What stayed the same:** All UI, validation logic, state variables, component structure — entirely unchanged.

**Key addition:**
```typescript
const fd = new FormData();
// ... append all fields and files ...
const res = await fetch('/api/orders', { method: 'POST', body: fd });
const data = await res.json();
sessionStorage.setItem('orderReview', JSON.stringify({ csn: data.csn, ... }));
window.location.href = '/review';
```

---

### `review/page.tsx`
**What changed:** Reads from `sessionStorage` key `orderReview` (set by the form on successful API submission) instead of `localStorage` key `currentSubmission`. The order reference number is now the real CSN from the database. The "Confirm & Pay" button is wired up for future payment integration.

---

### `admin/login/page.tsx`
**What changed:** `handleSubmit` now calls `signIn('credentials', { email, password, redirect: false })` from NextAuth. On success, redirects to `/admin/dashboard`. On failure, shows an error alert.

**What stayed the same:** All UI, form layout, styling.

**Required addition:** Add `name="email"` and `name="password"` attributes to the input fields so the handler can read them via `form.elements`.

---

### `admin/dashboard/page.tsx`
**What changed:**
- Dummy `dummyOrders` array replaced with live `fetch('/api/orders')` call
- Stats cards show real counts from database `groupBy` query
- Searching and filtering now hits the API with query params
- Status can be updated inline via a `<select>` dropdown (calls `PATCH /api/orders/[id]`)
- Session guard: redirects to `/admin/login` if unauthenticated
- `View Details` button navigates to `/admin/orders/[id]`

**What stayed the same:** All UI layout, table structure, card design, search bar styling.

---

## Seeding the First Admin

After running migrations, create your first admin account:

```bash
# 1. Start the dev server
npm run dev

# 2. In a separate terminal, call the seed endpoint
curl -X POST http://localhost:3000/api/admin/seed
```

This creates:
- **Email:** `admin@submitar.com`
- **Password:** `Admin@1234`

> ⚠️ **Important:** Delete the file `app/api/admin/seed/route.ts` after running this once. It is a security risk if left in production.

To change the credentials, edit the seed file before running, or update them directly in Prisma Studio.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy

> **Note:** Vercel's serverless functions handle Next.js API routes automatically. No separate server needed.

### Railway / Render

If self-hosting:
```bash
npm run build
npm start
```
Set `NODE_ENV=production` and all env vars in your hosting dashboard.

### Database on Production

Use a managed PostgreSQL service:
- [Neon](https://neon.tech) — free tier, serverless-friendly
- [Supabase DB](https://supabase.com) — if you're already using Supabase for storage
- [Railway](https://railway.app) — simple, affordable

Run migrations on production:
```bash
npx prisma migrate deploy
```

---

## Troubleshooting

### `PrismaClientInitializationError`
Your `DATABASE_URL` is wrong or the database isn't running. Check:
```bash
# Test your connection
npx prisma db pull
```

### Files not uploading
- Check your Supabase bucket is set to **Public**
- Verify your bucket policies allow anon inserts
- Confirm `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct

### `NEXTAUTH_SECRET` error
Make sure `.env.local` is in the project root and `NEXTAUTH_SECRET` is at least 32 characters.

### Admin login redirects back to login
- Run the seed endpoint to create the admin record
- Verify the password matches what's in the seed file
- Check `NEXTAUTH_URL` matches the port you're running on

### `Cannot find module '@prisma/client'`
```bash
npx prisma generate
```

---

## Environment Variables Quick Reference

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL (e.g. `http://localhost:3000`) |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_BUCKET` | The bucket name you created (`submitar-uploads`) |