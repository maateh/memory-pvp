// types
import type { OfflineSessionStorage } from "@repo/schema/session"

// constants
import { offlineSessionStorageKeys } from "@/lib/util/parser/session-parser"

// utils
import { pickFields } from "@/lib/util/parser"

/** Local storage key for the active offline session. */
const STORAGE_KEY = "CLIENT_GAME_SESSION"

/**
 * Retrieves the game session from localStorage.
 * - Does nothing if running in a non-browser environment.
 * 
 * @returns {OfflineSessionStorage | null} - The parsed session data or `null` if not found.
 * - Returns `null` if running in a non-browser environment or if the session doesn't exist.
 */
export function getSessionFromStorage(): OfflineSessionStorage | null {
  if (typeof window === 'undefined') return null

  const rawSession = localStorage.getItem(STORAGE_KEY)
  if (!rawSession) return null

  return JSON.parse(rawSession)
}

/**
 * Saves the game session to localStorage.
 * - Does nothing if running in a non-browser environment.
 * 
 * @param {OfflineSessionStorage} session - The session data to be saved.
 * @returns {OfflineSessionStorage | void} - Returns the session or void if in a non-browser environment.
 */
export function saveSessionToStorage(session: OfflineSessionStorage): OfflineSessionStorage | void {
  if (typeof window === 'undefined') return

  const offlineSession = pickFields(session, offlineSessionStorageKeys)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineSession))
}

/**
 * Clears the game session from localStorage.
 * - Does nothing if running in a non-browser environment.
 */
export function clearSessionFromStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
