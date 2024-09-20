import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { TRPCApiError } from "@/trpc/error"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
