export {}

declare global {
  namespace PrismaJson {
    type MemoryCard = {
      id: string
      key: string
      imageUrl: string
      isFlipped: boolean
      isMatched: boolean
    }

    type SessionStats = {
      timer: number
      flips: Record<string, number>
    }
  }
}
