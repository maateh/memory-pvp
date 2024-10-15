export const clientSessionKeys: (keyof ClientGameSession)[] = [
  'slug',
  'type', 'mode', 'tableSize', 'status',
  'players', 'stats',
  'flipped', 'cards',
  'startedAt', 'continuedAt', 'closedAt', 'updatedAt'
] as const

export const clientSessionPlayerKeys: (keyof SessionPlayerWithUserAvatar)[] = [
  'tag', 'isActive', 'color', 'user'
] as const

/** Offline session */
export const offlineSessionKeys: (keyof UnsignedClientGameSession)[] = [
  'tableSize',
  'players', 'stats',
  'flipped', 'cards',
  'startedAt', 'continuedAt'
] as const

export const offlineSessionMetadata: Omit<ClientGameSession, keyof UnsignedClientGameSession> = {
  slug: '_',
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} as const

export const offlinePlayerMetadata: SessionPlayerWithUserAvatar = {
  color: '#ffffff',
  tag: '_offline',
  isActive: false,
  user: {
    imageUrl: null
  }
} as const
