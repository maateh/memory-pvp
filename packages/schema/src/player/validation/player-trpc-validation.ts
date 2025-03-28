import { z } from "zod"

// schemas
import { resultFilter } from "@/session"

export const playerGetStatsValidation = z.object({
  playerId: z.string(),
  filter: resultFilter.default({})
})

export type PlayerGetStatsValidation = z.infer<typeof playerGetStatsValidation>
