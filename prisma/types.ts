export {}

declare global {
  namespace PrismaJson {
    // Memory card
    type SessionMemoryCardMetadata = {
      id: string
      key: string
    }

    type SessionMemoryCard = {
      flippedBy: string | null
      matchedBy: string | null
    }

    // Session
    type SessionStats = {
      timer: number
      matches: Record<string, number>
      flips: Record<string, number>
    }

    // Player
    type PlayerStats = {
      score: number
      timer: number
      flips: number
      matches: number
      sessions: number
    }
  }
}
