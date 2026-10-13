import { useCallback, useEffect, useMemo, useState } from 'react'
import { DetalleDispositivo } from './componentes/DetalleDispositivo.jsx'
import { FiltrosDispositivos } from './componentes/FiltrosDispositivos.jsx'
import { FormularioDispositivo } from './componentes/FormularioDispositivo.jsx'
import { ModalConfirmacion } from './componentes/ModalConfirmacion.jsx'
import { SelectorRol } from './componentes/SelectorRol.jsx'
import { TablaDispositivos } from './componentes/TablaDispositivos.jsx'
import { TarjetaDispositivo } from './componentes/TarjetaDispositivo.jsx'
import { Toast } from './componentes/Toast.jsx'
import './estilos/gestionDispositivos.css'
import {
  actualizarDispositivo,
  cambiarEstadoDispositivo,
  crearDispositivo,
  eliminarDispositivo,
  obtenerDispositivos,
  obtenerResponsables,
} from './services/dispositivosService.js'
import { ROLES, USUARIOS_DEMO } from './utils/constantes.js'
import { obtenerPermisos } from './utils/permisos.js'

/**
 * Componente principal del módulo.
 * Importar así desde src/:
 *   import { GestionDispositivos } from '../Modulos/GestionDispositivos.jsx'
 *
 * Cuando el login esté listo:
 *   <GestionDispositivos
 *     rolActual={usuario.rol}
 *     usuarioNombre={usuario.nombre}
 *     mostrarSelectorRol={false}
 *   />
 */
