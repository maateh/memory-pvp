// types
import type { Prisma } from "@repo/db"
import type { OfflineSessionMetadata } from "@repo/schema/session"

// config
import { offlinePlayerMetadata } from "@/config/player-settings"

/* Offline session metadata */
export const offlineSessionMetadata = {
  slug: "_offline",
  status: "RUNNING",
  format: "OFFLINE",
  mode: "CASUAL",
  owner: offlinePlayerMetadata,
  currentTurn: offlinePlayerMetadata.id
} satisfies OfflineSessionMetadata

export const sessionSchemaFields = {
  owner: {
    include: {
      user: {
        select: { imageUrl: true }
      }
    }
  },
  guest: {
    include: {
      user: {
        select: { imageUrl: true }
      }
    }
  },
  collection: {
    include: {
      user: true,
      cards: true
    }
  }
} satisfies Prisma.GameSessionInclude
