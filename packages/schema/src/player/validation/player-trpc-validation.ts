import { z } from "zod"

// schemas
import { playerFilter } from "@/player"
import { sessionFilter } from "@/session"

export const playerGetStatsValidation = z.object({ playerFilter, sessionFilter })

export type PlayerGetStatsValidation = z.infer<typeof playerGetStatsValidation>
