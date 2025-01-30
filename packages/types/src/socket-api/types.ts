import type { SocketError } from "./error"

export type SocketResponse<T = unknown> = {
  message: string
  description?: string
  data?: T | null
  error?: SocketError | null
}
