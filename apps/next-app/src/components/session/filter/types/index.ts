import type { z } from "zod"
import type { Filter, Sort } from "@/lib/types/query"
import type { sessionFilterSchema, sessionSortSchema } from "@/lib/schema/param/session-param"

/* Filter types */
export type SessionFilterFields = Required<z.infer<typeof sessionFilterSchema>>
export type SessionFilter = Filter<SessionFilterFields>

export type SessionSettingsFilterFields = Pick<SessionFilterFields, 'type' | 'mode' | 'tableSize'>
export type SessionSettingsFilter = Filter<SessionSettingsFilterFields>

export type SessionStatusFilterFields = Pick<SessionFilterFields, 'status'>
export type SessionStatusFilter = Filter<SessionStatusFilterFields>

/* Sort types */
export type SessionSortFields = Required<z.infer<typeof sessionSortSchema>>
export type SessionSort = Sort<SessionSortFields>
