/** Offline metadata */
export const offlinePlayerMetadata: ClientPlayer = {
  color: '#ffffff',
  id: '_offline',
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
