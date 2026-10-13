import { etiquetaEstado, etiquetaTipo, formatearFecha, resumenLectura, tiempoRelativo } from '../utils/formato.js'
import { HistorialCambios } from './HistorialCambios.jsx'

export function DetalleDispositivo({
  dispositivo,
  responsable,
  permisos,
  onCerrar,
  onEditar,
  onEliminar,
  onToggleEstado,
}) {
  if (!dispositivo) return null

  return (
    <div className="gd-overlay" onClick={onCerrar} role="presentation">
      <div
        className="gd-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gd-detalle-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="gd-panel-cabecera">
          <div>
            <p className="gd-kicker">Detalle</p>
            <h2 id="gd-detalle-titulo">{dispositivo.nombre}</h2>
            <p className="gd-meta">{dispositivo.ubicacion}</p>
          </div>
          <button type="button" className="gd-btn gd-btn-ghost gd-btn-icono" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </div>

        <span className={`gd-badge gd-badge-${dispositivo.estado}`}>
          {etiquetaEstado(dispositivo.estado)}
        </span>

        <p>{dispositivo.descripcion || 'Sin descripción.'}</p>
        <p className="gd-meta">
          Responsable: {responsable?.nombre || 'Sin asignar'}
          <br />
          Actualizado: {formatearFecha(dispositivo.fechaActualizacion)}
        </p>

        <div className="gd-acciones-final" style={{ justifyContent: 'flex-start' }}>
          {permisos.puedeCambiarEstado && (
            <button type="button" className="gd-btn gd-btn-secundario" onClick={() => onToggleEstado(dispositivo)}>
              {dispositivo.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </button>
          )}
          {permisos.puedeEditar && (
            <button type="button" className="gd-btn" onClick={() => onEditar(dispositivo)}>
              Editar
            </button>
          )}
          {permisos.puedeEliminar && (
            <button type="button" className="gd-btn gd-btn-peligro" onClick={() => onEliminar(dispositivo)}>
              Eliminar
            </button>
          )}
        </div>

        <section className="gd-detalle-seccion">
          <h3>Sensores asociados</h3>
          {(dispositivo.sensores || []).map((sensor) => (
            <div key={sensor.id} className="gd-sensor-item">
              <div>
                <strong>
                  {etiquetaTipo(sensor.tipo)} · {sensor.modelo}
                </strong>
                <p className="gd-meta">
                  Rango {sensor.rangoMin}–{sensor.rangoMax} {sensor.unidad}
                  {' · '}Alerta {sensor.umbralAlertaMin}–{sensor.umbralAlertaMax} {sensor.unidad}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>{resumenLectura(sensor.ultimaLectura)}</strong>
                <p className="gd-meta">{tiempoRelativo(sensor.ultimaLectura?.fecha)}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="gd-detalle-seccion">
          <h3>Historial de cambios</h3>
          <HistorialCambios historial={dispositivo.historial} />
        </section>
      </div>
    </div>
  )
}
