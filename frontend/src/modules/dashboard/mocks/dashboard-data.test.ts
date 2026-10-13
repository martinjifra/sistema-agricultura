import { describe, expect, it } from 'vitest'
import { createDashboardMocks } from './dashboard-data'

const dates = [
  '2026-01-01T12:00:00.000Z',
  '2026-01-01T11:00:00.000Z',
  '2026-01-01T10:00:00.000Z',
]
const sensorKeys = ['_id', '__v', 'estado', 'tipo_sensor', 'ubicacion'].sort()
const readingKeys = ['_id', '__v', 'dato', 'fecha_hora', 'id_sensor', 'unidad'].sort()

describe('dashboard offline API fixtures', () => {
  it('provides three valid sensor documents using the GET sensor fields', () => {
    const { sensors } = createDashboardMocks()
    expect(sensors).toHaveLength(3)
    expect(sensors.map(({ tipo_sensor }) => tipo_sensor)).toEqual(['temperatura', 'humedad', 'luminosidad'])
    expect(new Set(sensors.map(({ _id }) => _id)).size).toBe(3)
    for (const sensor of sensors) {
      expect(Object.keys(sensor).sort()).toEqual(sensorKeys)
      expect(sensor._id).toMatch(/^[0-9a-f]{24}$/)
      expect(sensor.ubicacion).toMatch(/^Demo location /)
      expect(sensor.estado).toBe('activo')
      expect(sensor.__v).toBe(0)
    }
  })

  it('provides populated reading responses with correct units and percentage boundaries', () => {
    const { sensors, readings } = createDashboardMocks()
    expect(readings).toHaveLength(9)
    expect(new Set(readings.map(({ _id }) => _id)).size).toBe(9)
    for (const reading of readings) {
      expect(Object.keys(reading).sort()).toEqual(readingKeys)
      expect(reading._id).toMatch(/^[0-9a-f]{24}$/)
      expect(Object.keys(reading.id_sensor).sort()).toEqual(sensorKeys.filter(key => key !== '__v'))
      const sensor = sensors.find(({ _id }) => _id === reading.id_sensor._id)
      expect(sensor).toBeDefined()
      expect(reading.id_sensor).toEqual({
        _id: sensor!._id,
        ubicacion: sensor!.ubicacion,
        tipo_sensor: sensor!.tipo_sensor,
        estado: sensor!.estado,
      })
      expect(Number.isFinite(reading.dato)).toBe(true)
      expect(reading.__v).toBe(0)
      expect(reading.unidad).toBe(sensor!.tipo_sensor === 'temperatura' ? '°C' : '%')
      if (reading.unidad === '%') {
        expect(reading.dato).toBeGreaterThanOrEqual(0)
        expect(reading.dato).toBeLessThanOrEqual(100)
      }
    }
    const percentages = readings.filter(({ unidad }) => unidad === '%').map(({ dato }) => dato)
    expect(percentages).toContain(0)
    expect(percentages).toContain(100)
  })

  it('provides per-sensor wrappers with id and string references instead of populated objects', () => {
    const mocks = createDashboardMocks()
    expect(Object.keys(mocks.histories)).toHaveLength(3)
    for (const sensor of mocks.sensors) {
      const history = mocks.histories[sensor._id]
      expect(Object.keys(history).sort()).toEqual(['datos', 'sensor'])
      expect(history.sensor).toEqual({
        id: sensor._id,
        ubicacion: sensor.ubicacion,
        tipo_sensor: sensor.tipo_sensor,
        estado: sensor.estado,
      })
      expect(history.datos).toHaveLength(3)
      for (const reading of history.datos) {
        expect(Object.keys(reading).sort()).toEqual(readingKeys)
        expect(reading.id_sensor).toBe(sensor._id)
        const populated = mocks.readings.find(({ _id }) => _id === reading._id)
        expect(populated).toEqual({ ...reading, id_sensor: {
          _id: sensor._id,
          ubicacion: sensor.ubicacion,
          tipo_sensor: sensor.tipo_sensor,
          estado: sensor.estado,
        } })
      }
    }
  })

  it('uses fixed UTC dates and newest-first order in both reading endpoints', () => {
    const mocks = createDashboardMocks()
    expect([...new Set(mocks.readings.map(({ fecha_hora }) => fecha_hora))]).toEqual(dates)
    for (const history of Object.values(mocks.histories)) {
      expect(history.datos.map(({ fecha_hora }) => fecha_hora)).toEqual(dates)
    }
    const timestamps = mocks.readings.map(({ fecha_hora }) => Date.parse(fecha_hora))
    expect(timestamps.every(Number.isFinite)).toBe(true)
    expect(timestamps).toEqual([...timestamps].sort((a, b) => b - a))
  })

  it('returns deterministic, fresh payloads without shared mutable endpoint objects', () => {
    const first = createDashboardMocks()
    const second = createDashboardMocks()
    expect(first.sensors).toHaveLength(3)
    expect(first).toEqual(second)
    const sensorId = first.sensors[0]._id
    const originalLocation = second.sensors[0].ubicacion
    first.sensors[0].ubicacion = 'Changed locally'
    first.histories[sensorId].datos[0].dato = 999
    first.readings[0].id_sensor.ubicacion = 'Changed reading'
    expect(first.histories[sensorId].sensor.ubicacion).toBe(originalLocation)
    expect(first.readings.find(({ id_sensor }) => id_sensor._id === sensorId)?.dato).not.toBe(999)
    expect(second).toEqual(createDashboardMocks())
  })
})
