import { toast } from "sonner"
import { DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"

// types
import type { UploadThingError } from "uploadthing/server"
import type { ServerError } from "@repo/server/error"

export function handleServerError(
  error: ServerError | UploadThingError<any> | undefined | null,
  fallbackDescription?: string
) {
  if (error?.name === "ServerError") {
    toast.error(error.message, { description: error.description })
    return
  }

  if (error?.name === "UploadThingError") {
    toast.error(error.message, { description: fallbackDescription })
    return
  }

  toast.error(DEFAULT_SERVER_ERROR_MESSAGE, { description: fallbackDescription })
}

/**
 * Logs errors to the console in development mode.
 * 
 * @param {unknown} err - The error to log.
 * 
 * - Only logs the error if the environment is set to 'development'.
 */
export function logError(err: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(err)
  }
}
