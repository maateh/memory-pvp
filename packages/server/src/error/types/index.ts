export type ThrownBy =
  "UNKNOWN" |
  "ACTION" |
  "TRPC" |
  "API" |
  "SOCKET_API" |
  "REDIS"

export type CauseKey =
  "UNKNOWN" |
  "CLERK_UNAUTHORIZED" |
  "CLERK_TOKEN_MISSING" |
  "CLERK_TOKEN_INVALID" |
  "CLERK_TOKEN_EXPIRED" |
  "USER_NOT_FOUND" |
  "PLAYER_PROFILE_NOT_FOUND" |
  "PLAYER_PROFILE_LIMIT" |
  "ACTIVE_PLAYER_PROFILE" |
  "ALREADY_TAKEN" |
  "SESSION_NOT_FOUND" |
  "SESSION_ACCESS_DENIED" | 
  "ACTIVE_SESSION" |
  "COLLECTION_NOT_FOUND" |
  "COLLECTION_ACCESS_DENIED" |
  "VALIDATION_FAILED" |
  "FORCE_START_NOT_ALLOWED" |
  "ROOM_ACCESS_DENIED" |
  "ROOM_NOT_FOUND" |
  "PLAYER_CONNECTION_NOT_FOUND" |
  "ROOM_STATUS_CONFLICT" |
  "SESSION_ALREADY_STARTED"

export type ServerErrorOpts<T = unknown> = {
  thrownBy?: ThrownBy
  key?: CauseKey
  data?: T
  message: string
  description?: string | undefined
}
