import type { z } from "zod"
import type { Filter, Sort } from "@/lib/types/query"
import type { playerFilterSchema, playerSortSchema } from "@/lib/schema/query/player-query"

/* Filter types */
export type PlayerFilterFields = Required<z.infer<typeof playerFilterSchema>>

export type PlayerFilter = Filter<PlayerFilterFields>

/* Sort types */
export type PlayerSortFields = Required<z.infer<typeof playerSortSchema>>

export type PlayerSort = Sort<PlayerSortFields>
