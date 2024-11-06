import type { GameSession } from "@prisma/client"

/** Filter types */
export type SessionSettingsFilterFields = Pick<GameSession, 'type' | 'mode' | 'tableSize'>
export type SessionSettingsFilter = Filter<SessionSettingsFilterFields>

export type SessionStatusFilterFields = Pick<GameSession, 'status'>
export type SessionStatusFilter = Filter<SessionStatusFilterFields>

