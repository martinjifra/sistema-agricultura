import { useState } from 'react'
import { createDashboardMocks, type MockReading, type MockSensorType } from '../mocks/dashboard-data'
import styles from './DashboardPage.module.css'

const labels: Record<MockSensorType, string> = {
  temperatura: 'Temperatura',
  humedad: 'Humedad',
  luminosidad: 'Luminosidad',
}
const numbers = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 })
const dates = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC',
})

function readingText(reading: MockReading): string {
  return `${numbers.format(reading.dato)} ${reading.unidad}`
}

function dateText(value: string): string {
  return `${dates.format(new Date(value))} UTC`
}

function HistoryChart({ label, readings }: { label: string; readings: MockReading[] }) {
  const ordered = [...readings].sort((a, b) => Date.parse(a.fecha_hora) - Date.parse(b.fecha_hora))
  const unit = ordered[0].unidad
  const maximum = unit === '%' ? 100 : Math.max(5, Math.ceil(Math.max(...ordered.map(reading => reading.dato)) / 5) * 5)
  const start = Date.parse(ordered[0].fecha_hora)
  const duration = Date.parse(ordered[ordered.length - 1].fecha_hora) - start
  const points = ordered.map(reading => ({
    reading,
    x: 56 + (duration === 0 ? 0.5 : (Date.parse(reading.fecha_hora) - start) / duration) * 276,
    y: Number((180 - reading.dato / maximum * 156).toFixed(2)),
  }))
  const title = `Gráfica histórica de ${label}`
  const hours = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })
  const day = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })

  return (
    <figure className={styles.chart}>
      <figcaption className={styles.cardTitle}>{label}</figcaption>
      <svg className={styles.chartSvg} viewBox="0 0 360 240" role="img" aria-label={title}>
        <title>{title}</title>
        <desc>{ordered.map(reading => `${dateText(reading.fecha_hora)}: ${readingText(reading)}`).join('; ')}</desc>
        {[maximum, maximum / 2, 0].map(value => {
          const y = 180 - value / maximum * 156
          return (
            <g key={value}>
              <line x1="56" x2="332" y1={y} y2={y} className={styles.gridLine} />
              <text x="48" y={y + 4} textAnchor="end">{numbers.format(value)} {unit}</text>
            </g>
          )
        })}
        <polyline points={points.map(point => `${point.x},${point.y}`).join(' ')} className={styles.chartLine} />
        {points.map(({ reading, x, y }) => (
          <g key={reading._id}>
            <circle cx={x} cy={y} r="4" className={styles.chartPoint}>
              <title>{dateText(reading.fecha_hora)}: {readingText(reading)}</title>
            </circle>
            <text x={x} y="204" textAnchor="middle">{hours.format(new Date(reading.fecha_hora))}</text>
          </g>
        ))}
        <text x="194" y="230" textAnchor="middle">{day.format(new Date(ordered[0].fecha_hora))} · UTC</text>
      </svg>
    </figure>
  )
}

export function DashboardPage() {
  const [data] = useState(createDashboardMocks)
  const [selectedId, setSelectedId] = useState(data.sensors[0]._id)
  const history = data.histories[selectedId]
  const historyTitle = `Historial de ${labels[history.sensor.tipo_sensor]}`

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Monitoreo de sensores</p>
          <h1 className={styles.heading}>Dashboard</h1>
          <p className={styles.description}>Últimas lecturas e historial por sensor.</p>
        </div>
        <span className={styles.demoBadge}>Datos demo</span>
      </header>
      <p className={styles.notice}>Datos ficticios, sin conexión a la API ni a la base de datos.</p>

      <section className={styles.cards} aria-label="Lecturas de sensores">
        {data.sensors.map(sensor => {
          const label = labels[sensor.tipo_sensor]
          const latest = data.histories[sensor._id].datos[0]
          const selected = selectedId === sensor._id
          return (
            <article key={sensor._id} aria-labelledby={`sensor-${sensor._id}`} className={`${styles.card} ${selected ? styles.selected : ''}`}>
              <h2 id={`sensor-${sensor._id}`} className={styles.cardTitle}>{label}</h2>
              <p className={styles.value}>{readingText(latest)}</p>
              <dl className={styles.details}>
                <dt>Ubicación</dt><dd>{sensor.ubicacion}</dd>
                <dt>Estado</dt><dd><span className={styles.status}>{sensor.estado === 'activo' ? 'Activo' : 'Inactivo'}</span></dd>
                <dt>Última lectura</dt><dd><time dateTime={latest.fecha_hora}>{dateText(latest.fecha_hora)}</time></dd>
              </dl>
              <button type="button" className={styles.button} aria-label={`Ver historial de ${label}`} aria-pressed={selected} aria-controls="sensor-history" onClick={() => setSelectedId(sensor._id)}>
                Ver historial
              </button>
            </article>
          )
        })}
      </section>

      <section aria-labelledby="analytics-title" className={styles.analytics}>
        <header className={styles.historyHeader}>
          <h2 id="analytics-title" className={styles.historyTitle}>Analítica histórica</h2>
          <p className={styles.description}>Gráficas con datos demo fijos. No se actualizan en vivo.</p>
        </header>
        <div className={styles.charts}>
          {data.sensors.map(sensor => (
            <HistoryChart key={sensor._id} label={labels[sensor.tipo_sensor]} readings={data.histories[sensor._id].datos} />
          ))}
        </div>
      </section>

      <section id="sensor-history" className={styles.history} aria-labelledby="history-title">
        <header className={styles.historyHeader}>
          <h2 id="history-title" className={styles.historyTitle} aria-live="polite">{historyTitle}</h2>
          <p className={styles.description}>{history.sensor.ubicacion} · {history.datos.length} lecturas</p>
        </header>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>{historyTitle}</caption>
            <thead><tr><th scope="col">Fecha y hora (UTC)</th><th scope="col">Lectura</th></tr></thead>
            <tbody>
              {history.datos.map(reading => (
                <tr key={reading._id}>
                  <td><time dateTime={reading.fecha_hora}>{dateText(reading.fecha_hora)}</time></td>
                  <td>{readingText(reading)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
