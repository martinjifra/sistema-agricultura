# Import the existing Express API

The auth team owns `backend/`, the existing Express API, and its NoSQL database integration. This directory is a landing area, not a replacement server. Frontend auth UI remains in `frontend/src/modules/auth/`.

## Current state

- The team has an Express API and database outside this scaffold.
- Their implementation has not yet been imported into `backend/`.
- The database engine, hosting, connection settings, and API contracts have not been supplied here.
- No server entry point, dependency manifest, environment keys, or startup command is invented by this setup.

## Import on team/auth

1. Work on `team/auth` and copy the existing API's source into `backend/`. Do not copy its `.git/` directory, installed dependencies, real environment files, database exports, or local database contents.
2. Bring the API's actual `package.json`, existing lockfile, configuration, and tests. Preserve its language, Node version, and package manager; do not replace them with the frontend's settings.
3. Document the real install, startup, and test commands in this guide once the files are present. The root npm scripts currently run the frontend only; they do not launch or test the API.
4. Configure the API privately using the environment mechanism it already supports. If it uses `.env`, keep that file local and provide a sanitized `.env.example` with the real variable names but no secrets.
5. Review `git status --short` before committing. Confirm that only intended code and reproducible configuration are included, not data, credentials, generated files, or a nested repository.

Do not initialize another Express project or install backend packages at the repository root or inside `frontend/`. Replace or extend `backend/README.md` as the team's entry point, keeping detailed setup and integration documentation under `doc/`.

## What belongs in Git

| Version with the API, when applicable | Keep outside Git |
| --- | --- |
| Source, routes, controllers, services, and tests | Actual database files or production records |
| Database models and validation rules used by the API | Database backups or exports |
| Index definitions and initialization/migration scripts | Database passwords, connection credentials, and keys |
| Synthetic development fixtures if the team needs them | Real user or device data |
| Dependency manifest and matching lockfile | Installed dependencies, logs, and build output |
| Sanitized configuration examples and setup instructions | Private environment configuration |

The root ignore rules already cover nested `node_modules/`, build output, coverage, logs, and `.env` files. They permit `.env.example`; review its values before committing. Database filenames depend on the chosen engine, so do not assume every possible data file is automatically ignored.

## Database boundary

```text
Browser frontend -> Express API -> Database
```

The database runs outside Git, whether the team currently hosts it locally or on a managed service. The API uses the team's private connection configuration; the frontend does not receive administrative database credentials or connect directly to the database.

Reuse the team's existing database. Do not create, reset, migrate, or load real data merely to add this repository space. Version only the code and instructions needed to reproduce the agreed setup, not its live contents.

The engine and hosting are still to be confirmed. This guide does not select MongoDB, Firebase, another NoSQL engine, or a provider, and does not create a database connection.

## Handoff needed by the frontend

Document the API's existing contracts with the dashboard and management owners before frontend integration:

- Development API address and actual routes/methods.
- Request/response shapes, errors, and authentication/session behavior.
- Available device readings and their units, based on the real API.
- Whether realtime updates exist and how clients should consume them.

Do not invent these contracts from the current frontend placeholders. Backend tests and a real connection check are the auth team's responsibility after importing their implementation; frontend checks do not prove that the API or database works.

See [team ownership](team-guide.md), [common setup](README.md), and [frontend boundaries](frontend-architecture.md).
