import { ESTADOS_DISPOSITIVO, TIPOS_SENSOR } from '../utils/constantes.js'

export function FiltrosDispositivos({
  busqueda,
  estado,
  tipoSensor,
  vista,
  onBusqueda,
  onEstado,
  onTipo,
  onVista,
}) {
  return (
    <div className="gd-toolbar">
      <input
        className="gd-buscar"
        type="search"
        placeholder="Buscar por nombre, parcela o responsable…"
        value={busqueda}
        onChange={(evento) => onBusqueda(evento.target.value)}
        aria-label="Buscar dispositivos"
      />
      <div className="gd-filtros">
        <select value={estado} onChange={(evento) => onEstado(evento.target.value)} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          {ESTADOS_DISPOSITIVO.map((item) => (
            <option key={item.valor} value={item.valor}>
              {item.etiqueta}
            </option>
          ))}
        </select>
        <select value={tipoSensor} onChange={(evento) => onTipo(evento.target.value)} aria-label="Filtrar por tipo de sensor">
          <option value="">Todos los sensores</option>
          {TIPOS_SENSOR.map((item) => (
            <option key={item.valor} value={item.valor}>
              {item.etiqueta}
            </option>
          ))}
        </select>
      </div>
      <div className="gd-vista" role="group" aria-label="Cambiar vista">
        <button type="button" className={vista === 'tarjetas' ? 'es-activa' : ''} onClick={() => onVista('tarjetas')}>
          Tarjetas
        </button>
        <button type="button" className={vista === 'tabla' ? 'es-activa' : ''} onClick={() => onVista('tabla')}>
          Tabla
        </button>
      </div>
    </div>
  )
}
