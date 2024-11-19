import type { PlayerProfile } from "@prisma/client"

/* Filter types */
export type PlayerFilterFields = Pick<PlayerProfile, 'tag'>

export type PlayerFilter = Filter<PlayerFilterFields>

/* Sort types */
export type PlayerSortFields = Pick<PlayerProfile, 'tag' | 'createdAt'>

export type PlayerSort = Sort<PlayerSortFields>
