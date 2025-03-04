import type z from "zod"

// schemas - json
import {
  playerStats,
  sessionCard,
  sessionCardMetadata,
  sessionStats
} from "@/schema/json"

declare global {
  namespace PrismaJson {
    type PlayerStats = z.infer<typeof playerStats>
    type SessionCardMetadata = z.infer<typeof sessionCardMetadata>
    type SessionCard = z.infer<typeof sessionCard>
    type SessionStats = z.infer<typeof sessionStats>
  }
}
