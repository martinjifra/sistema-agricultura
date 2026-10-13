/**
 * Constantes compartidas del módulo de gestión de dispositivos.
 * El equipo de sensores debe usar los mismos `tipo`, `modelo` y `unidad`.
 */

export const ROLES = {
  ADMIN: 'admin',
  OPERADOR: 'operador',
  VISUALIZADOR: 'visualizador',
}

export const ESTADOS_DISPOSITIVO = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'inactivo', etiqueta: 'Inactivo' },
  { valor: 'sin_conexion', etiqueta: 'Sin conexión' },
]

export const TIPOS_SENSOR = [
  { valor: 'humedad', etiqueta: 'Humedad', unidadDefault: '%', rangoMin: 0, rangoMax: 100 },
  { valor: 'temperatura', etiqueta: 'Temperatura', unidadDefault: '°C', rangoMin: -10, rangoMax: 60 },
  { valor: 'luminosidad', etiqueta: 'Luminosidad', unidadDefault: '%', rangoMin: 0, rangoMax: 100 },
]

export const MODELOS_SENSOR = [
  { valor: 'LM35', etiqueta: 'LM35', tipos: ['temperatura'] },
  { valor: 'fotorresistencia', etiqueta: 'Fotorresistencia', tipos: ['luminosidad'] },
  { valor: 'BH1750', etiqueta: 'BH1750', tipos: ['luminosidad'] },
  { valor: 'otro', etiqueta: 'Otro', tipos: ['humedad', 'temperatura', 'luminosidad'] },
]

export const UNIDADES_SENSOR = ['%', '°C', 'lux']

/**
 * Formato de una lectura que espera este módulo (equipo de hardware / visualización).
 *
 * @typedef {Object} LecturaSensor
 * @property {string} sensorId      Identificador del sensor asociado al dispositivo
 * @property {string} dispositivoId Identificador del dispositivo dueño del sensor
 * @property {'humedad'|'temperatura'|'luminosidad'} tipo
 * @property {number} valor         Valor numérico de la medición
 * @property {'%'|'°C'|'lux'} unidad
 * @property {string} fecha         ISO 8601, ej. "2026-10-06T12:30:00.000Z"
 *
 * Ejemplo:
 * {
 *   sensorId: "sen-001",
 *   dispositivoId: "dev-001",
 *   tipo: "humedad",
 *   valor: 62.4,
 *   unidad: "%",
 *   fecha: "2026-10-06T12:30:00.000Z"
 * }
 */
export const CONTRATO_LECTURA_SENSOR = {
  sensorId: 'string',
  dispositivoId: 'string',
  tipo: 'humedad | temperatura | luminosidad',
  valor: 'number',
  unidad: '% | °C | lux',
  fecha: 'string ISO 8601',
}

export const USUARIOS_DEMO = [
  { id: 'usr-admin', nombre: 'Ana López', rol: ROLES.ADMIN },
  { id: 'usr-operador', nombre: 'Carlos Méndez', rol: ROLES.OPERADOR },
  { id: 'usr-visualizador', nombre: 'Lucía Torres', rol: ROLES.VISUALIZADOR },
]
