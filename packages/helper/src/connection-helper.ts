// types
import type {
  OfflinePlayerConnection,
  OnlinePlayerConnection,
  PlayerConnection,
  PlayerConnectionOpts
} from "@repo/schema/player-connection"

// config
import { RECONNECTION_TIMEOUT } from "@repo/config/connection"

/**
 * Checks if the reconnection time for a disconnected player has expired.
 *
 * - Returns `false` if the player is currently online.
 * - Calculates the time difference between now and when the player disconnected.
 * - If the difference exceeds `RECONNECTION_TIMEOUT`, the function returns `true`.
 * 
 * @param {PlayerConnection} connection - The player's connection status and timestamps.
 * @returns {boolean} - `true` if the player has exceeded the allowed reconnection time, otherwise `false`.
 */
export function reconnectionTimeExpired(
  connection: PlayerConnection
): boolean {
  if (connection.status === "online") return false

  const difference = Date.now() - Date.parse(connection.disconnectedAt.toString())
  if (difference >= RECONNECTION_TIMEOUT) return true
  return false
}

export function onlinePlayerConnection(
  opts: PlayerConnectionOpts,
  socketId: string
): OnlinePlayerConnection {
  return {
    ...opts,
    status: "online",
    socketId,
    connectedAt: new Date(),
    disconnectedAt: null
  }
}

export function offlinePlayerConnection(
  opts: PlayerConnectionOpts
): OfflinePlayerConnection {
  return {
    ...opts,
    status: "offline",
    disconnectedAt: new Date(),
    socketId: null,
    connectedAt: null
  }
}
