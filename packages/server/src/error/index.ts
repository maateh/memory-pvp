// types
import type { CauseKey, ThrownBy, ServerErrorOpts } from "@/error/types"
import type { ExtendedSocketError } from "@/types/socket"

export class ServerError<T = unknown> {
  public readonly thrownBy: ThrownBy
  public readonly key: CauseKey
  public readonly message: string
  public readonly description?: string | undefined
  public readonly data?: T

  public readonly name: "ServerError"

  constructor(opts: ServerErrorOpts<T>) {
    this.thrownBy = opts.thrownBy || "UNKNOWN"
    this.key = opts.key || "UNKNOWN"
    this.data = opts.data
    this.message = opts.message
    this.description = opts.description

    this.name = "ServerError"
  }

  static throw<T = unknown>(error: ServerErrorOpts<T>): never {
    throw new ServerError<T>(error)
  }

  static throwInAction<T = unknown>(error: Omit<ServerErrorOpts<T>, "thrownBy">, message?: string): never {
    throw new Error(message, {
      cause: new ServerError<T>({ ...error, thrownBy: "ACTION" })
    })
  }

  static parser<T = unknown>(error: ServerError<T> | unknown): ServerError<T> {
    if (error instanceof ServerError) {
      return error
    }

    if (error && (error as ServerError<T>).name === "ServerError") {
      return error as ServerError<T>
    }

    return new ServerError<T>({
      message: "Something went wrong.",
      description: "Something unexpected happened during this request. Please try again later."
    })
  }

  static asSocketError<T = unknown>(error: ServerError<T> | unknown): ExtendedSocketError<ServerError<T>> {
    const serverError = ServerError.parser<T>(error)

    const socketError: ExtendedSocketError = new Error(serverError.message)
    socketError.data = serverError
    return socketError
  }
}
