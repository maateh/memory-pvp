import type { ServerError } from "../error/error"

export type SocketResponse<T = unknown> = {
  message: string
  description?: string
  data?: T | null
  error?: ServerError | null
}

export type ExtendedSocketError<T = any> = Error & {
  data?: T
}
