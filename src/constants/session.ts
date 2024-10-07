export const clientSessionKeys: (keyof ClientGameSession)[] = [
  'sessionId',
  'type', 'mode', 'tableSize', 'status',
  'players', 'stats',
  'flippedCards', 'cards',
  'startedAt', 'continuedAt', 'closedAt', 'updatedAt'
] as const

export const clientSessionPlayerKeys: (keyof SessionPlayerWithUserAvatar)[] = [
  'tag', 'color', 'user'
] as const

/** Offline session */
export const offlineSessionKeys: (keyof UnsignedClientGameSession)[] = [
  'tableSize',
  'players', 'stats',
  'flippedCards', 'cards',
  'startedAt', 'continuedAt'
] as const

export const offlineSessionMetadata: Omit<ClientGameSession, keyof UnsignedClientGameSession> = {
  sessionId: '_',
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} as const

export const offlinePlayer: SessionPlayerWithUserAvatar = {
  color: '#ffffff',
  tag: '_offline',
  user: {
    imageUrl: null
  }
} as const
