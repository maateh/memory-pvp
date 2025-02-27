// types
import type { PlayerConnection } from "@repo/schema/player-connection"

// config
import { RECONNECTION_TIMEOUT } from "@repo/config/connection"

/**
 * TODO: write doc
 * 
 * @param connection 
 * @returns 
 */
export function reconnectionTimeExpired(
  connection: PlayerConnection
): boolean {
  if (connection.status === "online") return false

  const difference = Date.now() - Date.parse(connection.disconnectedAt.toString())
  if (difference >= RECONNECTION_TIMEOUT) return true
  return false
}
