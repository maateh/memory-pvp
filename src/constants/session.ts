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

export const offlineSessionMetadata: Pick<ClientGameSession, 'type' | 'mode' | 'status'> = {
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} as const

export const offlinePlaceholderPlayer: SessionPlayerWithUserAvatar = {
  color: '#ffffff',
  tag: '_offline',
  user: {
    imageUrl: null
  }
} as const
