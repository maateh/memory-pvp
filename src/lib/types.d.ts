import type { AppRouter } from "@/server/api/_app"
import type { CardCollection, GameMode, GameSession, GameStatus, GameType, MemoryCard, PlayerProfile, TableSize, User } from "@prisma/client"

declare global {
  /** Theme types */
  declare type Theme = "light" | "dark"

  declare type UseThemeProps = {
    theme: Theme
    setTheme: (theme: Theme) => void
  }

  /** User types */
  declare type ClientUser = Omit<User, 'id' | 'clerkId' | 'email' | 'updatedAt'>

  /** Collection types */
  declare type ClientMemoryCard = Omit<MemoryCard, 'utKey' | 'collectionId'>

  declare type ClientCardCollection = Omit<CardCollection, 'userId'> & {
    user: ClientUser
    cards: ClientMemoryCard[]
  }

  /** Session types */
  declare type ClientGameSession = Omit<
    GameSession,
    'id' | 'ownerId' | 'playerIds' | 'cards' |
    'continuedAt' | 'closedAt' | 'updatedAt'
  > & {
    players: {
      current: ClientPlayer
      other?: ClientPlayer | null
    }

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
