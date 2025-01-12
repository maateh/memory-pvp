// types
import type { ZodSchema } from "zod"

// error
import { SocketError } from "@repo/types/socket-api-error"

export const validate = <T>(schema: ZodSchema<T>, input: T) => {
  const { success, data } = schema.safeParse(input)
  if (!success) {
    SocketError.throw({
      key: "VALIDATION_FAILED",
      message: "Validation failed.",
      description: "The session data sent to the server looks corrupted."
    })
  }
  return data
}
