const NOMBRE_MIN = 3
const NOMBRE_MAX = 80

function esNumero(valor) {
  return valor !== '' && valor !== null && !Number.isNaN(Number(valor))
}

/**
 * Valida el formulario de dispositivo + sensores.
 * Devuelve un objeto { campo: mensaje } vacío si todo está bien.
 */
export function validarDispositivo(formulario) {
  const errores = {}

  const nombre = (formulario.nombre || '').trim()
  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio.'
  } else if (nombre.length < NOMBRE_MIN) {
    errores.nombre = `El nombre debe tener al menos ${NOMBRE_MIN} caracteres.`
  } else if (nombre.length > NOMBRE_MAX) {
    errores.nombre = `El nombre no puede superar ${NOMBRE_MAX} caracteres.`
  }

  if (!(formulario.ubicacion || '').trim()) {
    errores.ubicacion = 'La ubicación o parcela es obligatoria.'
  }

  if (!formulario.estado) {
    errores.estado = 'Selecciona un estado.'
  }

  if (!formulario.responsableId) {
    errores.responsableId = 'Asigna un responsable.'
  }

  const sensores = formulario.sensores || []
  if (sensores.length === 0) {
    errores.sensores = 'Asocia al menos un sensor al dispositivo.'
  }

  sensores.forEach((sensor, indice) => {
    const prefijo = `sensor_${indice}`

    if (!sensor.tipo) {
      errores[`${prefijo}_tipo`] = 'El tipo es obligatorio.'
    }
    if (!sensor.modelo) {
      errores[`${prefijo}_modelo`] = 'El modelo es obligatorio.'
    }
    if (!sensor.unidad) {
      errores[`${prefijo}_unidad`] = 'La unidad es obligatoria.'
    }

    if (!esNumero(sensor.rangoMin) || !esNumero(sensor.rangoMax)) {
      errores[`${prefijo}_rango`] = 'Indica rango mínimo y máximo numéricos.'
    } else if (Number(sensor.rangoMin) >= Number(sensor.rangoMax)) {
      errores[`${prefijo}_rango`] = 'El mínimo debe ser menor que el máximo.'
    }

    if (esNumero(sensor.umbralAlertaMin) && esNumero(sensor.umbralAlertaMax)) {
      if (Number(sensor.umbralAlertaMin) >= Number(sensor.umbralAlertaMax)) {
        errores[`${prefijo}_umbral`] = 'El umbral mínimo debe ser menor que el máximo.'
      }
    }

    if (
      esNumero(sensor.rangoMin) &&
      esNumero(sensor.rangoMax) &&
      esNumero(sensor.umbralAlertaMin) &&
      esNumero(sensor.umbralAlertaMax)
    ) {
      const rMin = Number(sensor.rangoMin)
      const rMax = Number(sensor.rangoMax)
      const uMin = Number(sensor.umbralAlertaMin)
      const uMax = Number(sensor.umbralAlertaMax)
      if (uMin < rMin || uMax > rMax) {
        errores[`${prefijo}_umbral`] = 'Los umbrales deben estar dentro del rango del sensor.'
      }
    }
  })

  return errores
}
