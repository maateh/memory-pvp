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

    type Result = {
      flips: number
      score?: number | null
    }
  }
}
