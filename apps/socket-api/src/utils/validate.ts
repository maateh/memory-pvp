// types
import type { ZodSchema } from "zod"

// error
import { ServerError } from "@repo/server/error"

export const validate = <T>(schema: ZodSchema<T>, input: T) => {
  const { success, data } = schema.safeParse(input)
  if (!success) {
    ServerError.throw({
      thrownBy: "SOCKET_API",
      key: "VALIDATION_FAILED",
      message: "Validation failed.",
      description: "The session data sent to the server looks corrupted."
    })
  }
  return data
}
