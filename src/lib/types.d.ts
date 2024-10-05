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
      current: PlayerProfileWithUserAvatar
      other?: PlayerProfileWithUserAvatar | null
    }
    continuedAt?: Date | null
    closedAt?: Date | null
    updatedAt?: Date | null
  }

  declare type UnsignedClientGameSession = Omit<ClientGameSession, 'type' | 'mode' | 'status'>

  /** Prisma schemas */
  declare type PlayerProfileWithUserAvatar = PlayerProfile & {
    user: {
      imageUrl: string | null
    }
  }
}
