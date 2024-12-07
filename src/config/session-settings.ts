// types
import type { Prisma } from "@prisma/client"

/* Offline session metadata */
export const offlineSessionMetadata = {
  slug: '_',
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} satisfies Omit<ClientGameSession, keyof UnsignedClientGameSession>

export const sessionSchemaFields = {
  owner: true,
  collection: {
    include: {
      user: true,
      cards: true
    }
  },
  players: {
    include: {
      user: {
        select: { imageUrl: true }
      }
    }
  }
} satisfies Prisma.GameSessionInclude
