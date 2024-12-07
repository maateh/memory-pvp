import type { z } from "zod"
import type { playerFilterSchema, playerSortSchema } from "@/lib/validations/player-schema"

/* Filter types */
export type PlayerFilterFields = Required<z.infer<typeof playerFilterSchema>>

export type PlayerFilter = Filter<PlayerFilterFields>

/* Sort types */
export type PlayerSortFields = Required<z.infer<typeof playerSortSchema>>

export type PlayerSort = Sort<PlayerSortFields>
