import z from "zod"

// schemas - generated
import {
  CardCollectionSchema,
  GameSessionSchema,
  MemoryCardSchema,
  PlayerProfileSchema,
  ResultSchema,
  UserSchema
} from "@/schema/generated"

// schemas - json
import {
  playerStats,
  sessionCard,
  sessionCardMetadata,
  sessionStats
} from "@/schema/json"

export const playerProfile = PlayerProfileSchema
  .omit({ stats: true })
  .extend({ stats: playerStats })

export const playerProfileWithUserAvatar = playerProfile
  .extend({ user: UserSchema.pick({ imageUrl: true }).optional() })

export const cardCollectionWithCards = CardCollectionSchema
  .extend({ cards: z.array(MemoryCardSchema) })

export const cardCollectionWithCardsWithUser = cardCollectionWithCards
  .extend({ user: UserSchema })

export const gameSessionWithPlayersWithAvatarWithCollectionWithCards = GameSessionSchema
  .omit({ stats: true, cards: true, flipped: true })
  .extend({
    collection: cardCollectionWithCardsWithUser.nullable(),
    owner: playerProfileWithUserAvatar.nullable().optional(),
    guest: playerProfileWithUserAvatar.nullable().optional(),
    stats: sessionStats,
    cards: z.array(sessionCard),
    flipped: z.array(sessionCardMetadata)
  })
  
export const resultWithPlayerWithSession = ResultSchema
  .omit({ playerId: true, sessionId: true })
  .extend({
    player: playerProfile,
    session: GameSessionSchema
      .pick({
        slug: true,
        mode: true,
        format: true,
        tableSize: true,
        startedAt: true
      })
      .extend({ stats: sessionStats })
  })
