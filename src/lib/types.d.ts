import type { MemoryCard } from "@/hooks/store/use-session-store"
import type { GameMode, GameSession, GameStatus, GameType, PlayerProfile, TableSize } from "@prisma/client"

declare global {
  declare type UnsignedClientGameSession = {
    tableSize: TableSize
    startedAt: Date
    flips: number
    cards: MemoryCard[]
  }

  declare type ClientGameSession = UnsignedClientGameSession & {
    type: GameType
    mode: GameMode
    status: GameStatus
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
