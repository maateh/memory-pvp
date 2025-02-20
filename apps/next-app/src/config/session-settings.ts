// types
import type { Prisma } from "@repo/db"
import type { ClientSession, OfflineClientSession } from "@repo/schema/session"

/* Offline session metadata */
export const offlineSessionMetadata = {
  slug: '_',
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} satisfies Omit<ClientSession, keyof OfflineClientSession>

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
