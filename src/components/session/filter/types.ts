import type { GameSession } from "@prisma/client"
import type { FilterFields, FilterKeys, FilterOptions } from "@/hooks/store/use-filter-store"

export type SessionFilterKeys = FilterKeys<GameSession, 'type' | 'mode' | 'tableSize'>

export type SessionFilterFields = FilterFields<GameSession, SessionFilterKeys>

export type SessionFilterOptions = FilterOptions<SessionFilterFields>
