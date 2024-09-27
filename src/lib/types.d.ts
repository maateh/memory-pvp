import type { AppRouter } from "@/server/api/_app"
import type { GameMode, GameSession, GameStatus, GameType, PlayerProfile, Result, TableSize } from "@prisma/client"

declare global {
  declare type MemoryCard = {
    id: string
    key: string
    imageUrl: string
    isFlipped: boolean
    isMatched: boolean
  }

  declare type ClientGameSession = {
    sessionId: string

    type: GameType
    mode: GameMode
    tableSize: TableSize
    status: GameStatus

    timer: number
    startedAt: Date
    continuedAt?: Date | null

    flippedCards: MemoryCard[]
    cards: MemoryCard[]
    result: {
      flips: number
      score?: number | null
    }
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
