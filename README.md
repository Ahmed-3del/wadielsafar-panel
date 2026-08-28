# Wadi Al Safar — Admin Panel

Internal admin dashboard for Wadi Al Safar (Saudi travel & tourism). Phase 1: a clean,
scalable architecture with a handful of fully-working vertical slices, not full CRUD
for every module.

## Prerequisites

- Node.js 20+ and npm (no pnpm/yarn required — this repo uses npm only)
- The sibling Django REST backend running at `http://localhost:8000/api/v1/`
  (see the cross-app contract in the repo root `docs/`). The panel builds and runs
  without it, but auth and data calls will fail until it's up.

## Environment setup

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

| Variable          | Purpose                                   | Default                          |
| ----------------- | ------------------------------------------ | --------------------------------- |
| `VITE_API_URL`    | Base URL of the backend API                | `http://localhost:8000/api/v1`    |
| `VITE_APP_NAME`   | Display name shown in the panel's topbar   | `Wadi Al Safar Admin`             |

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command           | Description                                    |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Start the Vite dev server                       |
| `npm run build`    | Type-check (`tsc -b`) and build for production   |
| `npm run preview`  | Preview the production build locally             |
| `npm run lint`     | Run ESLint over the project                      |
| `npm run format`   | Format the project with Prettier                 |
| `npm run test`     | Run the Vitest test suite once                   |

## Architecture

- `src/app` — router, providers (`QueryClientProvider` + `AuthProvider` + router), and
  app-level config (the React Query client).
- `src/components` — small, genuinely reusable primitives (`ui/`), the generic
  `DataTable`, the `FormField` wrapper, `ConfirmDialog`, and feedback components
  (`Spinner`, `ErrorState`, `EmptyState`, `Toaster`).
- `src/features/<name>` — one folder per business module, each following
  `{components,pages,hooks,services,types,schemas,index.ts}`. `inquiries`,
  `destinations`, `packages`, and `visas` are fully built (list, filtering where it
  makes sense, create/edit forms, delete). The remaining modules
  (`services`, `flights`, `hotels`, `cruises`, `offers`, `bookings`, `testimonials`,
  `pages`, `media`, `users`) are scaffolded: a placeholder page wired into the router
  and sidebar, backed by a real (if minimal) API call to the corresponding backend
  endpoint, so wiring up full CRUD later is additive.
- `src/services/api` — one axios-backed module per domain, built on the shared
  `createCrudApi` factory in `client.ts`. `client.ts` also owns the in-memory access
  token, the silent-refresh-and-retry interceptor, and error normalization.
- `src/layouts`, `src/constants/navigation.ts` — the dashboard shell and the
  role-filtered sidebar; adding a module later is one nav entry plus one route.

## Auth

- The access token lives only in memory (module state in `services/api/client.ts` +
  React state in `AuthProvider`) — never in `localStorage`/`sessionStorage`.
- The refresh token is an httpOnly cookie set by the backend; the app cannot read it
  and doesn't try to. On load, it silently calls `/auth/refresh/` to establish a
  session before rendering any protected route.
- On a 401, the axios interceptor attempts exactly one silent refresh + retry; if that
  also fails, auth state is cleared and the user is redirected to `/login`.
- `RequireAuth` and `RequireRole` gate routes/UI by role for UX only — the backend is
  the real authorization boundary and re-checks every request server-side.

## Verification performed

- `npm run lint` — no errors.
- `npm run build` — `tsc -b && vite build` succeeds with zero type errors.
- `npm run test` — DataTable and login-schema tests pass.
- `npm run dev` — server responds on `http://localhost:5173`.
# wadielsafar-panel
