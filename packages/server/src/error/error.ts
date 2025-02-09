// types
import type { CauseKey, CauseType, ServerErrorOpts } from "./types"

export class ServerError {
  public readonly type: CauseType
  public readonly key: CauseKey
  public readonly message: string
  public readonly description?: string | undefined
  public readonly data?: unknown

  public readonly name: 'ServerError'

  constructor(opts: ServerErrorOpts) {
    this.type = opts.type || 'UNKNOWN'
    this.key = opts.key || 'UNKNOWN'
    this.message = opts.message
    this.description = opts.description

    this.name = 'ServerError'
  }

  static throw(error: ServerErrorOpts): never {
    throw new ServerError(error)
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
}
