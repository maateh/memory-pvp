/**
 * Determines the role of a player in a game session.
 *
 * @param {string} ownerId - The ID of the game session owner.
 * @param {string} playerId - The ID of the player whose role is being determined.
 * @returns {"owner" | "guest"} - Returns `"owner"` if the player is the session owner, otherwise returns `"guest"`.
 */
export function currentPlayerKey(
  ownerId: string,
  playerId: string
): "owner" | "guest" {
  return ownerId === playerId ? "owner" : "guest"
}

/**
 * Determines the role of the other player in a game session.
 *
 * @param {string} ownerId - The ID of the game session owner.
 * @param {string} playerId - The ID of the player whose counterpart role is being determined.
 * @returns {"owner" | "guest"} - Returns `"guest"` if the player is the session owner, otherwise returns `"owner"`.
 */
export function otherPlayerKey(
  ownerId: string,
  playerId: string
): "owner" | "guest" {
  const playerKey = currentPlayerKey(ownerId, playerId)
  return playerKey === "owner" ? "guest" : "owner"
}
