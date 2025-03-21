// types
import type {
  OfflinePlayerConnection,
  OnlinePlayerConnection,
  PlayerConnection,
  PlayerConnectionOpts
} from "@repo/schema/player"

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

/**
 * Creates an online player connection object.
 * 
 * - Sets the player's status to `"online"`.
 * - Assigns the provided `socketId` to track the active session.
 * - Sets `connectedAt` to the current timestamp.
 * - Sets `disconnectedAt` to `null` since the player is online.
 *
 * @param {PlayerConnectionOpts} opts - The player connection options, including player details.
 * @param {string} socketId - The unique socket ID for the player's active connection.
 * @returns {OnlinePlayerConnection} - A structured representation of an online player connection.
 */
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

/**
 * Creates an offline player connection object.
 * 
 * - Sets the player's status to `"offline"`.
 * - Assigns `disconnectedAt` to the current timestamp.
 * - Clears `socketId` by setting it to `null`.
 * - Clears `connectedAt` by setting it to `null`.
 *
 * @param {PlayerConnectionOpts} opts - The player connection options, including player details.
 * @returns {OfflinePlayerConnection} - A structured representation of an offline player connection.
 */
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
