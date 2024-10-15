export {}

declare global {
  namespace PrismaJson {
    type MemoryCardIdentifier = {
      id: string
      key: string
    }

    type MemoryCard = MemoryCardIdentifier & {
      imageUrl: string
      flippedBy: string | null
      matchedBy: string | null
    }

    type SessionStats = {
      timer: number
      matches: Record<string, number>
      flips: Record<string, number>
    }

    type PlayerStats = {
      score: number
      timer: number
      flips: number
      matches: number
      sessions: number
    }
  }
}
