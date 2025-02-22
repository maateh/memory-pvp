import type z from "zod"

// schemas
import {
  cardCollectionWithCards,
  cardCollectionWithCardsWithUser,
  gameSessionWithPlayersWithAvatarWithCollectionWithCards,
  playerProfileWithUserAvatar
} from "../schema"

export type PlayerProfileWithUserAvatar = z.infer<typeof playerProfileWithUserAvatar>
export type CardCollectionWithCards = z.infer<typeof cardCollectionWithCards>
export type CardCollectionWithCardsWithUser = z.infer<typeof cardCollectionWithCardsWithUser>
export type GameSessionWithPlayersWithAvatarWithCollectionWithCards = z.infer<typeof gameSessionWithPlayersWithAvatarWithCollectionWithCards>
