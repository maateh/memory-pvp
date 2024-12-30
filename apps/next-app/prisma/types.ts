import type { z } from "zod"
import type { sessionCardMetadataSchema, sessionCardSchema, sessionStatsSchema } from "@/lib/schema/session-schema"
import type { playerStatsSchema } from "@/lib/schema/player-schema"

declare global {
  namespace PrismaJson {
    type SessionCardMetadata = z.infer<typeof sessionCardMetadataSchema>

    type SessionCard = z.infer<typeof sessionCardSchema>

    type SessionStats = z.infer<typeof sessionStatsSchema>

    type PlayerStats = z.infer<typeof playerStatsSchema>
  }
}
