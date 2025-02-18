// types
import type { CauseKey, ThrownBy, ServerErrorOpts } from "./types"
import type { ExtendedSocketError } from "../types/socket"

export class ServerError {
  public readonly thrownBy: ThrownBy
  public readonly key: CauseKey
  public readonly message: string
  public readonly description?: string | undefined
  public readonly data?: unknown

  public readonly name: 'ServerError'

  constructor(opts: ServerErrorOpts) {
    this.thrownBy = opts.thrownBy || 'UNKNOWN'
    this.key = opts.key || 'UNKNOWN'
    this.message = opts.message
    this.description = opts.description

    this.name = 'ServerError'
  }

  static throw(error: ServerErrorOpts): never {
    throw new ServerError(error)
  }

  static throwInAction(error: Omit<ServerErrorOpts, "thrownBy">, message?: string): never {
    throw new Error(message, {
      cause: new ServerError({ ...error, thrownBy: "ACTION" })
    })
  }

  static parser(error: ServerError | unknown): ServerError {
    if (error instanceof ServerError) {
      return error
    }

    if (error && (error as ServerError).name === "ServerError") {
      return error as ServerError
    }

    return new ServerError({
      message: "Something went wrong.",
      description: "Something unexpected happened during this request. Please try again later."
    })
  }

  static asSocketError(error: ServerError | unknown): ExtendedSocketError<ServerError> {
    const serverError = ServerError.parser(error)

    const socketError: ExtendedSocketError = new Error(serverError.message)
    socketError.data = serverError
    return socketError
  }
}
