import axios from 'axios'
import { mainAuthUrl } from 'urls'

const REFRESH_INTERVAL = 14 * 60 * 1000 // 15 minutes
let refreshTimer: number | null = null

/**
 * Call refresh endpoint once. Returns true if refresh succeeded.
 */
export async function refreshTokenOnce(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return false

    const res = await axios.post(`${mainAuthUrl}refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (res?.data) {
      const [newAccessToken, newRefreshToken] = String(res.data).split(';')
      if (newAccessToken) localStorage.setItem('token', newAccessToken)
      if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken)
      return true
    }
    return false
  } catch (err) {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    return false
  }
}

export function startTokenRefresh(): void {
  stopTokenRefresh()
  refreshTimer = window.setInterval(async () => {
    try {
      await refreshTokenOnce()
    } catch (e) {
      console.error('Token refresh failed', e)
    }
  }, REFRESH_INTERVAL) as unknown as number
}

export function stopTokenRefresh(): void {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer as unknown as number)
    refreshTimer = null
  }
}

export default {
  refreshTokenOnce,
  startTokenRefresh,
  stopTokenRefresh
}
