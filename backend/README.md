# Backend — Direct College API

Node.js + TypeScript + Express + PostgreSQL (Prisma) + Redis + JWT + Zod.

## Local development

```bash
cd backend
cp .env.example .env
# Set DATABASE_URL, REDIS_URL, JWT secrets, optional GOOGLE_CLIENT_ID

npm install
npm run db:push
npm run dev
```

Health: `GET http://localhost:4000/health`  
Versioned API: `GET http://localhost:4000/api/v1/health`

## Vercel (frontend) + CORS

Set `CORS_ORIGIN` to your Vercel app URL(s), comma-separated for previews:

`CORS_ORIGIN=https://your-app.vercel.app,https://*.vercel.app`

(Wildcards in CORS are limited in browsers; prefer listing known preview hostnames or use a regex in `src/config/env.ts` if you need dynamic previews.)

## Railway

1. Create a Railway project with **PostgreSQL** and **Redis** plugins (or use external URLs).  
2. Set root directory to `backend` (or deploy this folder as its own service).  
3. Build command: `npm install && npm run build`  
4. Start command: `npm start`  
5. Set environment variables from `.env.example`.

Run migrations in CI or a one-off Railway shell:

`npx prisma migrate deploy`

## Architecture

- `src/config` — validated environment (`Zod`), Redis, Prisma singleton  
- `src/routes` — API versioning (`/api/v1`)  
- `src/modules` — feature modules (auth, colleges, …)  
- `src/controllers` / `src/services` / `src/repositories` — layered helpers where modules stay thin  
- `src/middlewares` — auth, roles, errors  
- `src/queues` / `src/jobs` — background processing hooks (extend with BullMQ / Inngest)  
- `src/ml-services`, `src/scrapers`, `src/government-data`, `src/analytics` — integration stubs

## Google sign-in (Next.js)

Send the Google **ID token** (from GIS / One Tap / OAuth popup) to:

`POST /api/v1/auth/google` with JSON `{ "idToken": "..." }`.

The backend verifies it with `google-auth-library` and issues JWT + refresh cookie.

## JEE college predictor

`POST /api/v1/predictor` — body: `rank`, `category`, `gender`, `state`, `branchPreferences[]`, optional `year`.

Returns `SAFE`, `MODERATE`, and `DREAM` college lists (cutoff-driven) plus `meta`. Responses are cached in Redis when configured. Optional Python enrichment: set `ML_SERVICE_URL`; the API calls `POST {ML_SERVICE_URL}/internal/jee-enrich` with bucket summaries.

## ML placeholder APIs (Python-ready)

Mounted at `/api/v1/ml/*`:

- `POST /ml/predict` — proxies to `{ML_SERVICE_URL}/predict` or returns a stub
- `POST /ml/recommend` — `/recommend` or local placeholder
- `POST /ml/analyze` — `/analyze` or in-process analytics hook
- `POST /ml/strategy` — `/strategy` or `strategy-engine` hints

Gateway + retries: `src/ml-services/mlGateway.ts` (`ML_SERVICE_TIMEOUT_MS`, `ML_SERVICE_MAX_RETRIES`).

## Engine folders (architecture)

- `src/predictor-engine` — rank vs closing bucketing  
- `src/recommendation-engine` — future collaborative filtering  
- `src/strategy-engine` — counseling hints (placeholder)  
- `src/analytics-engine` — lightweight server-side ML/analytics events
