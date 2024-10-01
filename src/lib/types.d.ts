import type { AppRouter } from "@/server/api/_app"
import type { GameMode, GameSession, GameStatus, GameType, PlayerProfile, TableSize } from "@prisma/client"

declare global {
  declare type ClientGameSession = Omit<
    GameSession,
    'id' | 'ownerId' | 'guestId' | 'guestResult' | 'continuedAt' | 'closedAt' | 'updatedAt'
  > & {
    guestResult?: PrismaJson.Result | null
    continuedAt?: Date | null
    closedAt?: Date | null
    updatedAt?: Date | null
  }

  declare type UnsignedClientGameSession = Omit<ClientGameSession, 'type' | 'mode' | 'status'>

  /** Prisma schemas */
  declare type GameSessionWithResult = GameSession & {
    result: Result
  }

  declare type PlayerProfileWithUserAvatar = PlayerProfile & {
    user: {
      imageUrl: string | null
    }
  }

  declare type GameSessionWithPlayerProfiles = GameSession & {
    owner: PlayerProfileWithUserAvatar
    guest: PlayerProfileWithUserAvatar | null
  }
}
