import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import { toast } from "sonner"

// types
import type { UploadThingError } from "uploadthing/server"
import type { ActionError } from "@/server/actions/_error"
import type { TRPCApiError } from "@/trpc/error"

/** Tailwind class builder helper function (@shadcn/ui) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
