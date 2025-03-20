import type z from "zod"

// schemas
import type {
  cardCollectionWithCards,
  cardCollectionWithCardsWithUser,
  gameSessionWithPlayersWithAvatarWithCollectionWithCards,
  playerProfileWithUserAvatar,
  playerProfile,
  resultWithPlayerWithSession
} from "@/schema"

export type PlayerProfile = z.infer<typeof playerProfile>
export type PlayerProfileWithUserAvatar = z.infer<typeof playerProfileWithUserAvatar>
export type CardCollectionWithCards = z.infer<typeof cardCollectionWithCards>
export type CardCollectionWithCardsWithUser = z.infer<typeof cardCollectionWithCardsWithUser>
export type GameSessionWithPlayersWithAvatarWithCollectionWithCards = z.infer<typeof gameSessionWithPlayersWithAvatarWithCollectionWithCards>
export type ResultWithPlayerWithSession = z.infer<typeof resultWithPlayerWithSession>
