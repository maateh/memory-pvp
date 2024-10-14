import type { AppRouter } from "@/server/api/_app"
import type { GameMode, GameSession, GameStatus, GameType, PlayerProfile, TableSize } from "@prisma/client"

declare global {
  /** Theme types */
  declare type Theme = "light" | "dark"

  declare type UseThemeProps = {
    theme: Theme
    setTheme: (theme: Theme) => void
  }

  /** Session types */
  declare type ClientGameSession = Omit<
    GameSession,
    'id' | 'ownerId' | 'playerIds' |
    'continuedAt' | 'closedAt' | 'updatedAt'
  > & {
    players: {
      current: SessionPlayerWithUserAvatar
      other?: SessionPlayerWithUserAvatar | null
    }
    continuedAt?: Date | null
    closedAt?: Date | null
    updatedAt?: Date | null
  }

  declare type UnsignedClientGameSession = Omit<
    ClientGameSession,
    'slug' | 'type' | 'mode' | 'status' |
    'closedAt' | 'updatedAt'
  >

  /** Prisma schemas */
  declare type GameSessionWithOwnerWithPlayersWithAvatar = GameSession & {
    owner: PlayerProfile
    players: SessionPlayerWithUserAvatar[]
  }

  declare type SessionPlayerWithUserAvatar = Omit<
    PlayerProfile,
    'id' | 'userId' | 'sessionIds' | 'createdAt' | 'updatedAt'
  > & {
    user: {
      imageUrl: string | null
    }
  }

  declare type PlayerProfileWithUserAvatar = PlayerProfile & {
    user: {
      imageUrl: string | null
    }
  }
}
