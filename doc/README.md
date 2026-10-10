# Irrigation system

A shared React + Vite + TypeScript frontend with separate dashboard, management, and authentication modules. The auth team owns an existing Express API and NoSQL database. `backend/` is reserved for importing that API; its implementation, database engine, and connection details have not been supplied here. See [the backend guide](backend.md).

## Quick start (frontend)

Use Node.js 24 LTS and npm. From the repository root:

```sh
npm --prefix frontend ci
npm run dev
```

Open the URL printed by Vite. The default route opens the dashboard. All module pages are placeholders, with no API connection, authentication, sensor data, or irrigation actions.

## Team ownership

| Team | Primary edit area | Entry routes |
| --- | --- | --- |
| Dashboard | `frontend/src/modules/dashboard/` | `/dashboard` |
| Management | `frontend/src/modules/management/` | `/management` |
| Auth | `frontend/src/modules/auth/`, `backend/`, `doc/backend.md` | `/login`, `/register`; API routes documented by the team |
| Shared integration | `frontend/src/app/`, `frontend/src/shared/`, tooling and dependency files | Coordinate changes across teams |

Each team works inside its module. Shared navigation and UI belong to the common application, not to any one feature. These are code-ownership boundaries, not independent applications or security isolation.

Read [the frontend architecture and collaboration guide](frontend-architecture.md) and [the dependency guide](dependencies.md) before adding a feature or integrating the backend.

## Commands

These commands run the frontend only, from the repository root. They do not start or test the Express API:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend development server |
| `npm run lint` | Check code and module import boundaries |
| `npm run typecheck` | Check TypeScript |
| `npm test` | Run boundary and navigation tests |
| `npm run build` | Typecheck and build into `frontend/dist/` |
| `npm run preview` | Serve the build locally; run build first |
| `npm run check` | Run lint, typecheck, tests, and production build |

The frontend has its own `package.json` and committed lockfile. The root package only forwards commands; it has no runtime or development dependencies. Running `npm install` at the root does not install the frontend. Use `npm --prefix frontend ci` instead.

## Repository layout

- `frontend/`: browser application source, tooling, and dependency manifests.
- `backend/`: landing area for the auth team's existing Express API and its separate manifests.
- `doc/`: project setup, architecture, dependency policies, and team guides.
- `odd/tasks/`: implementation tracking; its authoritative state belongs to the foundation branch.

The frontend entry is `frontend/src/main.tsx`. Legacy HTML, vanilla Vite demos, and the old server dependency have been removed. Dependency folders, build output, browser artifacts, local caches, and temporary worktrees are ignored; do not commit them.

## Team branches

The local handoff branches are `team/dashboard`, `team/management`, and `team/auth`. Each starts from the same cleaned foundation and adds its team README and `doc/team-guide.md`. Branch creation does not publish changes; push and merge remain separate team decisions.

## Next steps

Agree with the backend team on API response shapes, session handling, errors, and any realtime protocol. Then replace each module placeholder within its owner's directory. No API endpoints, database models, or authentication rules are assumed by this scaffold.
