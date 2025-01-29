/**
 * Generates a Redis key name by combining provided arguments with a namespace prefix.
 * 
 * @param {string[]} args - An array of strings to be concatenated as part of the key name.
 * @returns {string} - A formatted Redis key name prefixed with "memory:".
 */
export function getKeyName(...args: string[]): string {
  return `memory:${args.join(":")}`
}

/* List keys */
export const waitingRoomsKey = getKeyName("waiting_rooms")

/* Hash keys */
export const sessionKey = (slug: string) => getKeyName("sessions", slug)
export const waitingRoomKey = (slug: string) => getKeyName("waiting_rooms", slug)
export const roomKey = (slug: string) => getKeyName("session_rooms", slug)
export const connectionKey = (socketId: string) => getKeyName("connections", socketId)
export const playerConnectionKey = (playerId: string) => getKeyName("player_connections", playerId)
