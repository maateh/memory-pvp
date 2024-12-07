import type { z } from "zod"
import type { sessionFilterSchema, sessionSortSchema } from "@/lib/schema/param/session-param"

/* Filter types */
export type SessionFilter = Required<z.infer<typeof sessionFilterSchema>>

export type SessionSettingsFilterFields = Pick<SessionFilter, 'type' | 'mode' | 'tableSize'>
export type SessionSettingsFilter = Filter<SessionSettingsFilterFields>

export type SessionStatusFilterFields = Pick<SessionFilter, 'status'>
export type SessionStatusFilter = Filter<SessionStatusFilterFields>

/* Sort types */
export type SessionSortFields = Required<z.infer<typeof sessionSortSchema>>
export type SessionSort = Sort<SessionSortFields>
