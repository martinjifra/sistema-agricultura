import type { FrontendModule } from '@/shared/types/frontend-module'
import { DashboardPage } from './pages/DashboardPage'

export const dashboardModule: FrontendModule = {
  id: 'dashboard',
  navigation: { label: 'Dashboard', path: '/dashboard' },
  routes: [{ path: 'dashboard', Component: DashboardPage }],
}
