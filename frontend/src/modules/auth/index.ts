import type { FrontendModule } from '@/shared/types/frontend-module'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

export const authModule: FrontendModule = {
  id: 'auth',
  navigation: { label: 'Authentication', path: '/login' },
  routes: [
    { path: 'login', Component: LoginPage },
    { path: 'register', Component: RegisterPage },
  ],
}
