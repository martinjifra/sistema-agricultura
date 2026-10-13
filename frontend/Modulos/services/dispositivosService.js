/**
 * Capa de datos del módulo de dispositivos.
 *
 * Hoy usa mock en memoria. Cuando el backend esté listo, cambia
 * USAR_API a true y ajusta las URLs. El resto de componentes no cambia.
 *
 * Contrato de lectura de sensor (hardware / visualización):
 * { sensorId, dispositivoId, tipo, valor, unidad, fecha }
 * Ver también frontend/Modulos/utils/constantes.js (CONTRATO_LECTURA_SENSOR).
 */

import { dispositivosMock, responsablesMock } from '../data/dispositivosMock.js'

const USAR_API = false
const API_BASE = '/api/dispositivos'

let dispositivos = structuredClone(dispositivosMock)

function esperar(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function nuevoId(prefijo) {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function clonar(valor) {
  return structuredClone(valor)
}

async function peticionApi(ruta, opciones) {
  const respuesta = await fetch(`${API_BASE}${ruta}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones,
  })
  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    throw new Error(detalle || 'Error al comunicarse con el servidor.')
  }
  if (respuesta.status === 204) return null
  return respuesta.json()
}

function agregarHistorial(dispositivo, entrada) {
  dispositivo.historial = [
    {
      id: nuevoId('his'),
      fecha: new Date().toISOString(),
      ...entrada,
    },
    ...(dispositivo.historial || []),
  ]
}

export async function obtenerResponsables() {
  if (USAR_API) return peticionApi('/responsables')
  await esperar()
  return clonar(responsablesMock)
}

export async function obtenerDispositivos() {
  if (USAR_API) return peticionApi('')
  await esperar()
  return clonar(dispositivos)
}

export async function obtenerDispositivoPorId(id) {
  if (USAR_API) return peticionApi(`/${id}`)
  await esperar()
  const encontrado = dispositivos.find((item) => item.id === id)
  if (!encontrado) throw new Error('No se encontró el dispositivo.')
  return clonar(encontrado)
}

export async function crearDispositivo(datos, usuarioActual) {
  if (USAR_API) {
    return peticionApi('', { method: 'POST', body: JSON.stringify(datos) })
  }
  await esperar()
  const ahora = new Date().toISOString()
  const id = nuevoId('dev')
  const nuevo = {
    ...datos,
    id,
    fechaCreacion: ahora,
    fechaActualizacion: ahora,
    sensores: (datos.sensores || []).map((sensor) => ({
      ...sensor,
      id: sensor.id || nuevoId('sen'),
      ultimaLectura: null,
    })),
    historial: [],
  }
  agregarHistorial(nuevo, {
    accion: 'creacion',
    descripcion: 'Dispositivo registrado en el sistema.',
    usuario: usuarioActual,
  })
  dispositivos = [nuevo, ...dispositivos]
  return clonar(nuevo)
}

export async function actualizarDispositivo(id, datos, usuarioActual) {
  if (USAR_API) {
    return peticionApi(`/${id}`, { method: 'PUT', body: JSON.stringify(datos) })
  }
  await esperar()
  const indice = dispositivos.findIndex((item) => item.id === id)
  if (indice === -1) throw new Error('No se encontró el dispositivo.')

  const anterior = dispositivos[indice]
  const actualizado = {
    ...anterior,
    ...datos,
    id,
    fechaActualizacion: new Date().toISOString(),
    sensores: (datos.sensores || []).map((sensor) => ({
      ...sensor,
      id: sensor.id || nuevoId('sen'),
      ultimaLectura: sensor.ultimaLectura || null,
    })),
  }
  agregarHistorial(actualizado, {
    accion: 'edicion',
    descripcion: 'Se actualizaron datos, sensores o responsable.',
    usuario: usuarioActual,
  })
  dispositivos[indice] = actualizado
  return clonar(actualizado)
}

export async function eliminarDispositivo(id) {
  if (USAR_API) {
    return peticionApi(`/${id}`, { method: 'DELETE' })
  }
  await esperar()
  const existe = dispositivos.some((item) => item.id === id)
  if (!existe) throw new Error('No se encontró el dispositivo.')
  dispositivos = dispositivos.filter((item) => item.id !== id)
  return { ok: true }
}

export async function cambiarEstadoDispositivo(id, estado, usuarioActual) {
  if (USAR_API) {
    return peticionApi(`/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    })
  }
  await esperar()
  const dispositivo = dispositivos.find((item) => item.id === id)
  if (!dispositivo) throw new Error('No se encontró el dispositivo.')
  dispositivo.estado = estado
  dispositivo.fechaActualizacion = new Date().toISOString()
  agregarHistorial(dispositivo, {
    accion: 'estado',
    descripcion: `Estado cambiado a ${estado.replace('_', ' ')}.`,
    usuario: usuarioActual,
  })
  return clonar(dispositivo)
}

/**
 * Punto de integración para el equipo de visualización / hardware.
 * Hoy devuelve la última lectura mock de cada sensor del dispositivo.
 */
export async function obtenerLecturasDispositivo(dispositivoId) {
  if (USAR_API) return peticionApi(`/${dispositivoId}/lecturas`)
  await esperar(80)
  const dispositivo = dispositivos.find((item) => item.id === dispositivoId)
  if (!dispositivo) throw new Error('No se encontró el dispositivo.')
  return (dispositivo.sensores || [])
    .map((sensor) => sensor.ultimaLectura)
    .filter(Boolean)
}
