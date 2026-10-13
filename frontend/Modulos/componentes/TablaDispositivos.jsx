import { etiquetaEstado, resumenLectura, tiempoRelativo } from '../utils/formato.js'

function ultimaLecturaDispositivo(dispositivo) {
  const lecturas = (dispositivo.sensores || [])
    .map((sensor) => sensor.ultimaLectura)
    .filter(Boolean)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  return lecturas[0] || null
}

export function TablaDispositivos({
  dispositivos,
  responsables,
  onAbrir,
}) {
  const nombreResponsable = (id) =>
    responsables.find((item) => item.id === id)?.nombre || '—'

  return (
    <div className="gd-tabla-wrap">
      <table className="gd-tabla">
        <thead>
          <tr>
            <th>Dispositivo</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Sensores</th>
            <th>Responsable</th>
            <th>Última lectura</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((dispositivo) => {
            const lectura = ultimaLecturaDispositivo(dispositivo)
            return (
              <tr
                key={dispositivo.id}
                onClick={() => onAbrir(dispositivo)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === 'Enter') onAbrir(dispositivo)
                }}
              >
                <td>
                  <strong>{dispositivo.nombre}</strong>
                </td>
                <td>{dispositivo.ubicacion}</td>
                <td>
                  <span className={`gd-badge gd-badge-${dispositivo.estado}`}>
                    {etiquetaEstado(dispositivo.estado)}
                  </span>
                </td>
                <td>
                  {(dispositivo.sensores || []).map((s) => s.tipo).join(', ') || '—'}
                </td>
                <td>{nombreResponsable(dispositivo.responsableId)}</td>
                <td>
                  {resumenLectura(lectura)}
                  <div className="gd-meta">{tiempoRelativo(lectura?.fecha)}</div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
