export type ThrownBy =
  "UNKNOWN" |
  "ACTION" |
  "TRPC" |
  "API" |
  "SOCKET_API" |
  "REDIS"

export type CauseKey =
  "UNKNOWN" |
  "ACCESS_DENIED" |
  "CLERK_UNAUTHORIZED" |
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
  'VALIDATION_FAILED' |
  "ROOM_NOT_FOUND" |
  "PLAYER_CONNECTION_NOT_FOUND" |
  "ROOM_STATUS_CONFLICT" |
  "SESSION_ALREADY_STARTED"

export type ServerErrorOpts = {
  thrownBy?: ThrownBy
  key?: CauseKey
  message: string
  description?: string | undefined
}
