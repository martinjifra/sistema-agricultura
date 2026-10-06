import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { appRoutes } from '@/app/router'
import '@/shared/styles/global.css'

const container = document.getElementById('app')
if (!container) throw new Error('Application root #app was not found')

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter(appRoutes)} />
  </StrictMode>,
)
