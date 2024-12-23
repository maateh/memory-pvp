import type { UserResource } from "@clerk/types"
import type {
  CardCollection,
  GameMode,
  GameSession,
  GameStatus,
  GameType,
  MemoryCard,
  PlayerProfile,
  TableSize,
  User
} from "@prisma/client"

/* User types */
export type ClerkUser = Omit<UserResource, 'username'> & { username: string }
export type ClientUser = Omit<User, 'id' | 'clerkId' | 'email' | 'updatedAt'>

/* Collection types */
export type ClientMemoryCard = Omit<MemoryCard, 'utKey' | 'collectionId'>

export type ClientCardCollection = Omit<CardCollection, 'userId'> & {
  user: ClientUser
  cards: ClientMemoryCard[]
}

/* Session types */
export type ClientGameSession = Omit<
  GameSession,
  'id' | 'collectionId' | 'ownerId' | 'guestId' | 'cards' |
  'continuedAt' | 'closedAt' | 'updatedAt'
> & {
  players: {
    current: ClientPlayer
    other?: ClientPlayer | null
  }

  collectionId: string
  cards: ClientSessionCard[]

  continuedAt?: Date | null
  closedAt?: Date | null
  updatedAt?: Date | null
}

export type UnsignedClientGameSession = Omit<
  ClientGameSession,
  'slug' | 'type' | 'mode' | 'status' |
  'closedAt' | 'updatedAt'
>

export type ClientSessionCard = PrismaJson.SessionCard & {
  imageUrl: string
}

/* Player types */
export type ClientPlayer = Omit<
  PlayerProfile,
  'userId' | 'sessionIds'
> & {
  imageUrl: string | null
}
