# Management team handoff

Work on `team/management` inside `frontend/src/modules/management/`. This branch starts from shared foundation `59b2ff7aea516d450b0fd4c60a6f1fc30abb617a` and adds documentation only. No application functionality is implemented by this handoff.

## Quick path

1. Follow [common setup](README.md#quick-start) using Node.js 24 LTS and npm.
2. Run `npm run dev` from the repository root and visit `/management`.
3. Read the [architecture contract](frontend-architecture.md) and [dependency policy](dependencies.md).
4. Discuss management requirements with its owner before replacing the placeholder.

## Current surface and public contract

| Surface | Current responsibility |
| --- | --- |
| `frontend/src/modules/management/index.ts` | Exports `managementModule`, typed as `FrontendModule` |
| `frontend/src/modules/management/pages/ManagementPage.tsx` | Renders the shared `ModulePlaceholder`, not a management feature |
| `/management` | Public placeholder route; no data fetching or access control |

The public entry has `id: 'management'`, navigation label `Management`, navigation path `/management`, and a route definition with `path: 'management'` and `Component: ManagementPage`. The relative route path is composed by the shared application into `/management`.

`frontend/src/app/modules.ts` already registers `managementModule` through its public entry. Preserve the `id`, navigation destination, root route, and `FrontendModule` shape (`id`, `navigation`, `routes`). Add future module-owned routes through `index.ts`; do not bypass the entry by importing internal pages into app code. Coordinate any contract change and update affected navigation tests together.

## Ownership and coordination

- Management owns `frontend/src/modules/management/`. Add internal components, hooks, services, types, styles, or tests only when a confirmed requirement needs them.
- The dashboard team owns `team/dashboard` and `frontend/src/modules/dashboard/`; it is not part of this management handoff.
- Auth owners handle login UI, authentication, the backend, and the NoSQL database on `team/auth`. Backend framework, database engine, and integration contracts are not chosen here.
- Coordinate edits to `frontend/src/app/`, `frontend/src/shared/`, tooling, configuration, manifests, lockfiles, and common documentation across teams. Shared navigation and domain-neutral UI are common application concerns.

Module internals may import their own module and `shared`, not `app` or another feature module. App imports modules through public `index.ts` entries. Shared code must not depend on modules or app. Use local state and colocated CSS Modules; do not add global state, dependencies, or empty architectural layers without a real need.

## Developer checks

Run commands from the repository root; the root scripts forward to `frontend`:

| Command | Expectation |
| --- | --- |
| `npm run dev` | Start Vite for manual route checks |
| `npm run lint` | Check code and enforced module import boundaries |
| `npm run typecheck` | Verify TypeScript contracts |
| `npm test` | Run import-boundary and navigation tests |
| `npm run build` | Typecheck and produce the frontend build |
| `npm run check` | Run all checks above except the dev server before review |

For future behavior changes, add tests alongside that behavior and preserve existing routing and boundary coverage. A placeholder opening successfully is not proof of implemented management behavior. Follow the common guide for installation and preview commands rather than maintaining a second setup procedure here.

## Pending requirements, not a feature plan

Management requirements remain **pending discussion with its owner**. No CRUD resources, farm or zone schemas, backend endpoints, permissions, forms, or screens are defined by this handoff. Do not turn examples or guesses into requirements.

After that discussion, agree with the auth owners on the necessary API response shapes, errors, and session behavior before connecting data. Keep backend credentials and database access out of browser code. No API integration, database model, session handling, route protection, or management workflow exists in the current placeholder.

## Handoff checklist

- [ ] Confirm management scope and acceptance criteria with its owner.
- [ ] Coordinate shared contracts with dashboard and auth owners before changing them.
- [ ] Keep each future change scoped to its behavior, tests, and documentation.
- [ ] Run `npm run check` and review the diff before requesting review.

Local documentation commits belong to the parent handoff process. This handoff does not authorize push, merge, or history rewriting. Task status in the branch's foundation-task snapshot is not the live orchestration state; authoritative tracking remains on the foundation branch.
