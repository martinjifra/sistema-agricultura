# Dashboard offline data

Use `createDashboardMocks()` inside the dashboard module to obtain synthetic sensor and reading payloads. No API, credentials, database, seed command, or additional dependency is required.

## Quick use

```ts
import { createDashboardMocks } from '@/modules/dashboard/mocks/dashboard-data'

const mocks = createDashboardMocks()
const sensors = mocks.sensors
const allReadings = mocks.readings
const history = mocks.histories[sensors[0]._id]
```

The [factory](../frontend/src/modules/dashboard/mocks/dashboard-data.ts) returns new independent objects on each call. Keep these imports inside `frontend/src/modules/dashboard/`; do not bypass the module boundary from `app`, `shared`, or another team module.

## API payloads

These fixtures follow the implemented GET contracts in auth commit `2f67ef848f6aa99d729a91287558de9cbf7dca0a`, not a new backend contract:

| Bundle property | Corresponding response |
| --- | --- |
| `sensors` | `GET /api/sensores`: raw documents with `_id`, `ubicacion`, `tipo_sensor`, `estado`, `__v` |
| `readings` | `GET /api/datos`: raw readings with a populated `id_sensor` object |
| `histories[sensorId]` | `GET /api/datos/sensor/:id_sensor`: `{ sensor: { id, ubicacion, tipo_sensor, estado }, datos }`; readings retain a string `id_sensor` |

Each reading has `_id`, `dato`, `unidad`, `fecha_hora`, `id_sensor`, and `__v`. Preserve the difference between history `sensor.id` and raw document `_id` when integrating real responses.

## Synthetic samples

- Three active sensors: `temperatura`, `humedad`, and `luminosidad`.
- Three readings per sensor, nine total, with synthetic Mongo-shaped IDs and `Demo location` labels.
- Temperature is in **°C**; humidity and luminosity are in **%**, matching this API.
- Percentage samples include valid **0** and **100** values.
- Fixed UTC snapshots on `2026-01-01`, ordered newest first. These are not live timestamps or real readings.

The API has separate sensors, not a device-grouping model. These fixtures do not invent device IDs, assign sensors to one ESP, define alert thresholds, or mock users/authentication. They represent valid non-empty responses only, not every backend failure or missing-data case.

## Demo screen

Run `npm run dev` from the repository root and open `/dashboard`. The page initializes its own fixture snapshot and shows:

- Temperature, humidity, and luminosity cards with the latest value/unit, location, state, and UTC timestamp.
- A visible `Datos demo` badge and an explicit warning that no API or database is connected.
- Three historical line charts, one per sensor, ordered oldest first on a UTC time axis. The percent axes span 0–100; the temperature axis starts at zero and rounds its maximum up to a multiple of 5 °C.
- Accessible chart names and reading descriptions; hovering a plotted point shows its exact value and UTC timestamp through a native SVG title.
- A newest-first history table for the selected sensor; temperature is selected initially.
- `Ver historial` buttons that work with mouse or keyboard and expose their selected state to assistive technology. On desktop, the table is visible alongside the charts, not below them.

### Compact layout

The light theme uses green accents and a distributed grid: sensor cards across the top, historical charts on the lower left, and the selected sensor history on the lower right. The current nine-reading demo is designed to fit a 1366 × 768 desktop viewport at normal browser zoom without page scrolling. No content is clipped or hidden to force that fit.

Below 1100 CSS pixels, the layout stacks with history before analytics so that the table remains easy to discover. Below 651 pixels, sensor cards and charts also stack. Mobile, reduced-height windows and high browser zoom retain normal scrolling and keyboard access. More live readings may require a separately agreed table pagination/scrolling strategy.

For visual verification at 1366 × 768, select each of the three sensors and confirm that the cards, all charts, and complete three-row history table remain in view, without horizontal or vertical page overflow. At 390 and 320 pixels wide, confirm that no content is clipped and that selection still works with mouse or keyboard.

The analytics section explicitly states `Gráficas con datos demo fijos. No se actualizan en vivo.` Charts use native SVG without additional dependencies, and reflect only the existing non-empty, single-day demo snapshots. Empty/error responses and multi-day labels need to be defined before real API integration.

The dates are fixed demo snapshots, not live readings. There is no polling, HTTP interception, backend startup, or environment flag that switches this page to live data. Replacing its local data source with real API responses is a separate integration task.

## Checks and limits

Run `npm test` or `npm run check` from the repository root. The [fixture tests](../frontend/src/modules/dashboard/mocks/dashboard-data.test.ts) check payload shape and mutation isolation. The [page tests](../frontend/src/modules/dashboard/pages/DashboardPage.test.tsx) check cards/metadata, demo labeling, chart values/units/chronological plotting/axes/UTC labels, ordered history, mouse/keyboard selection, zero values, and no fetch/XHR requests. Shared route tests still cover other modules and now expect demo content only at `/dashboard`.

Responsive layout and real browser interaction must also be checked for UI changes. No production request automatically switches to mocks.

Mock success does not validate the real API's authentication, authorization, database connection, or input validation. Do not load these fixtures into a real database. See [the team handoff](team-guide.md) and [architecture boundaries](frontend-architecture.md).
