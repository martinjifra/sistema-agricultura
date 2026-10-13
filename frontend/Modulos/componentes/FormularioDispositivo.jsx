import { useEffect, useMemo, useState } from 'react'
import {
  ESTADOS_DISPOSITIVO,
  MODELOS_SENSOR,
  TIPOS_SENSOR,
  UNIDADES_SENSOR,
} from '../utils/constantes.js'
import { validarDispositivo } from '../utils/validacion.js'

function sensorVacio() {
  return {
    id: '',
    tipo: 'humedad',
    modelo: 'otro',
    unidad: '%',
    rangoMin: 0,
    rangoMax: 100,
    umbralAlertaMin: 20,
    umbralAlertaMax: 80,
  }
}

function aFormulario(dispositivo) {
  if (!dispositivo) {
    return {
      nombre: '',
      descripcion: '',
      ubicacion: '',
      estado: 'activo',
      responsableId: '',
      sensores: [sensorVacio()],
    }
  }
  return {
    nombre: dispositivo.nombre,
    descripcion: dispositivo.descripcion || '',
    ubicacion: dispositivo.ubicacion,
    estado: dispositivo.estado,
    responsableId: dispositivo.responsableId,
    sensores: (dispositivo.sensores || []).map((sensor) => ({ ...sensor })),
  }
}

