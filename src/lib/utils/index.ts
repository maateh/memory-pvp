import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { toast } from "sonner"
import { TRPCApiError } from "@/trpc/error"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  err: TRPCApiError | undefined,
  fallbackDescription?: string
) {
  if (err?.name === 'TRPCApiError') {
    toast.error(err.message, {
      description: err.description
    })
    return
  }

  toast.error('Something went wrong.', { description: fallbackDescription })
}
