import type { z } from "zod"
import type { sessionCardMetadataSchema, sessionCardSchema, sessionStatsSchema } from "@repo/shared/schema/session"
import type { playerStatsSchema } from "@repo/shared/schema/player"

// FIXME: fix schema imports

declare global {
  namespace PrismaJson {
    type SessionCardMetadata = z.infer<typeof sessionCardMetadataSchema>
    type SessionCard = z.infer<typeof sessionCardSchema>
    type SessionStats = z.infer<typeof sessionStatsSchema>
    type PlayerStats = z.infer<typeof playerStatsSchema>
  }
}
