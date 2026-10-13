import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DashboardPage } from './DashboardPage'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function tableRows(name: string) {
  const table = screen.getByRole('table', { name })
  return within(table).getAllByRole('row').slice(1).map(row =>
    within(row).getAllByRole('cell').map(cell => cell.textContent),
  )
}

describe('offline sensor dashboard', () => {
  it('clearly marks the readings as demo data without a live API connection', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeTruthy()
    expect(screen.getByText('Datos demo')).toBeTruthy()
    expect(screen.getByText('Datos ficticios, sin conexión a la API ni a la base de datos.')).toBeTruthy()
  })

  it('shows three cards with the latest reading, unit, location, state and UTC time', () => {
    render(<DashboardPage />)
    expect(screen.getAllByRole('article')).toHaveLength(3)
    for (const [name, value, location] of [
      ['Temperatura', '24 °C', 'Demo location 1'],
      ['Humedad', '62 %', 'Demo location 2'],
      ['Luminosidad', '100 %', 'Demo location 3'],
    ]) {
      const card = within(screen.getByRole('article', { name }))
      expect(card.getByRole('heading', { name, level: 2 })).toBeTruthy()
      expect(card.getByText(value)).toBeTruthy()
      expect(card.getByText(location)).toBeTruthy()
      expect(card.getByText('Activo')).toBeTruthy()
      expect(card.getByText('Última lectura')).toBeTruthy()
      expect(card.getByText('01/01/2026, 12:00 UTC')).toBeTruthy()
      expect(card.getByRole('button', { name: `Ver historial de ${name}` }).getAttribute('aria-controls')).toBe('sensor-history')
    }
  })

  it('initially shows the temperature history with all readings newest first', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { name: 'Historial de Temperatura', level: 2 })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ver historial de Temperatura' }).getAttribute('aria-pressed')).toBe('true')
    expect(tableRows('Historial de Temperatura')).toEqual([
      ['01/01/2026, 12:00 UTC', '24 °C'],
      ['01/01/2026, 11:00 UTC', '23,5 °C'],
      ['01/01/2026, 10:00 UTC', '22 °C'],
    ])
  })

  it('switches the table and selected button by mouse and keyboard without dropping zero values', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    await user.click(screen.getByRole('button', { name: 'Ver historial de Humedad' }))
    expect(screen.getByRole('heading', { name: 'Historial de Humedad', level: 2 })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ver historial de Humedad' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Ver historial de Temperatura' }).getAttribute('aria-pressed')).toBe('false')
    expect(tableRows('Historial de Humedad')).toEqual([
      ['01/01/2026, 12:00 UTC', '62 %'],
      ['01/01/2026, 11:00 UTC', '60 %'],
      ['01/01/2026, 10:00 UTC', '0 %'],
    ])
    screen.getByRole('button', { name: 'Ver historial de Luminosidad' }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Historial de Luminosidad', level: 2 })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Ver historial de Luminosidad' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Ver historial de Humedad' }).getAttribute('aria-pressed')).toBe('false')
    expect(tableRows('Historial de Luminosidad').map(row => row[1])).toEqual(['100 %', '65 %', '0 %'])
  })

  it('shows historical analytics clearly distinguished from live updates', () => {
    render(<DashboardPage />)
    const analytics = within(screen.getByRole('region', { name: 'Analítica histórica' }))
    expect(analytics.getByText('Gráficas con datos demo fijos. No se actualizan en vivo.')).toBeTruthy()
    expect(analytics.getAllByRole('img')).toHaveLength(3)
  })

  it('plots all sensor readings oldest first with values, units and UTC timestamps', () => {
    render(<DashboardPage />)
    for (const [name, values, upperLimit] of [
      ['Temperatura', ['22 °C', '23,5 °C', '24 °C'], '25 °C'],
      ['Humedad', ['0 %', '60 %', '62 %'], '100 %'],
      ['Luminosidad', ['0 %', '65 %', '100 %'], '100 %'],
    ] as const) {
      const chart = screen.getByRole('img', { name: `Gráfica histórica de ${name}` })
      const points = [...chart.querySelectorAll('circle')]
      expect(points.map(point => point.querySelector('title')?.textContent)).toEqual(
        values.map((value, index) => `01/01/2026, ${10 + index}:00 UTC: ${value}`),
      )
      expect(points.map(point => Number(point.getAttribute('cx')))).toEqual([56, 194, 332])
      expect(points.map(point => Number(point.getAttribute('cy')))).toEqual(
        name === 'Temperatura' ? [42.72, 33.36, 30.24]
          : name === 'Humedad' ? [180, 86.4, 83.28] : [180, 78.6, 24],
      )
      const line = chart.querySelector('polyline')
      expect(line?.getAttribute('points')).toBe(points.map(point => `${point.getAttribute('cx')},${point.getAttribute('cy')}`).join(' '))
      expect(within(chart).getByText(upperLimit)).toBeTruthy()
      expect(within(chart).getByText('01/01/2026 · UTC')).toBeTruthy()
      for (const hour of ['10:00', '11:00', '12:00']) expect(within(chart).getByText(hour)).toBeTruthy()
    }
  })

  it('renders and changes selection without requesting real data', async () => {
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const xhr = vi.spyOn(XMLHttpRequest.prototype, 'open')
    render(<DashboardPage />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ver historial de Humedad' }))
    expect(screen.getByRole('heading', { name: 'Historial de Humedad', level: 2 })).toBeTruthy()
    expect(fetch).not.toHaveBeenCalled()
    expect(xhr).not.toHaveBeenCalled()
  })
})
