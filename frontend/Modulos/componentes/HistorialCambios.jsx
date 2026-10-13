import { formatearFecha } from '../utils/formato.js'

export function HistorialCambios({ historial = [] }) {
  if (!historial.length) {
    return <p className="gd-meta">Aún no hay cambios registrados.</p>
  }

  return (
    <ul className="gd-historial">
      {historial.map((item) => (
        <li key={item.id}>
          <strong>{item.descripcion}</strong>
          <span className="gd-meta">
            {item.usuario} · {formatearFecha(item.fecha)}
          </span>
        </li>
      ))}
    </ul>
  )
}
