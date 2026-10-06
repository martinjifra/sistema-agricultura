import { Link } from 'react-router-dom'
import { ModulePlaceholder } from '@/shared/ui/ModulePlaceholder'

export function LoginPage() {
  return (
    <>
      <ModulePlaceholder title="Login" owner="auth" modulePath="src/modules/auth" />
      <p><Link to="/register">Register</Link></p>
    </>
  )
}
