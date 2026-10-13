# Dashboard team — irrigation system

`team/dashboard` is the visual dashboard team's local handoff branch. Own `frontend/src/modules/dashboard/` within the shared React + Vite + TypeScript application. `/dashboard` now shows three sensor cards, historical charts, and selectable reading history using clearly labeled synthetic demo data, without API or database access.

Start with [the dashboard handoff guide](doc/team-guide.md) for scope, route contracts, verification, and open decisions.

## Common guides

- [Setup, developer commands, and team ownership](doc/README.md)
- [Frontend architecture and collaboration](doc/frontend-architecture.md)
- [Runtime and development dependencies](doc/dependencies.md)
- [Synthetic dashboard data and API payloads](doc/dashboard-mocks.md)

Management has a separate owner. The auth team owns authentication, the visual login, backend, and NoSQL database. Coordinate shared application changes with the other teams; detailed instructions stay under `doc/`.
