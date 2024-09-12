import { TRPCError } from "@trpc/server"

export type CAUSE_KEYS =
  'CLERK_UNAUTHORIZED' |
  'USER_NOT_FOUND' |
  'PLAYER_PROFILE_NOT_FOUND' |
  'ACTIVE_PLAYER_PROFILE' |
  'ALREADY_TAKEN' |
  'SESSION_NOT_FOUND' |
  'ACTIVE_SESSION'

export class TRPCApiError extends TRPCError {
  public readonly key: CAUSE_KEYS
  public readonly description: string | undefined

  constructor(opts: Pick<TRPCError, 'message' | 'code' | 'cause'> & {
    key: CAUSE_KEYS
    description?: string
  }) {
    super(opts)
    this.key = opts.key
    this.description = opts.description

    this.name = 'TRPCApiError'
  }
}
