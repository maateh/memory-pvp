import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { toast } from "sonner"

// types
import type { UploadThingError } from "uploadthing/server"
import type { TRPCApiError } from "@/trpc/error"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Selectively picks specified fields from an object.
 * 
 * - Takes an object and an array of keys, returning a new object with only the specified fields.
 * - If a key doesn't exist in the object, it is ignored.
 * 
 * @param {T} obj - The object to pick fields from.
 * @param {U[]} keys - An array of keys to extract from the object.
 * 
 * @returns {Pick<T, U>} - A new object containing only the specified fields.
 */
export function pickFields<T extends object, U extends keyof T>(obj: T, keys: U[]): Pick<T, U> {
  const result = {} as Pick<T, U>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

/**
 * TODO: write doc
 * 
 * @param files 
 * @returns 
 */
export function generateFileUrls(files: File[]): Promise<string[]> {
  const generateUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()
    
    fileReader.onload = (e) => {
      const fileUrl = e.target?.result as string
      if (fileUrl) {
        resolve(fileUrl)
      } else {
        reject(new Error("Failed to generate file URL"))
      }
    }

    fileReader.onerror = (err) => {
      reject(err)
    }

    fileReader.readAsDataURL(file)
  })

  return Promise.all(files.map((file) => generateUrl(file)))
}

/**
 * Handles API errors by displaying an appropriate toast notification.
 * 
 * @param {TRPCApiError | undefined} err - The error object from the API, if available.
 * @param {string} [fallbackDescription] - Optional fallback error description.
 * 
 * - If the error is a `TRPCApiError`, it shows a toast with the error message and description.
 * - If no specific error is provided, it displays a generic error message with the fallback description.
 */
export function handleApiError(
  err: TRPCApiError | UploadThingError<any> | undefined,
  fallbackDescription?: string
) {
  if (err?.name === 'TRPCApiError') {
    toast.error(err.message, {
      description: err.description
    })
    return
  }

  if (err?.name === 'UploadThingError') {
    toast.error(err.message, {
      description: fallbackDescription
    })
    return
  }

  toast.error('Something went wrong.', { description: fallbackDescription })
}

/**
 * Logs errors to the console in development mode.
 * 
 * @param {unknown} err - The error to log.
 * 
 * - Only logs the error if the environment is set to 'development'.
 */
export function logError(err: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }
}
