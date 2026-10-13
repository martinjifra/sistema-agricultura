export type MockSensorType = 'temperatura' | 'humedad' | 'luminosidad'

export interface MockSensor {
  _id: string
  ubicacion: string
  tipo_sensor: MockSensorType
  estado: 'activo' | 'inactivo'
  __v: number
}

export interface MockReading {
  _id: string
  dato: number
  unidad: '°C' | '%'
  fecha_hora: string
  id_sensor: string
  __v: number
}

export type MockPopulatedReading = Omit<MockReading, 'id_sensor'> & {
  id_sensor: Omit<MockSensor, '__v'>
}

export interface MockSensorHistory {
  sensor: Omit<MockSensor, '_id' | '__v'> & { id: string }
  datos: MockReading[]
}

export interface DashboardMocks {
  sensors: MockSensor[]
  readings: MockPopulatedReading[]
  histories: Record<string, MockSensorHistory>
}

function syntheticObjectId(value: number): string {
  return value.toString(16).padStart(24, '0')
}

// Synthetic snapshots only: no requests, credentials, devices, or database writes.
export function createDashboardMocks(): DashboardMocks {
  const dates = [
    '2026-01-01T12:00:00.000Z',
    '2026-01-01T11:00:00.000Z',
    '2026-01-01T10:00:00.000Z',
  ]
  const definitions: { type: MockSensorType; location: string; values: number[] }[] = [
    { type: 'temperatura', location: 'Demo location 1', values: [24, 23.5, 22] },
    { type: 'humedad', location: 'Demo location 2', values: [62, 60, 0] },
    { type: 'luminosidad', location: 'Demo location 3', values: [100, 65, 0] },
  ]
  const sensors: MockSensor[] = definitions.map(({ type, location }, index) => ({
    _id: syntheticObjectId(index + 1),
    ubicacion: location,
    tipo_sensor: type,
    estado: 'activo',
    __v: 0,
  }))
  const histories: Record<string, MockSensorHistory> = {}
  const readings: MockPopulatedReading[] = []

  sensors.forEach((sensor, sensorIndex) => {
    const datos = definitions[sensorIndex].values.map<MockReading>((dato, index) => ({
      _id: syntheticObjectId(100 + sensorIndex * dates.length + index),
      dato,
      unidad: sensor.tipo_sensor === 'temperatura' ? '°C' : '%',
      fecha_hora: dates[index],
      id_sensor: sensor._id,
      __v: 0,
    }))
    histories[sensor._id] = {
      sensor: {
        id: sensor._id,
        ubicacion: sensor.ubicacion,
        tipo_sensor: sensor.tipo_sensor,
        estado: sensor.estado,
      },
      datos,
    }
    readings.push(...datos.map(reading => ({
      ...reading,
      id_sensor: {
        _id: sensor._id,
        ubicacion: sensor.ubicacion,
        tipo_sensor: sensor.tipo_sensor,
        estado: sensor.estado,
      },
    })))
  })

  readings.sort((a, b) => Date.parse(b.fecha_hora) - Date.parse(a.fecha_hora))
  return { sensors, readings, histories }
}
