import { Link } from 'react-router-dom'
import { ModulePlaceholder } from '@/shared/ui/ModulePlaceholder'

export function RegisterPage() {
  return (
    <>
      <ModulePlaceholder title="Register" owner="auth" modulePath="src/modules/auth" />
      <p><Link to="/login">Back to login</Link></p>
    </>
  )
}
