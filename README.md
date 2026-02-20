# Flora Species Admin CMS

MVP admin CMS for Flora Species: Node/Express + Prisma/PostgreSQL backend and Vite/React admin frontend.

## Quick start

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGIN (e.g. http://localhost:5173)
pnpm install
pnpm exec prisma migrate dev --name init
pnpm db:seed
pnpm dev
```

**Local database:** The app uses PostgreSQL on localhost. In `.env`, set `DATABASE_URL` to your local Postgres user and the `flora_admin` database, for example:

- `postgresql://postgres:postgres@localhost:5432/flora_admin?schema=public`
- or `postgresql://YOUR_USERNAME@localhost:5432/flora_admin?schema=public` (if you use peer auth)

Create the database once: `createdb flora_admin` (or in psql: `CREATE DATABASE flora_admin;`).

Backend runs at `http://localhost:4000` by default.

### Admin (frontend)

```bash
cd admin
cp .env.example .env
# Set VITE_API_URL=http://localhost:4000
pnpm install
pnpm dev
```

Admin runs at `http://localhost:5173`. Open it and log in.

**First login:** Use the seeded Super Admin user:

- Email: `admin@flora.local`
- Password: `Admin123!`

## Auth (JWT)

The backend uses **httpOnly cookies** for the JWT: on login/register the token is set in a cookie and sent automatically with requests. The response body also includes `token` for optional use (e.g. if you switch to localStorage later). See `backend/.env.example` and CORS is configured for `CORS_ORIGIN` (admin URL).

## Scripts

**Backend**

- `pnpm dev` – start dev server (tsx watch)
- `pnpm build` – compile TypeScript
- `pnpm db:generate` – generate Prisma client
- `pnpm db:migrate` – run migrations
- `pnpm db:seed` – seed roles + default Super Admin user
- `pnpm db:push` – push schema (dev only)

**Admin**

- `pnpm dev` – Vite dev server
- `pnpm build` – production build
- `pnpm preview` – preview production build

## Project layout

- `backend/` – Express API, Prisma, auth, species, users, roles, settings
- `admin/` – Vite + React, Tailwind, ShadCN-style UI, Zustand, React Query
