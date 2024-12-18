export type CAUSE_KEYS =
  'UNKNOWN' |
  'CLERK_UNAUTHORIZED' |
  'USER_NOT_FOUND' |
  'PLAYER_PROFILE_NOT_FOUND' |
  'PLAYER_PROFILE_LIMIT' |
  'ACTIVE_PLAYER_PROFILE' |
  'ALREADY_TAKEN' |
  'SESSION_NOT_FOUND' |
  'SESSION_ACCESS_DENIED' | 
  'ACTIVE_SESSION' |
  'COLLECTION_NOT_FOUND' |
  'COLLECTION_ACCESS_DENIED'

type ApiErrorOpts = {
  key: CAUSE_KEYS
  message: string
  description?: string | undefined
}

export class ApiError {
  public readonly key?: CAUSE_KEYS
  public readonly message: string
  public readonly description?: string | undefined
  public readonly data?: unknown

  public readonly name: 'ApiError'

  constructor(opts: ApiErrorOpts) {
    this.key = opts.key || 'UNKNOWN'
    this.message = opts.message
    this.description = opts.description

    this.name = 'ApiError'
  }

  static throw(error: ApiErrorOpts, message?: string): never {
    throw new Error(message, {
      cause: new ApiError(error)
    })
  }
}
