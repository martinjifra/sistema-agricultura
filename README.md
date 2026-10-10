# Irrigation system — auth team

`team/auth` is the auth team's handoff branch. The team owns the login UI, backend, and NoSQL database. Current `/login` and `/register` pages are public placeholders, not authentication.

Start with [the auth handoff guide](doc/team-guide.md). Common references:

- [Setup, commands, and team ownership](doc/README.md)
- [Frontend architecture and collaboration](doc/frontend-architecture.md)
- [Runtime and development dependencies](doc/dependencies.md)
- [Express API import and database integration](doc/backend.md)

Frontend work belongs in `frontend/src/modules/auth/`; the existing Express API belongs in `backend/` with its own dependencies. Its code has not been imported yet. Database engine, hosting, and API/session contracts still need to be supplied by the auth team; this setup adds no application behavior.
