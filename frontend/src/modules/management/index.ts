import type { FrontendModule } from '@/shared/types/frontend-module'
import { ManagementPage } from './pages/ManagementPage'

export const managementModule: FrontendModule = {
  id: 'management',
  navigation: { label: 'Management', path: '/management' },
  routes: [{ path: 'management', Component: ManagementPage }],
}
