import axios from 'axios'

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getDevToken(): Promise<string | null> {
  const stored = localStorage.getItem('access_token')
  if (stored) return stored

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  try {
    const params = new URLSearchParams()
    params.append('client_id', 'parking-frontend')
    params.append('grant_type', 'password')
    params.append('username', 'admin.test')
    params.append('password', 'Admin.123!')

    const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180'
    const res = await axios.post(`${keycloakUrl}/realms/parking/protocol/openid-connect/token`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

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
