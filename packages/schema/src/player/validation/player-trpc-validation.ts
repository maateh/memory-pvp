import { z } from "zod"

// schemas
import { sessionFilter } from "@/session"

export const playerGetStatsValidation = z.object({
  filter: sessionFilter
})

export type PlayerGetStatsValidation = z.infer<typeof playerGetStatsValidation>
