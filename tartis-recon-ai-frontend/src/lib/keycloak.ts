import axios from 'axios'

let cachedToken: { token: string; expiresAt: number } | null = null
let authFailed = false

export function handleUnauthorized() {
  localStorage.removeItem('access_token')
  authFailed = true
}

export async function getDevToken(): Promise<string | null> {
  const stored = localStorage.getItem('access_token')
  if (stored) return stored

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const username = import.meta.env.VITE_DEV_USER
  const password = import.meta.env.VITE_DEV_PASSWORD

  if (!username || !password) {
    console.error(
      'VITE_DEV_USER / VITE_DEV_PASSWORD no configurados: define un .env.local (ver .env.example) para usar el atajo de login de desarrollo.',
    )
    return null
  }

  if (authFailed) {
    return null
  }

  try {
    const params = new URLSearchParams()
    params.append(
      'client_id',
      import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'parking-frontend',
    )
    params.append('grant_type', 'password')
    params.append('username', username)
    params.append('password', password)

    const keycloakUrl =
      import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180'
    const res = await axios.post(
      `${keycloakUrl}/realms/parking/protocol/openid-connect/token`,
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    )

    if (res.data?.access_token) {
      const token = res.data.access_token
      const expiresIn = (res.data.expires_in || 300) * 1000
      cachedToken = { token, expiresAt: Date.now() + expiresIn - 10000 }
      return token
    }
  } catch (err) {
    console.error('Error al obtener dev token de Keycloak:', err)
  }
  return null
}
