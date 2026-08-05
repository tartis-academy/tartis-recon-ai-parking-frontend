import { useEffect, useState, type ReactNode } from 'react'
import { keycloak, initKeycloak, getAuthToken, getToken, getRoles, hasRole } from '@/lib/keycloak'
import { authLabels } from './labels'

// eslint-disable-next-line react-refresh/only-export-components -- contrato de shell/AuthProvider ya consumido por mfe-entryexit exige getAuthToken/getToken en el mismo módulo que el componente
export { getAuthToken, getToken, getRoles, hasRole }

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Expuesto vía Module Federation como shell/AuthProvider (FSH-05).
 * Ya consumido por mfe-entryexit (feature/mfee-02-axios-interceptor):
 * envuelve la app remota y expone getAuthToken/getToken para su interceptor axios.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initKeycloak()
      .then(() => setReady(true))
      .catch((err) => setError(err?.message || authLabels.defaultError))
  }, [])

  if (error) {
    return (
      <div className="p-4 text-state-error">
        {authLabels.errorPrefix}: {error}
      </div>
    )
  }

  if (!ready || !keycloak.authenticated) {
    return <div className="p-4 text-gray-300">{authLabels.loading}</div>
  }

  return <>{children}</>
}

export default AuthProvider