export function GestionDispositivos({
  rolActual,
  usuarioNombre,
  mostrarSelectorRol = true,
} = {}) {
  const [usuarioDemoId, setUsuarioDemoId] = useState(USUARIOS_DEMO[0].id)
  const usuarioDemo = USUARIOS_DEMO.find((u) => u.id === usuarioDemoId) || USUARIOS_DEMO[0]

  const rol = mostrarSelectorRol ? usuarioDemo.rol : rolActual || ROLES.VISUALIZADOR
  const nombreUsuario = mostrarSelectorRol
    ? usuarioDemo.nombre
    : usuarioNombre || 'Usuario'
  const permisos = obtenerPermisos(rol)

  const [dispositivos, setDispositivos] = useState([])
  const [responsables, setResponsables] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [ocupado, setOcupado] = useState(false)

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [vista, setVista] = useState('tarjetas')

  const [detalle, setDetalle] = useState(null)
  const [formulario, setFormulario] = useState(null)
  const [aEliminar, setAEliminar] = useState(null)
  const [toasts, setToasts] = useState([])

  const mostrarToast = useCallback((texto, tipo = 'ok') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, texto, tipo }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 3200)
  }, [])

  const cargar = useCallback(async () => {
    setCargando(true)
    setErrorCarga('')
    try {
      const [lista, gente] = await Promise.all([
        obtenerDispositivos(),
        obtenerResponsables(),
      ])
      setDispositivos(lista)
      setResponsables(gente)
    } catch (error) {
      setErrorCarga(error.message || 'No se pudieron cargar los dispositivos.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return dispositivos.filter((dispositivo) => {
      const responsable = responsables.find((r) => r.id === dispositivo.responsableId)
      const coincideTexto =
        !texto ||
        dispositivo.nombre.toLowerCase().includes(texto) ||
        dispositivo.ubicacion.toLowerCase().includes(texto) ||
        (responsable?.nombre || '').toLowerCase().includes(texto)
      const coincideEstado = !filtroEstado || dispositivo.estado === filtroEstado
      const coincideTipo =
        !filtroTipo ||
        (dispositivo.sensores || []).some((sensor) => sensor.tipo === filtroTipo)
      return coincideTexto && coincideEstado && coincideTipo
    })
  }, [dispositivos, responsables, busqueda, filtroEstado, filtroTipo])

  function responsableDe(dispositivo) {
    return responsables.find((item) => item.id === dispositivo.responsableId)
  }

  function refrescarDetalle(lista, id) {
    if (!id) return
    const actualizado = lista.find((item) => item.id === id)
    setDetalle(actualizado || null)
  }

  async function guardar(datos) {
    setOcupado(true)
    try {
      if (formulario?.id) {
        await actualizarDispositivo(formulario.id, { ...formulario, ...datos }, nombreUsuario)
        mostrarToast('Dispositivo actualizado.')
      } else {
        await crearDispositivo(datos, nombreUsuario)
        mostrarToast('Dispositivo creado.')
      }
      const lista = await obtenerDispositivos()
      setDispositivos(lista)
      setFormulario(null)
      refrescarDetalle(lista, formulario?.id)
    } catch (error) {
      mostrarToast(error.message || 'No se pudo guardar.', 'error')
    } finally {
      setOcupado(false)
    }
  }

  async function toggleEstado(dispositivo) {
    if (!permisos.puedeCambiarEstado) return
    const siguiente = dispositivo.estado === 'activo' ? 'inactivo' : 'activo'
    try {
      await cambiarEstadoDispositivo(dispositivo.id, siguiente, nombreUsuario)
      const lista = await obtenerDispositivos()
      setDispositivos(lista)
      refrescarDetalle(lista, detalle?.id)
      mostrarToast(
        siguiente === 'activo' ? 'Dispositivo activado.' : 'Dispositivo desactivado.',
      )
    } catch (error) {
      mostrarToast(error.message || 'No se pudo cambiar el estado.', 'error')
    }
  }

  async function confirmarEliminar() {
    if (!aEliminar) return
    setOcupado(true)
    try {
      await eliminarDispositivo(aEliminar.id)
      const lista = await obtenerDispositivos()
      setDispositivos(lista)
      if (detalle?.id === aEliminar.id) setDetalle(null)
      setAEliminar(null)
      mostrarToast('Dispositivo eliminado.')
    } catch (error) {
      mostrarToast(error.message || 'No se pudo eliminar.', 'error')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="gd-app">
      <div className="gd-shell">
        <header className="gd-top">
          <div>
            <p className="gd-kicker">Sistema de agricultura</p>
            <h1 className="gd-titulo">Gestión de dispositivos</h1>
            <p className="gd-subtitulo">
              Inventario de nodos IoT, sensores asociados y responsables en campo.
            </p>
          </div>
          <div className="gd-top-acciones">
            {mostrarSelectorRol && (
              <SelectorRol
                usuarios={USUARIOS_DEMO}
                usuarioId={usuarioDemoId}
                onChange={setUsuarioDemoId}
              />
            )}
            <button
              type="button"
              className="gd-btn"
              disabled={!permisos.puedeCrear}
              onClick={() => setFormulario({})}
              title={!permisos.puedeCrear ? 'Tu rol no permite crear dispositivos' : ''}
            >
              Nuevo dispositivo
            </button>
          </div>
        </header>

        <FiltrosDispositivos
          busqueda={busqueda}
          estado={filtroEstado}
          tipoSensor={filtroTipo}
          vista={vista}
          onBusqueda={setBusqueda}
          onEstado={setFiltroEstado}
          onTipo={setFiltroTipo}
          onVista={setVista}
        />

        {cargando && <p className="gd-cargando">Cargando dispositivos…</p>}
        {errorCarga && (
          <div className="gd-error-carga">
            <p>{errorCarga}</p>
            <button type="button" className="gd-btn" onClick={cargar}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !errorCarga && filtrados.length === 0 && (
          <p className="gd-vacio">No hay dispositivos que coincidan con la búsqueda o los filtros.</p>
        )}

        {!cargando && !errorCarga && filtrados.length > 0 && vista === 'tarjetas' && (
          <div className="gd-grid">
            {filtrados.map((dispositivo) => (
              <TarjetaDispositivo
                key={dispositivo.id}
                dispositivo={dispositivo}
                responsable={responsableDe(dispositivo)}
                puedeEditar={permisos.puedeEditar}
                puedeCambiarEstado={permisos.puedeCambiarEstado}
                onAbrir={() => setDetalle(dispositivo)}
                onEditar={() => setFormulario(dispositivo)}
                onToggleEstado={() => toggleEstado(dispositivo)}
              />
            ))}
          </div>
        )}

        {!cargando && !errorCarga && filtrados.length > 0 && vista === 'tabla' && (
          <TablaDispositivos
            dispositivos={filtrados}
            responsables={responsables}
            onAbrir={setDetalle}
          />
        )}
      </div>

      {detalle && (
        <DetalleDispositivo
          dispositivo={detalle}
          responsable={responsableDe(detalle)}
          permisos={permisos}
          onCerrar={() => setDetalle(null)}
          onEditar={(item) => {
            setDetalle(null)
            setFormulario(item)
          }}
          onEliminar={(item) => setAEliminar(item)}
          onToggleEstado={toggleEstado}
        />
      )}

      {formulario !== null && (
        <FormularioDispositivo
          dispositivo={formulario.id ? formulario : null}
          responsables={responsables}
          ocupado={ocupado}
          onCancelar={() => setFormulario(null)}
          onGuardar={guardar}
        />
      )}

      {aEliminar && (
        <ModalConfirmacion
          titulo="Eliminar dispositivo"
          mensaje={`¿Eliminar “${aEliminar.nombre}”? Esta acción no se puede deshacer.`}
          confirmarTexto="Eliminar"
          peligro
          ocupado={ocupado}
          onCancelar={() => setAEliminar(null)}
          onConfirmar={confirmarEliminar}
        />
      )}

      <Toast toasts={toasts} />

      <footer className="gd-integrantes">
        Martin Jimenez · Juan Esteban Sanchez · Juan Esteban Lopez
      </footer>
    </div>
  )
}

export default GestionDispositivos
