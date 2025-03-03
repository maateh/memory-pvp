/**
 * The maximum duration (in milliseconds) allowed for a client (player)
 * to reconnect before their session is considered lost and the
 * session room can be closed.
 *
 * @constant {number} RECONNECTION_TIMEOUT
 * @default 300000 (5 minutes)
 */
export const RECONNECTION_TIMEOUT: number = 300000 as const
