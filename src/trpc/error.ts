export type CAUSE_KEYS =
  'UNKNOWN' |
  'CLERK_UNAUTHORIZED' |
  'USER_NOT_FOUND' |
  'PLAYER_PROFILE_NOT_FOUND' |
  'ACTIVE_PLAYER_PROFILE' |
  'ALREADY_TAKEN' |
  'SESSION_NOT_FOUND' |
  'SESSION_ACCESS_DENIED' | 
  'ACTIVE_SESSION' |
  'COLLECTION_NOT_FOUND'

type TRPCApiErrorOpts = {
  key: CAUSE_KEYS
  message: string
  description?: string | undefined
}

export class TRPCApiError {
  public readonly key?: CAUSE_KEYS
  public readonly message: string
  public readonly description?: string | undefined
  public readonly data?: unknown

  public readonly name: 'TRPCApiError'

  constructor(opts: TRPCApiErrorOpts) {
    this.key = opts.key || 'UNKNOWN'
    this.message = opts.message
    this.description = opts.description

    this.name = 'TRPCApiError'
  }
}
