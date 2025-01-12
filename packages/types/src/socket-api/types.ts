import type { SocketError } from "./error"

export type SocketResponse<T> = {
  success: boolean
  message: string
  data: T | null
  error?: SocketError | null
}
