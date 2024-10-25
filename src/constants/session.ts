/** Schema parser keys */
export const clientSessionKeys: (keyof ClientGameSession)[] = [
  'slug', 'collectionId',
  'type', 'mode', 'tableSize', 'status',
  'players', 'stats',
  'flipped', 'cards',
  'startedAt', 'continuedAt', 'closedAt', 'updatedAt'
] as const

export const offlineSessionKeys: (keyof UnsignedClientGameSession)[] = [
  'tableSize',
  'players', 'stats',
  'flipped', 'cards',
  'startedAt', 'continuedAt'
] as const

/** Offline metadata */
export const offlineSessionMetadata: Omit<ClientGameSession, keyof UnsignedClientGameSession> = {
  slug: '_',
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} as const
