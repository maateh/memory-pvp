import z from "zod"

// schemas - generated
import {
  CardCollectionSchema,
  GameSessionSchema,
  MemoryCardSchema,
  PlayerProfileSchema,
  UserSchema
} from "../generated/zod"

// schemas - json
import {
  playerStats,
  sessionCard,
  sessionCardMetadata,
  sessionStats
} from "./json"

export const playerProfileWithUserAvatar = PlayerProfileSchema
  .omit({ stats: true })
  .extend({
    user: UserSchema.pick({ imageUrl: true }).optional(),
    stats: playerStats
  })

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
