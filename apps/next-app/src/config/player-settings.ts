// types
import type { ClientPlayer } from "@repo/schema/player"

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
    timer: 0,
    sessions: 0
  }
} satisfies ClientPlayer

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
    timer: 0,
    sessions: 0
  }
} satisfies ClientPlayer
