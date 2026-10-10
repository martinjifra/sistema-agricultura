# Frontend architecture and team workflow

Use one browser application with feature-based ownership. Each team implements its module, while `app` composes the shared application and `shared` contains reusable, domain-neutral code. Do not add microfrontends or a second backend for the current scope.

See [setup and team ownership](README.md) and [dependency policy](dependencies.md). All project documentation belongs under `doc/`; the root README is an entry point.

## Repository map

```text
frontend/
  src/
    main.tsx                  # Browser entry
    app/                      # Shell, module registry, root router
      modules.ts              # Registers module public entries
      router.tsx              # Composes module routes
    modules/
      dashboard/
        index.ts              # Public entry: dashboardModule
        pages/
      management/
        index.ts              # Public entry: managementModule
        pages/
      auth/
        index.ts              # Public entry: authModule
        pages/
    shared/
      types/frontend-module.ts
      ui/                     # Domain-neutral reusable components
      styles/                 # Global tokens and reset only
  tooling/                    # Import-boundary rule and regression tests
  package.json
  package-lock.json
  tsconfig.json
  vite.config.ts
```

Add `components/`, `hooks/`, `services/`, `types/`, or tests inside a module only when needed. Do not create empty layers or move feature logic into shared folders just to make it importable.

## Dependency direction

```text
app -> module public index.ts -> module internals
app -> shared
module internals -> same module or shared
shared -> shared or external libraries
```

- A module must not import another feature module or `app`.
- Shared code must not import feature modules or `app`.
- App code imports features through their `index.ts`, never their pages, hooks, or services directly.
- Use `@/` for imports from `src`; use relative imports within a module when convenient.

`npm run lint` enforces these directions for static imports, re-exports, and string-literal dynamic imports. The rule is tested through ESLint. This is a maintainability check, not a sandbox or a restriction on who can edit files.

## Module integration contract

Each module exports a `FrontendModule` from its public `index.ts`:

| Field | Responsibility |
| --- | --- |
| `id` | Unique module identity |
| `navigation` | Label and destination for its shell navigation link |
| `routes` | React Router route definitions owned by that module |

The application registers the three module entries once in `app/modules.ts`. Teams can add nested routes, components, and services inside their own module without editing the global router. Preserve the existing module root paths unless an agreed change updates navigation and tests together.

The root route redirects to `/dashboard`. An unknown route shows a not-found page inside the shared shell. Current routes are public placeholders: there are no login forms, session checks, permissions, data fetching, or actuator commands. The auth team must define real session behavior with the backend before adding route protection.

## UI conventions

- Use TypeScript and function components.
- Keep page composition and domain behavior inside its feature module.
- Use colocated CSS Modules for component styling; global CSS is limited to shared tokens and resets.
- Keep state local until an actual cross-module requirement exists. No global state library is installed.
- Promote UI or types to `shared` only when they are genuinely reusable and domain-neutral.
- Provide accessible labels, keyboard focus, and responsive layouts when implementing real screens.

## Backend integration boundary

The auth team owns the existing Express API, its NoSQL database integration, and authentication UI. API code belongs in `backend/`, with its own manifests and configuration; it has not yet been imported here. See [the backend import and database guide](backend.md). The management and dashboard teams consume the agreed API interfaces; they do not access the database using administrative credentials.

Before connecting real data, agree on:

1. API locations, response types, error shapes, and session transport.
2. Dashboard and management data responsibilities.
3. Whether realtime is needed, and its endpoint, protocol, and authentication.

Until then, keep future mock data and adapters inside their owning module. Do not invent endpoints, token storage rules, database schemas, or WebSocket messages. A browser WebSocket client can connect to the external backend later; Next.js is not required for that connection.

Frontend environment variables are public build-time configuration, not secret storage. Do not place database credentials, private keys, or server secrets in frontend code.

## Collaboration workflow

1. Create a branch for one module change, for example `feat/dashboard-sensors` or `feat/auth-login`.
2. Keep edits in the owning module. Coordinate changes to `app/`, `shared/`, configuration, dependencies, and this contract with the other teams.
3. Add tests alongside the changed behavior. Run `npm run check` from the repository root before requesting review.
4. Keep commits and reviews scoped to a working change, including its tests and documentation.

Do not install dependencies just for a team's preference: agree on shared dependencies first. Change `frontend/package.json` and its lockfile together; never hand-edit the lockfile or add OS-specific native bindings directly. No GitHub team handles were supplied, so there is no guessed `CODEOWNERS` configuration.

## Runtime and deployment

Use Node.js 24 LTS for the development tools. TypeScript is kept on 5.9 for compatibility with the configured ESLint parser. The frontend is a client-only SPA, not a server-rendered application.

`npm run build` creates `frontend/dist/`. Production hosting must serve that directory and fall back to its `index.html` for frontend routes such as `/dashboard` or `/login`; otherwise a direct visit or refresh may return a server 404. Keep backend API routes outside the SPA fallback.

## Current limits

Module separation isolates code ownership, not builds or deployments. Backend integration and detailed module requirements remain with their owners. The legacy scaffold and versioned root dependencies have been removed; dependency directories must remain ignored. Team-specific handoff instructions live in `doc/team-guide.md` on each team branch.
