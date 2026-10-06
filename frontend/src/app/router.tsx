import { Navigate, type RouteObject } from 'react-router-dom'
import { AppShell } from './AppShell'
import { frontendModules } from './modules'

export const appRoutes: RouteObject[] = [{
  path: '/',
  Component: AppShell,
  children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    ...frontendModules.flatMap(({ routes }) => routes),
    { path: '*', element: <h1>Page not found</h1> },
  ],
}]
