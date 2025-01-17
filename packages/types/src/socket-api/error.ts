export type CAUSE_KEYS =
  'UNKNOWN' |
  'VALIDATION_FAILED' |
  'ROOM_NOT_FOUND' |
  'PLAYER_CONNECTION_NOT_FOUND' |
  'SESSION_ALREADY_STARTED'

type SocketErrorOpts = {
  key: CAUSE_KEYS
  message: string
  description?: string | undefined
}

export class SocketError {
  public readonly key?: CAUSE_KEYS
  public readonly message: string
  public readonly description?: string | undefined
  public readonly data?: unknown

  public readonly name: 'SocketError'

  constructor(opts: SocketErrorOpts) {
    this.key = opts.key || 'UNKNOWN'
    this.message = opts.message
    this.description = opts.description

    this.name = 'SocketError'
  }

  static throw(error: SocketErrorOpts): never {
    throw new SocketError(error)
  }

  static parser(error: SocketError | unknown): SocketError {
    if (error instanceof SocketError) {
      return error
    }

    if (error && (error as SocketError).name === "SocketError") {
      return error as SocketError
    }

    return new SocketError({
      key: "UNKNOWN",
      message: "Socket request failed.",
      description: "Something unexpected happened during this request. Please try again later."
    })
  }
}
