import type { AppRouter } from "@/server/api/_app"
import type { CardCollection, GameMode, GameSession, GameStatus, GameType, MemoryCard, PlayerProfile, TableSize, User } from "@prisma/client"

declare global {
  /** Theme types */
  declare type Theme = "light" | "dark"

  declare type UseThemeProps = {
    theme: Theme
    setTheme: (theme: Theme) => void
  }

  /** Collection types */
  declare type ClientCardCollection = Omit<CardCollection, 'userId'> & {
    user: User
    cards: MemoryCard[]
  }

  /** Session types */
  declare type ClientGameSession = Omit<
    GameSession,
    'id' | 'ownerId' | 'playerIds' | 'collectionId' | 'cards' |
    'continuedAt' | 'closedAt' | 'updatedAt'
  > & {
    players: {
      current: ClientPlayer
      other?: ClientPlayer | null
    }

    collection: ClientCardCollection
    cards: ClientSessionCard[]

    continuedAt?: Date | null
    closedAt?: Date | null
    updatedAt?: Date | null
  }

  declare type UnsignedClientGameSession = Omit<
    ClientGameSession,
    'slug' | 'type' | 'mode' | 'status' |
    'closedAt' | 'updatedAt'
  >

  declare type ClientSessionCard = PrismaJson.SessionCard & {
    imageUrl: string
  }

  /** Player types */
  declare type ClientPlayer = Omit<
    PlayerProfile,
    'id' | 'userId' | 'sessionIds'
  > & {
    imageUrl: string | null
  }

  /** Prisma schemas */
  declare type GameSessionWithPlayersWithAvatarWithCollectionWithCards = GameSession & {
    collection: CardCollectionWithCardsWithUser
    players: PlayerProfileWithUserAvatar[]
  }

  declare type CardCollectionWithCards = CardCollection & {
    cards: MemoryCard[]
  }

  declare type CardCollectionWithCardsWithUser = CardCollectionWithCards & {
    user: User
  }

  declare type PlayerProfileWithUserAvatar = PlayerProfile & {
    user?: {
      imageUrl: string | null
    }
  }
}
