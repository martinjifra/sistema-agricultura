# Clean frontend foundation and team branches
Owner: `chore/frontend-foundation`; preserve the configured React frontend and deliver local team branches.
Delivery: `exception-ok` for the coherent local bootstrap/legacy cleanup (no PR or publishing); checks: `npm run check` and scoped structural probes.

## Specs

- S1: "si retiramos dejemos solo lo seteado y sobre todo esto dentro de un /doc"
- S2: "y despues creemos las ramas para cada grupo y cada rama con sus readme y sus docs"
- S3: "estoy deacuerdo bro necesitamos organizar el repo para que cada grupo trabaje aislado en su parte y definir al arquitectura para los del front"
- S4: "definamos las depencias en desarollo y las demas"
- S5: "si los encargador del auth hacen bd y back y la parte visual del login"
- S6: "si" — reply to the local-commit authorization question recorded in L3.

## Tasks

- T1 | S1,S3,S4,S6 | inline + independent verification (risk item 5) | in_progress | Clean legacy artifacts, consolidate common docs under doc/, and commit the shared frontend foundation | commit: pending
- T2 | S2,S3,S5,S6 | delegated parallel documentation in three isolated worktrees | pending | Create team/dashboard, team/management, team/auth from the shared commit; give each its README and doc/team-guide.md; verify and commit locally | commits: pending

## Log

- L1 (2026-10-06): "si retiramos dejemos solo lo seteado y sobre todo esto dentro de un /doc"
- L2 (2026-10-06): "y despues creemos las ramas para cada grupo y cada rama con sus readme y sus docs"
- L3 (2026-10-06): Authorization context: "¿Autorizas un **commit local de la base limpia** y los commits de documentación de cada rama, **sin hacer push**?" User reply: "si". No push, merge to main, or history rewriting is authorized.
- L4: Existing configured SPA is React + Vite + TypeScript with React Router and modules dashboard, management, auth. Backend and NoSQL database belong to auth owners. No functional module implementation is part of this cleanup.
- L5: Baseline HEAD is a175c600087245a3adaa067d1a581f2281471a0a. The shared SPA is uncommitted from the preceding approved setup. Root node_modules contains 1297 tracked files. Protected configured frontend hashes are in .cache/frontend-before-cleanup.sha256.
- L6: Interpretation: /doc means repository doc/. Remove live-server, root HTML prototype, vanilla Vite demo entry/styles/assets, and tracked root dependencies. Preserve configured frontend runtime and frontend dependencies. Root README becomes a documentation entry point; doc/ contains common setup, architecture, and dependency guides.
- L7: Task size is large because delivery spans independently committed branch states, which cannot be resumed from one git diff alone. T1 stays inline; T2 delegates independent branch handoff guides with disjoint worktrees. Estimated new authored work is about 220 documentation/configuration lines; the shared initial commit also carries the previously verified SPA and bulk removal of generated/vendor files. Review those areas separately. No additional application behavior is requested, so existing functional tests plus structural cleanup checks apply; no invented behavioral RED.
- L8: RDD is off. T1 must pass local checks and one independent verifier before its work-unit commit. T2 writers run structural documentation checks, return spec coverage, and never commit; parent assesses staged documentation-only diffs, checks branch ancestry and preserved frontend hashes, and commits the guides locally.
- L9: T1 self-checks passed: legacy/root dependency absence, zero indexed root node_modules files, valid documentation links, protected frontend checksums, npm run check (lint, TypeScript, 13 boundary tests, 7 navigation tests, production build), and staged whitespace. Native ASSESS returned high with RDD off, requiring independent verification. Provider continuation, retained without execution: `gentle-ai review status --cwd=/Users/carlosz/Devs/sistema-agricultura --contract=gentle-ai.review-integration/v2 --next-transition=true`. Native review is not started under the disabled RDD switch.
