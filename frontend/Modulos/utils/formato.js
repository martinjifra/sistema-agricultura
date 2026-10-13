const ETIQUETAS_ESTADO = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  sin_conexion: 'Sin conexión',
}

const ETIQUETAS_TIPO = {
  humedad: 'Humedad',
  temperatura: 'Temperatura',
  luminosidad: 'Luminosidad',
}

export function etiquetaEstado(estado) {
  return ETIQUETAS_ESTADO[estado] || estado
}

export function etiquetaTipo(tipo) {
  return ETIQUETAS_TIPO[tipo] || tipo
}

export function formatearFecha(iso) {
  if (!iso) return 'Sin registro'
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return 'Fecha inválida'
  return fecha.toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function tiempoRelativo(iso) {
  if (!iso) return 'Nunca'
  const fecha = new Date(iso)
  const diff = Date.now() - fecha.getTime()
  const minutos = Math.floor(diff / 60000)
  if (minutos < 1) return 'Hace un momento'
  if (minutos < 60) return `Hace ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `Hace ${horas} h`
  const dias = Math.floor(horas / 24)
  return `Hace ${dias} d`
}

export function resumenLectura(lectura) {
  if (!lectura) return 'Sin lecturas'
  return `${lectura.valor} ${lectura.unidad}`
}
