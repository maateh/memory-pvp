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

  declare type GameSessionWithResult = GameSession & {
    result: Result | null
  }

  declare type UnsignedClientGameSession = {
    tableSize: TableSize
    startedAt: Date
    continuedAt?: Date | null
    timer: number
    flips: number
    flippedCards: MemoryCard[]
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
