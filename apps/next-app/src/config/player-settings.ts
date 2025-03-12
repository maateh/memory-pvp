// types
import type { ClientPlayer } from "@repo/schema/player"

/* Offline player metadata */
export const offlinePlayerMetadata = {
  color: '#ffffff',
  id: '_offline',
  tag: '_offline',
  isActive: false,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  stats: {
    elo: 0,
    flips: 0,
    matches: 0,
    avgTime: 0,
    totalTime: 0,
    sessions: 0
  }
} satisfies ClientPlayer

/* Deleted player placeholder */
export const deletedPlayerPlaceholder = {
  color: '#ffffff',
  id: '_deleted',
  tag: 'Deleted player',
  isActive: false,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  stats: {
    elo: 0,
    flips: 0,
    matches: 0,
    avgTime: 0,
    totalTime: 0,
    sessions: 0
  }
} satisfies ClientPlayer
