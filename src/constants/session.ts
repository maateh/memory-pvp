export const clientSessionKeys: (keyof ClientGameSession)[] = [
  'sessionId',
  'type', 'mode', 'tableSize', 'status',
  'players', 'stats',
  'flippedCards', 'cards',
  'startedAt', 'continuedAt', 'closedAt', 'updatedAt'
]

export const clientSessionPlayerKeys: (keyof SessionPlayerWithUserAvatar)[] = [
  'tag', 'color', 'user'
]
