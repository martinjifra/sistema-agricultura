import { etiquetaEstado, formatearFecha, resumenLectura, tiempoRelativo } from '../utils/formato.js'

function ultimaLecturaDispositivo(dispositivo) {
  const lecturas = (dispositivo.sensores || [])
    .map((sensor) => sensor.ultimaLectura)
    .filter(Boolean)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  return lecturas[0] || null
}

export function TarjetaDispositivo({
  dispositivo,
  responsable,
  puedeEditar,
  puedeCambiarEstado,
  onAbrir,
  onEditar,
  onToggleEstado,
}) {
  const lectura = ultimaLecturaDispositivo(dispositivo)
  const activo = dispositivo.estado === 'activo'

  return (
    <article className="gd-tarjeta" onClick={onAbrir}>
      <div className="gd-tarjeta-cabecera">
        <div>
          <h3>{dispositivo.nombre}</h3>
          <p className="gd-meta">{dispositivo.ubicacion}</p>
        </div>
        <span className={`gd-badge gd-badge-${dispositivo.estado}`}>
          {etiquetaEstado(dispositivo.estado)}
        </span>
      </div>

      <div className="gd-chips">
        {(dispositivo.sensores || []).map((sensor) => (
          <span key={sensor.id} className="gd-chip">
            {sensor.tipo} · {sensor.modelo}
          </span>
        ))}
      </div>

      <p className="gd-meta">
        Responsable: {responsable?.nombre || 'Sin asignar'}
        <br />
        Última lectura: {resumenLectura(lectura)} ({tiempoRelativo(lectura?.fecha)})
      </p>

      <div className="gd-tarjeta-pie" onClick={(evento) => evento.stopPropagation()}>
        <span className="gd-meta">{formatearFecha(dispositivo.fechaActualizacion)}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {puedeCambiarEstado && (
            <label className="gd-switch">
              <input
                type="checkbox"
                checked={activo}
                onChange={() => onToggleEstado(dispositivo)}
              />
              {activo ? 'Encendido' : 'Apagado'}
            </label>
          )}
          {puedeEditar && (
            <button type="button" className="gd-btn gd-btn-ghost" onClick={onEditar}>
              Editar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
