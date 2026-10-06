import type { RouteObject } from 'react-router-dom'

export interface FrontendModule {
  id: string
  navigation: { label: string; path: string }
  routes: RouteObject[]
}
