/**
 * TODO: write doc
 * 
 * @param ownerId 
 * @param playerId 
 * @returns 
 */
export function currentPlayerKey(
  ownerId: string,
  playerId: string
): "owner" | "guest" {
  return ownerId === playerId ? "owner" : "guest"
}

/**
 * TODO: write doc
 * 
 * @param ownerId 
 * @param playerId 
 * @returns 
 */
export function otherPlayerKey(
  ownerId: string,
  playerId: string
): "owner" | "guest" {
  const playerKey = currentPlayerKey(ownerId, playerId)
  return playerKey === "owner" ? "guest" : "owner"
}
