export function getCurrentPlayerKey(
  ownerId: string,
  playerId: string
): "owner" | "guest" {
  return ownerId === playerId ? "owner" : "guest"
}

export function getOtherPlayerKey(
  ownerId: string,
  playerId: string
): "owner" | "guest" {
  const currentPlayerKey = getCurrentPlayerKey(ownerId, playerId)
  return currentPlayerKey === "owner" ? "guest" : "owner"
}
