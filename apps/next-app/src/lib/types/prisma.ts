import type {
  CardCollection,
  GameSession,
  MemoryCard,
  PlayerProfile,
  User
} from "@repo/server/db"

/* Custom prisma schema types */
export type GameSessionWithPlayersWithAvatarWithCollectionWithCards = GameSession & {
  collection: CardCollectionWithCardsWithUser | null
  owner?: PlayerProfileWithUserAvatar | null
  guest?: PlayerProfileWithUserAvatar | null
}

export type CardCollectionWithCards = CardCollection & {
  cards: MemoryCard[]
}

export type CardCollectionWithCardsWithUser = CardCollectionWithCards & {
  user: User
}

export type PlayerProfileWithUserAvatar = PlayerProfile & {
  user?: {
    imageUrl: string | null
  }
}
