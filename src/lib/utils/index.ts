import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import { toast } from "sonner"

// types
import type { UploadThingError } from "uploadthing/server"
import type { ActionError } from "@/server/actions/_error"
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

type ParseFilterParamsReturn<T extends { [key in keyof T]: string | number | boolean }> = {
  filter: Filter<T>
  sort: Sort<T>
}

/**
 * Parses URL search parameters into separate filter and sort objects based on specified keys.
 * 
 * - Collects keys from `URLSearchParams` and differentiates them as either filter or sort parameters.
 * - Sort parameters are indicated by "asc" or "desc" keys, where each value is categorized as ascending or descending.
 * - All other keys are treated as filter parameters, with each key-value pair added to the `filter` object.
 * - Returns an object with `filter` and `sort` properties, representing parsed filtering and sorting instructions.
 * 
 * @template T - The shape of the parameter object, where each key's value must be of type `string`, `number`, or `boolean`.
 * @param {URLSearchParams} params - The search parameters to parse.
 * @returns {ParseFilterParamsReturn<T>} - An object with `filter` and `sort` properties for filtered and sorted results.
 */
export function parseFilterParams<T extends { [key in keyof T]: string | number | boolean }>(
  params: URLSearchParams
): ParseFilterParamsReturn<T> {
  const keys = Array.from(params.keys())

  const filter = keys.filter((key) => key !== 'asc' && key !== 'desc')
  .reduce((filter, key) => {
    let value: string | boolean | null = params.get(key)

    /** Parses `true` and `false` string values to boolean */
    if (value === 'true' || value === 'false') {
      value = value === 'true'
    }

    return {
      ...filter,
      [key]: value
    }
  }, {} as Filter<T>)
  
  const sortAscValue = params.get('asc')
  const sortDescValue = params.get('desc')

  params.delete('asc')
  params.delete('desc')

  let sort: Sort<T> = {}

  if (sortAscValue) {
    sort = { [sortAscValue]: 'asc' } as Sort<T>
  } else if (sortDescValue) {
    sort = { [sortDescValue]: 'desc' } as Sort<T>
  }

  return {
    filter,
    sort
  }
}

/**
 * Converts a `sort` object into a single-field `orderBy` object for Prisma queries.
 *
 * This function returns the first defined sorting field in `{ field: direction }` format,
 * or `undefined` if no sorting fields are provided.
 * 
 * @param sort - An object with sorting options, where each key is a field name 
 *               and the value is "asc" or "desc".
 * @returns An object with one sorting field for Prisma's `orderBy`, or `undefined`.
 */
export function parseSortToOrderBy<T extends { [K in keyof T]: SortKey }>(
  sort: Partial<T>
): Partial<T> | undefined {
  const entries = Object.entries(sort)

  if (entries.length === 0) return undefined

  const [valueKey, sortKey] = entries[0]
  return { [valueKey]: sortKey } as Partial<T>
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

export function handleActionError(
  error: ActionError | undefined,
  fallbackDescription?: string
) {
  if (error?.name === 'ActionError') {
    toast.error(error.message, { description: error.description })
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
  if (process.env.NODE_ENV === 'development') {
    console.error(err)
  }
}
