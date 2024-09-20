const STORAGE_KEY = "CLIENT_GAME_SESSION"

export function getSessionFromStorage(): UnsignedClientGameSession | null {
  if (typeof window === 'undefined') return null

  const rawSession = localStorage.getItem(STORAGE_KEY)
  if (!rawSession) return null

  return JSON.parse(rawSession)
}

export function saveSessionToStorage(session: UnsignedClientGameSession): UnsignedClientGameSession | void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearSessionFromStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
