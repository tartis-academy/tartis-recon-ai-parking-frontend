import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'parking',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'parking-frontend',
})

let initPromise: Promise<boolean> | null = null

/**
 * Inicializa la sesión de Keycloak una única vez para todo el shell.
 * FSH-05: keycloak.ts es la única fuente de verdad del token — los remotos
 * nunca deben instanciar su propio Keycloak, solo consumir shell/AuthProvider.
 */
export function initKeycloak(): Promise<boolean> {
  if (!initPromise) {
    initPromise = keycloak
      .init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .catch((err) => {
        // Permite reintentar en la siguiente llamada en vez de dejar la promesa rechazada para siempre
        initPromise = null
        throw err
      })

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).catch(() => keycloak.login())
    }
  }
  return initPromise
}

/**
 * Token JWT actual, refrescándolo si está a menos de 30s de expirar.
 * Es la función que se expone vía Module Federation (shell/AuthProvider)
 * para que los remotos inyecten el Bearer en sus propias instancias de axios.
 */
export async function getAuthToken(): Promise<string | null> {
  if (!keycloak.authenticated) return null
  try {
    await keycloak.updateToken(30)
  } catch {
    keycloak.login()
    return null
  }
  return keycloak.token ?? null
}

export const getToken = getAuthToken
