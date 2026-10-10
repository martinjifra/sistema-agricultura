# Auth team handoff

Work on `team/auth` inside `frontend/src/modules/auth/` for UI and `backend/` for the team's existing Express API. The auth group owns the login UI and NoSQL database integration. The backend landing area contains no server implementation yet; frontend authentication remains a placeholder.

## Quick path

1. Follow [common setup and commands](README.md) using Node.js 24 LTS and npm.
2. Read [architecture boundaries](frontend-architecture.md) and [dependency policy](dependencies.md).
3. Run `npm run dev` from the repository root and visit `/login` and `/register`.
4. Follow [the backend import and database guide](backend.md) to bring the existing Express API into `backend/`, then agree on the remaining contracts before frontend integration.

## Current frontend contract

| Surface | Current behavior |
| --- | --- |
| `frontend/src/modules/auth/index.ts` | Exports `authModule: FrontendModule` with `id: 'auth'` |
| `navigation` | Shell label `Authentication`, destination `/login` |
| `routes` | Relative paths `login` and `register`, rendered by `LoginPage` and `RegisterPage` |
| `pages/LoginPage.tsx` | Shared placeholder and a link to `/register` |
| `pages/RegisterPage.tsx` | Shared placeholder and a link back to `/login` |

The application consumes the public `index.ts` entry, not internal pages. Keep `/login` and `/register` stable; coordinate any route or navigation contract change with shared integration and update tests together. Additional internal routes can be owned by the module without changing the global router.

**These public placeholders are not authentication.** They contain no real forms, guards, tokens, session checks, or permission enforcement. The shared application currently opens `/dashboard` by default; visiting auth pages does not establish a session or protect other modules.

## Ownership and cross-team boundaries

- Keep auth-specific UI, services, types, and behavior tests in `frontend/src/modules/auth/`; add internal folders only when needed.
- Keep the existing Express API and its separate manifests in `backend/`. The auth team owns its database connection and setup instructions in `doc/backend.md`; do not copy server dependencies into the frontend.
- Import only this module's internals or domain-neutral `shared` code. Do not import `app` or dashboard/management internals.
- Coordinate changes to `frontend/src/app/`, `frontend/src/shared/`, tooling, configuration, and dependencies with all teams. The app imports modules through their public entries.
- Dashboard and management consume agreed backend interfaces. They do not access the database with administrative credentials or build separate backends.
- Code ownership boundaries are not security isolation. Frontend environment variables are public build-time configuration: never put server secrets, database credentials, or private keys in frontend code or configuration.

## Pending decisions

Ownership, Express, and the backend location are agreed. The team's API/database already exist outside this scaffold, but their files and integration details have not been supplied here:

| Decision | Status |
| --- | --- |
| Backend framework and code location | Express in `backend/`; existing API source awaiting import |
| NoSQL engine, hosting, and data models | Team's existing setup not yet documented here |
| API locations, request/response shapes, and errors | Existing contracts must be supplied by the team |
| Session transport, lifecycle, and token handling | Existing behavior must be documented for frontend integration |
| Permissions and route-protection responsibilities | Confirm with the consuming teams |
| Dashboard/management data interfaces and realtime needs | Confirm from the real API; no protocol assumed |

Do not infer these choices from React, Vite, or the existence of login/register routes. This handoff adds no forms, guards, tokens, data models, server implementation, or session flows.

## Commands and review expectations

Run commands from the repository root; installation instructions remain in the [common setup guide](README.md).

| Command | Expectation |
| --- | --- |
| `npm run dev` | Inspect the placeholders and links locally |
| `npm run lint` | Validate code style and module import boundaries |
| `npm run typecheck` | Validate TypeScript contracts |
| `npm test` | Run existing boundary and navigation tests |
| `npm run check` | Run lint, typecheck, tests, and production build before review of implementation work |

Add tests alongside future behavior, including relevant failure cases once the agreed contracts exist. Preserve current navigation and import-boundary coverage. For this documentation-only unit, Markdown links, whitespace, and documentation-only scope are the relevant checks; no runtime behavior was changed or verified by these checks.

## Handoff checklist

- [ ] Confirm UI requirements and all pending backend contracts with the affected teams.
- [ ] Keep feature work within auth ownership and coordinate shared changes.
- [ ] Include behavior tests and updated docs with each implementation unit.
- [ ] Run the relevant checks and record results before review.

The parent reviews and commits this documentation unit locally. Publishing, merging, and backend implementation are separate decisions.
