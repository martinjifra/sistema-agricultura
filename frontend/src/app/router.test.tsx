import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { appRoutes } from './router'

function open(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

afterEach(cleanup)

describe('shared frontend shell', () => {
  it('opens dashboard by default and links all team modules', async () => {
    const router = open('/')
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 })
    expect(router.state.location.pathname).toBe('/dashboard')
    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('href')).toBe('/dashboard')
    expect(screen.getByRole('link', { name: 'Management' }).getAttribute('href')).toBe('/management')
    expect(screen.getByRole('link', { name: 'Authentication' }).getAttribute('href')).toBe('/login')
  })

  it('navigates between team entry points without a backend', async () => {
    const user = userEvent.setup()
    const router = open('/dashboard')
    await user.click(screen.getByRole('link', { name: 'Management' }))
    await screen.findByRole('heading', { name: 'Management', level: 1 })
    expect(router.state.location.pathname).toBe('/management')
    await user.click(screen.getByRole('link', { name: 'Authentication' }))
    await screen.findByRole('heading', { name: 'Login', level: 1 })
    expect(router.state.location.pathname).toBe('/login')
    await user.click(screen.getByRole('link', { name: 'Register' }))
    await screen.findByRole('heading', { name: 'Register', level: 1 })
    expect(router.state.location.pathname).toBe('/register')
  })

  it.each([
    ['/dashboard', 'Dashboard'],
    ['/management', 'Management'],
    ['/login', 'Login'],
    ['/register', 'Register'],
  ])('supports direct loading of %s', async (path, title) => {
    open(path)
    await screen.findByRole('heading', { name: title, level: 1 })
    const content = path === '/dashboard'
      ? 'Datos demo'
      : 'This module is a placeholder. No backend is connected.'
    expect(screen.getByText(content)).toBeTruthy()
  })

  it('keeps navigation available for unknown routes', async () => {
    const router = open('/unknown')
    expect(screen.getByRole('heading', { name: 'Page not found', level: 1 })).toBeTruthy()
    await userEvent.setup().click(screen.getByRole('link', { name: 'Dashboard' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/dashboard'))
    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeTruthy()
  })
})
