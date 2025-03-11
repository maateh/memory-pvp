import type { Filter, Sort } from "@/lib/types/query"
import type { PlayerFilterQuery, PlayerSortQuery } from "@/lib/schema/query/player-query"

/* Filter types */
export type PlayerFilterFields = Required<PlayerFilterQuery>
export type PlayerFilter = Filter<PlayerFilterFields>

/* Sort types */
export type PlayerSortFields = Required<PlayerSortQuery>
export type PlayerSort = Sort<PlayerSortFields>