export function FormularioDispositivo({
  dispositivo,
  responsables,
  onCancelar,
  onGuardar,
  ocupado,
}) {
  const [formulario, setFormulario] = useState(() => aFormulario(dispositivo))
  const [errores, setErrores] = useState({})
  const editando = Boolean(dispositivo)

  useEffect(() => {
    setFormulario(aFormulario(dispositivo))
    setErrores({})
  }, [dispositivo])

  const titulo = editando ? 'Editar dispositivo' : 'Nuevo dispositivo'

  const modelosFiltrados = useMemo(
    () => (tipo) => MODELOS_SENSOR.filter((modelo) => modelo.tipos.includes(tipo)),
    [],
  )

  function actualizarCampo(campo, valor) {
    setFormulario((prev) => ({ ...prev, [campo]: valor }))
  }

  function actualizarSensor(indice, campo, valor) {
    setFormulario((prev) => {
      const sensores = prev.sensores.map((sensor, i) => {
        if (i !== indice) return sensor
        const siguiente = { ...sensor, [campo]: valor }
        if (campo === 'tipo') {
          const tipo = TIPOS_SENSOR.find((item) => item.valor === valor)
          siguiente.unidad = tipo?.unidadDefault || siguiente.unidad
          siguiente.rangoMin = tipo?.rangoMin ?? siguiente.rangoMin
          siguiente.rangoMax = tipo?.rangoMax ?? siguiente.rangoMax
          const modelos = MODELOS_SENSOR.filter((m) => m.tipos.includes(valor))
          if (!modelos.some((m) => m.valor === siguiente.modelo)) {
            siguiente.modelo = modelos[0]?.valor || 'otro'
          }
        }
        return siguiente
      })
      return { ...prev, sensores }
    })
  }

  function agregarSensor() {
    setFormulario((prev) => ({ ...prev, sensores: [...prev.sensores, sensorVacio()] }))
  }

  function quitarSensor(indice) {
    setFormulario((prev) => ({
      ...prev,
      sensores: prev.sensores.filter((_, i) => i !== indice),
    }))
  }

  function enviar(evento) {
    evento.preventDefault()
    const resultado = validarDispositivo(formulario)
    setErrores(resultado)
    if (Object.keys(resultado).length > 0) return

    onGuardar({
      ...formulario,
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      ubicacion: formulario.ubicacion.trim(),
      sensores: formulario.sensores.map((sensor) => ({
        ...sensor,
        rangoMin: Number(sensor.rangoMin),
        rangoMax: Number(sensor.rangoMax),
        umbralAlertaMin: Number(sensor.umbralAlertaMin),
        umbralAlertaMax: Number(sensor.umbralAlertaMax),
      })),
    })
  }

  return (
    <div className="gd-overlay" onClick={onCancelar} role="presentation">
      <div
        className="gd-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gd-form-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="gd-panel-cabecera">
          <div>
            <p className="gd-kicker">Formulario</p>
            <h2 id="gd-form-titulo">{titulo}</h2>
          </div>
          <button type="button" className="gd-btn gd-btn-ghost gd-btn-icono" onClick={onCancelar} aria-label="Cerrar">
            ×
          </button>
        </div>

        <form className="gd-form" onSubmit={enviar} noValidate>
          <div className="gd-campo">
            <label htmlFor="gd-nombre">Nombre</label>
            <input
              id="gd-nombre"
              value={formulario.nombre}
              onChange={(e) => actualizarCampo('nombre', e.target.value)}
            />
            {errores.nombre && <span className="gd-error">{errores.nombre}</span>}
          </div>

          <div className="gd-campo">
            <label htmlFor="gd-desc">Descripción</label>
            <textarea
              id="gd-desc"
              value={formulario.descripcion}
              onChange={(e) => actualizarCampo('descripcion', e.target.value)}
            />
          </div>

          <div className="gd-fila-2">
            <div className="gd-campo">
              <label htmlFor="gd-ubicacion">Ubicación / parcela</label>
              <input
                id="gd-ubicacion"
                value={formulario.ubicacion}
                onChange={(e) => actualizarCampo('ubicacion', e.target.value)}
              />
              {errores.ubicacion && <span className="gd-error">{errores.ubicacion}</span>}
            </div>
            <div className="gd-campo">
              <label htmlFor="gd-estado">Estado</label>
              <select
                id="gd-estado"
                value={formulario.estado}
                onChange={(e) => actualizarCampo('estado', e.target.value)}
              >
                {ESTADOS_DISPOSITIVO.map((item) => (
                  <option key={item.valor} value={item.valor}>
                    {item.etiqueta}
                  </option>
                ))}
              </select>
              {errores.estado && <span className="gd-error">{errores.estado}</span>}
            </div>
          </div>

          <div className="gd-campo">
            <label htmlFor="gd-responsable">Responsable</label>
            <select
              id="gd-responsable"
              value={formulario.responsableId}
              onChange={(e) => actualizarCampo('responsableId', e.target.value)}
            >
              <option value="">Selecciona una persona</option>
              {responsables.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombre}
                </option>
              ))}
            </select>
            {errores.responsableId && <span className="gd-error">{errores.responsableId}</span>}
          </div>

          <section>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Sensores</h3>
              <button type="button" className="gd-btn gd-btn-secundario" onClick={agregarSensor}>
                Añadir sensor
              </button>
            </header>
            {errores.sensores && <p className="gd-error">{errores.sensores}</p>}

            {formulario.sensores.map((sensor, indice) => (
              <div key={sensor.id || `nuevo-${indice}`} className="gd-sensor-bloque">
                <header>
                  <strong>Sensor {indice + 1}</strong>
                  {formulario.sensores.length > 1 && (
                    <button type="button" className="gd-btn gd-btn-ghost" onClick={() => quitarSensor(indice)}>
                      Quitar
                    </button>
                  )}
                </header>

                <div className="gd-fila-2">
                  <div className="gd-campo">
                    <label>Tipo</label>
                    <select
                      value={sensor.tipo}
                      onChange={(e) => actualizarSensor(indice, 'tipo', e.target.value)}
                    >
                      {TIPOS_SENSOR.map((item) => (
                        <option key={item.valor} value={item.valor}>
                          {item.etiqueta}
                        </option>
                      ))}
                    </select>
                    {errores[`sensor_${indice}_tipo`] && (
                      <span className="gd-error">{errores[`sensor_${indice}_tipo`]}</span>
                    )}
                  </div>
                  <div className="gd-campo">
                    <label>Modelo</label>
                    <select
                      value={sensor.modelo}
                      onChange={(e) => actualizarSensor(indice, 'modelo', e.target.value)}
                    >
                      {modelosFiltrados(sensor.tipo).map((item) => (
                        <option key={item.valor} value={item.valor}>
                          {item.etiqueta}
                        </option>
                      ))}
                    </select>
                    {errores[`sensor_${indice}_modelo`] && (
                      <span className="gd-error">{errores[`sensor_${indice}_modelo`]}</span>
                    )}
                  </div>
                </div>

                <div className="gd-fila-2">
                  <div className="gd-campo">
                    <label>Unidad</label>
                    <select
                      value={sensor.unidad}
                      onChange={(e) => actualizarSensor(indice, 'unidad', e.target.value)}
                    >
                      {UNIDADES_SENSOR.map((unidad) => (
                        <option key={unidad} value={unidad}>
                          {unidad}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="gd-campo">
                    <label>Rango min / max</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        value={sensor.rangoMin}
                        onChange={(e) => actualizarSensor(indice, 'rangoMin', e.target.value)}
                      />
                      <input
                        type="number"
                        value={sensor.rangoMax}
                        onChange={(e) => actualizarSensor(indice, 'rangoMax', e.target.value)}
                      />
                    </div>
                    {errores[`sensor_${indice}_rango`] && (
                      <span className="gd-error">{errores[`sensor_${indice}_rango`]}</span>
                    )}
                  </div>
                </div>

                <div className="gd-campo">
                  <label>Umbrales de alerta min / max</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="number"
                      value={sensor.umbralAlertaMin}
                      onChange={(e) => actualizarSensor(indice, 'umbralAlertaMin', e.target.value)}
                    />
                    <input
                      type="number"
                      value={sensor.umbralAlertaMax}
                      onChange={(e) => actualizarSensor(indice, 'umbralAlertaMax', e.target.value)}
                    />
                  </div>
                  {errores[`sensor_${indice}_umbral`] && (
                    <span className="gd-error">{errores[`sensor_${indice}_umbral`]}</span>
                  )}
                </div>
              </div>
            ))}
          </section>

          <div className="gd-acciones-final">
            <button type="button" className="gd-btn gd-btn-secundario" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="gd-btn" disabled={ocupado}>
              {ocupado ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
