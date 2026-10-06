# Auth team handoff

Work on `team/auth` inside `frontend/src/modules/auth/`. The auth group owns the login UI, backend, and NoSQL database. This branch adds documentation only; it does not implement authentication.

## Quick path

1. Follow [common setup and commands](README.md) using Node.js 24 LTS and npm.
2. Read [architecture boundaries](frontend-architecture.md) and [dependency policy](dependencies.md).
3. Run `npm run dev` from the repository root and visit `/login` and `/register`.
4. Agree on the pending backend contracts below before implementing integration.

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

- Keep auth-specific UI, future services, types, and behavior tests in `frontend/src/modules/auth/`; add internal folders only when needed.
- Import only this module's internals or domain-neutral `shared` code. Do not import `app` or dashboard/management internals.
- Coordinate changes to `frontend/src/app/`, `frontend/src/shared/`, tooling, configuration, and dependencies with all teams. The app imports modules through their public entries.
- Dashboard and management consume agreed backend interfaces. They do not access the database with administrative credentials or build separate backends.
- Code ownership boundaries are not security isolation. Frontend environment variables are public build-time configuration: never put server secrets, database credentials, or private keys in frontend code or configuration.

## Pending decisions

Ownership is agreed; implementation contracts are not. Resolve these with the consuming teams before adding real behavior:

| Decision | Status |
| --- | --- |
| Backend framework and backend code location | Pending; no framework or repository directory selected |
| NoSQL database engine and data models | Pending; no engine or schema selected |
| API locations, request/response shapes, and errors | Pending; no endpoints selected |
| Session transport, lifecycle, and token handling | Pending; no storage or session flow selected |
| Permissions and route-protection responsibilities | Pending; no authorization rules selected |
| Dashboard/management data interfaces and realtime needs | Pending; no protocol selected |

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
