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

/**
 * Generates URLs for a list of files using `FileReader` to create data URLs.
 * 
 * - Reads each file as a Base64-encoded data URL.
 * - Returns a Promise that resolves with an array of URLs for each file.
 * - Rejects if a file's URL cannot be generated.
 * 
 * @param {File[]} files - An array of File objects to generate URLs for.
 * 
 * @returns {Promise<string[]>} - A Promise that resolves to an array of data URLs representing the provided files.
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
