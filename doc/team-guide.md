# Dashboard team handoff

Work on the visual dashboard inside `frontend/src/modules/dashboard/`. This guide belongs to `team/dashboard`, based on shared foundation commit `59b2ff7aea516d450b0fd4c60a6f1fc30abb617a`. It documents ownership and the existing scaffold, not a dashboard feature specification.

**Current state:** `/dashboard` renders a public placeholder. No feature functionality is implemented and no backend is connected.

## Quick path

1. Follow [common setup](README.md#quick-start) using Node.js 24 LTS and npm.
2. Run `npm run dev` from the repository root and open `/dashboard` at the URL Vite prints. `/` redirects there.
3. Inspect [the module entry](../frontend/src/modules/dashboard/index.ts) and [DashboardPage](../frontend/src/modules/dashboard/pages/DashboardPage.tsx).
4. Agree on the product and backend contracts below before replacing the placeholder. Follow [architecture boundaries](frontend-architecture.md) and [dependency policy](dependencies.md).

## Ownership and coordination

| Owner | Responsibility |
| --- | --- |
| Dashboard team | Visual dashboard; pages, components, styles, tests, and any agreed data adapters within `frontend/src/modules/dashboard/` |
| Management team | Management module at `frontend/src/modules/management/` |
| Auth team | Authentication module at `frontend/src/modules/auth/`, visual login, backend, and NoSQL database |
| Coordinated integration | Shared shell, routing, reusable UI, tooling, configuration, and dependencies |

The dashboard team does not implement management, login, backend services, or database models. Module boundaries isolate ownership, not applications, deployments, or security.

Coordinate before changing `frontend/src/app/`, `frontend/src/shared/`, `frontend/src/main.tsx`, tooling, configuration, dependency manifests/lockfiles, or common documentation. Do not import another module's internals, any other feature module, or `app` into dashboard code. Use same-module code or domain-neutral `shared` code instead. App imports dashboard through its public entry only.

## Public route contract

[The public `index.ts`](../frontend/src/modules/dashboard/index.ts) exports `dashboardModule`, typed as [FrontendModule](../frontend/src/shared/types/frontend-module.ts):

| Field | Existing contract |
| --- | --- |
| `id` | `dashboard` |
| `navigation` | Label `Dashboard`, path `/dashboard` |
| `routes` | One route with relative path `dashboard` and `Component: DashboardPage` |

[The module registry](../frontend/src/app/modules.ts) registers this export once. [The root router](../frontend/src/app/router.tsx) composes its routes under the shared shell, redirects `/` to `/dashboard`, and handles unknown paths. Keep this public entry and root path stable; coordinate navigation or route changes with the other teams and update affected tests together.

`DashboardPage` currently delegates to the shared `ModulePlaceholder`, showing the Dashboard heading, team ownership, module path, and the statement that no backend is connected. There are no dashboard data requests, session checks, or permissions. Public placeholder routing does not decide eventual access rules.

## Development and verification

Run these commands from the repository root. Installation and version guidance live in [common setup](README.md) and [dependencies](dependencies.md).

| Command | Use |
| --- | --- |
| `npm run dev` | Start Vite for local UI work |
| `npm run lint` | Check code and enforced module import boundaries |
| `npm run typecheck` | Check TypeScript |
| `npm test` | Run import-boundary and navigation tests |
| `npm run build` | Typecheck and produce `frontend/dist/` |
| `npm run preview` | Preview the production build after building |
| `npm run check` | Run lint, typecheck, tests, and build before review |

Use function components and TypeScript. Keep styling in colocated CSS Modules; shared global styles are for tokens and resets. Add only the module folders actually needed, and keep state local unless a cross-module requirement is agreed. Do not add dependencies before confirming a requirement and coordinating their shared impact.

For future functionality, add behavior-level tests alongside dashboard code using the configured Vitest and Testing Library tools. Cover agreed interactions, accessible labels and keyboard use, and relevant loading, empty, or error states once their behavior is defined. Check responsive layout in the browser; passing routing tests alone does not prove a finished visual dashboard.

[Existing shell tests](../frontend/src/app/router.test.tsx) cover the default redirect, navigation, direct route loading, and unknown-route recovery. They currently expect placeholder text on direct entry. Coordinate updates to these shared tests when real screens replace placeholders; do not leave stale assertions or remove route coverage to make a change pass.

This handoff changes documentation only. Its checks are local-link resolution, whitespace validation, and documentation-only edit scope; it introduces no behavioral test or runtime feature.

## Decisions required before implementation

No detailed dashboard product or backend contract has been supplied. Resolve these with the relevant owners, rather than treating the scaffold as requirements:

- **Product:** what the dashboard must display, its layout/content priorities, and any allowed user interactions or acceptance criteria.
- **Data:** which dashboard information is available and who owns it; agreed API locations, response types, error shapes, and loading/empty/error behavior.
- **Auth:** whether dashboard access requires a session or permissions, and how the frontend receives and uses the agreed session contract.
- **Updates:** whether data needs realtime updates at all; if so, the backend protocol and authentication contract.

Do not invent sensors, charts, irrigation controls, backend fields, endpoints, database schemas, or token-storage rules. Consume only agreed backend interfaces; never expose database credentials or server secrets in the browser. These decisions are not implemented by this documentation unit.

## Review and delivery checklist

- [ ] The change has one agreed dashboard outcome, with its tests and documentation.
- [ ] Module work stays inside the owned directory; shared changes are explicitly coordinated.
- [ ] The `dashboardModule` public entry and `/dashboard` integration remain compatible, or an agreed change updates navigation and tests together.
- [ ] `npm run check` passes for application changes, with visual/accessibility checks appropriate to the agreed screen.
- [ ] No unrelated modules, speculative backend contracts, credentials, or generated artifacts are introduced.

This is a local team branch. The parent coordinates local documentation commits; this handoff does not authorize push, merge, or history rewriting. The task-status snapshot under `odd/tasks/` is inherited from the shared base; authoritative task progress belongs to the foundation branch, not this branch's snapshot.
