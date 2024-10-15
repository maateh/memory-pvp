/** Schema parser keys */
export const clientPlayerKeys: (keyof ClientPlayer)[] = [
  'tag', 'isActive', 'color', 'imageUrl',
  'createdAt', 'updatedAt'
] as const

/** Offline metadata */
export const offlinePlayerMetadata: ClientPlayer = {
  color: '#ffffff',
  tag: '_offline',
  isActive: false,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  stats: {
    score: 0,
    timer: 0,
    flips: 0,
    matches: 0,
    sessions: 0
  }
} as const
