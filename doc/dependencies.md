# Frontend dependencies

Keep browser libraries in `dependencies` and build, typing, lint, and testing tools in `devDependencies` inside `frontend/package.json`. The root package only forwards commands and has no dependencies.

## Install and verify

Use Node.js 24 LTS. From the repository root:

```sh
npm --prefix frontend ci
npm run check
```

The install needs development dependencies to build and test. Do not use `--omit=dev` before running the frontend build. Production hosting serves `frontend/dist/` as static files and does not need these Node.js tools at runtime.

## Browser dependencies

| Package | Responsibility |
| --- | --- |
| `react` | Components, rendering model, and local state |
| `react-dom` | Connect React rendering to the browser DOM |
| `react-router-dom` | Client routing and module navigation |

React Router complements Vite; it does not require an additional backend. The current setup uses its browser data router with module-owned routes, not a server-rendered framework application.

## Development dependencies

| Package | Responsibility |
| --- | --- |
| `vite` | Development server and production build |
| `@vitejs/plugin-react` | React integration and Fast Refresh |
| `typescript` | Static type checks |
| `@types/react` | React type definitions |
| `@types/react-dom` | DOM-renderer type definitions |
| `@types/node` | Types used by Node-based configuration |
| `eslint` | Run lint checks |
| `@eslint/js` | Base JavaScript lint rules |
| `typescript-eslint` | TypeScript parser and lint rules |
| `vitest` | Component and routing test runner |
| `@testing-library/react` | Render and inspect components in tests |
| `@testing-library/user-event` | Exercise user interactions in tests |
| `happy-dom` | Browser-like environment for component tests |

The exact version ranges live in the manifest; resolved versions live in `frontend/package-lock.json`. Avoid duplicating patch versions in guides. TypeScript stays on 5.9 for compatibility with the configured lint parser.

## Adding a dependency

1. Confirm a real module requirement and discuss shared tooling with the other teams.
2. Install from the frontend package, not the root:

   ```sh
   cd frontend
   npm install <package>
   # For development tooling:
   npm install --save-dev <package>
   ```

3. Commit the manifest and lockfile together and run `npm run check` from the root.

Do not add state management, charting, HTTP, or realtime libraries until their requirements are defined. Browser `fetch` and `WebSocket` are available without installing clients. Do not add native OS-specific bindings directly; Vite resolves the appropriate optional packages.

## Scope

Authentication, the external backend, and the NoSQL database are owned by the auth team. No database driver, backend framework, secret, or administrative credential belongs in this frontend dependency setup. See [architecture boundaries](frontend-architecture.md).
