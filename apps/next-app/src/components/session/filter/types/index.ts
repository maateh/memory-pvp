import type { Filter, Sort } from "@/lib/types/query"
import type { SessionFilterQuery, SessionSortQuery } from "@/lib/schema/query/session-query"

/* Filter types */
export type SessionFilterFields = Required<SessionFilterQuery>
export type SessionFilter = Filter<SessionFilterFields>

export type SessionSettingsFilterFields = Pick<SessionFilterFields, 'type' | 'mode' | 'tableSize'>
export type SessionSettingsFilter = Filter<SessionSettingsFilterFields>

export type SessionStatusFilterFields = Pick<SessionFilterFields, 'status'>
export type SessionStatusFilter = Filter<SessionStatusFilterFields>

/* Sort types */
export type SessionSortFields = Required<SessionSortQuery>
export type SessionSort = Sort<SessionSortFields>
