# BH Kitchen

BH Kitchen is a kitchenware shop for customers in Addis Ababa. This repository holds the customer storefront and the API that will run catalogue, stock, orders, payments, and delivery.

The project is in early development. The storefront is a working shell, and the API is a NestJS service with PostgreSQL, Docker, and a health check. Product data, cart, checkout, and payment verification are not implemented yet.

## Stack

| Part | Technology |
| --- | --- |
| Storefront | Next.js 16, React 19, TypeScript, Tailwind CSS |
| API | NestJS 11, TypeScript, Prisma |
| Database | PostgreSQL 16 |
| Local runtime | Docker Compose |
| CI | GitHub Actions |

## Repository

```text
frontend/     Customer storefront
backend/      HTTP API, Prisma schema, Docker image
docs/         Product and engineering plan
.github/      Backend build, migration, and image workflow
```

Storefront routes already in the shell: home, shop, product details, cart, checkout, order tracking, about, contact, and FAQ.

The API is served at `/api/v1`. `GET /api/v1/health` returns `{ "status": "ok" }`.

## Prerequisites

- Node.js 22
- npm
- Docker Desktop, when you want PostgreSQL or the API container

## Storefront

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The storefront calls `http://localhost:3001/api/v1` unless `frontend/.env.local` sets `NEXT_PUBLIC_API_BASE_URL`.

## API

### Containers

From `backend`:

```bash
cd backend
npm run docker:up
```

On PowerShell, create the env file first if you also want to run the API on the host:

```powershell
copy .env.example .env
```

On macOS or Linux:

```bash
cp .env.example .env
```

Compose starts PostgreSQL and the API. The API applies the Prisma migrations before it listens.

- API: [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)
- Database: `localhost:5432`, database `bh_kitchen`, user `postgres`, password `postgres`

That password is for this local Compose file only. Do not reuse it anywhere else.

Stop the stack:

```bash
npm run docker:down
```

### API on the host

Use this when you are changing the NestJS code. Start only the database so port `3001` stays free:

```bash
cd backend
docker compose up postgres
```

In a second terminal:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

`npm run prisma:migrate` creates a new migration while you are changing the schema. `npm run prisma:deploy` applies migrations that are already in the repository.

## Environment

Copy `backend/.env.example` to `backend/.env`.

| Variable | Purpose |
| --- | --- |
| `PORT` | API port. Default `3001`. |
| `WEB_ORIGIN` | Storefront origin allowed to send cookies. Default `http://localhost:3000`. |
| `DATABASE_URL` | PostgreSQL connection string. |

The API reads cookies and does not accept a bearer token from browser storage. `WEB_ORIGIN` cannot be `*` while cookies are enabled.

## Continuous integration

[`.github/workflows/backend-ci.yml`](.github/workflows/backend-ci.yml) runs when `backend/` changes. The workflow installs dependencies, generates the Prisma client, builds the API, applies migrations to a temporary PostgreSQL database, and builds the Docker image. It does not deploy.

There is no `package-lock.json` yet. After `npm install` succeeds, commit the lockfile so later installs stay reproducible.

## Current limits

- The shop pages do not load products.
- Modules for auth, catalogue, inventory, cart, orders, payments, and delivery are registered and empty.
- The database currently has a `users` table only.
- Payment providers, delivery assignment, and the admin dashboard are not part of this scaffold.

The longer product plan is in [`docs/BH_Kitchen_Full_Stack_Development_Plan.md`](docs/BH_Kitchen_Full_Stack_Development_Plan.md).
