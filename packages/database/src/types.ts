declare global {
  namespace PrismaJson {
    type PlayerStats = {
      score: number
      timer: number
      flips: number
      matches: number
      sessions: number
    }

    type SessionCardMetadata = {
      id: string
      key: number
    }

    type SessionCard = {
      id: string
      key: number
      flippedBy: string | null
      matchedBy: string | null
    }

    type SessionStats = {
      timer: number
      flips: Record<string, number>
      matches: Record<string, number>
    }
  }
}
