// types
import type { Prisma } from "@repo/db"
import type { ClientGameSession, UnsignedClientGameSession } from "@/lib/schema/session-schema"

/* Offline session metadata */
export const offlineSessionMetadata = {
  slug: '_',
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} satisfies Omit<ClientGameSession, keyof UnsignedClientGameSession>

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
