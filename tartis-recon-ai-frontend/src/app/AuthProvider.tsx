import { useEffect, useState, type ReactNode } from 'react'
import { keycloak, initKeycloak, getAuthToken, getToken } from '@/lib/keycloak'

// eslint-disable-next-line react-refresh/only-export-components -- contrato de shell/AuthProvider ya consumido por mfe-entryexit exige getAuthToken/getToken en el mismo módulo que el componente
export { getAuthToken, getToken }

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

  useEffect(() => {
    initKeycloak().then(() => setReady(true))
  }, [])

  if (!ready || !keycloak.authenticated) {
    return null
  }

  return <>{children}</>
}

export default AuthProvider
