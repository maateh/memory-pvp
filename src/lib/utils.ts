import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message)
    return error
  } else if (typeof error === "string") {
    console.error(error)
    return new Error(`Error: ${error}`)
  } else {
    console.error(error)
    return new Error(`Unknown error: ${JSON.stringify(error)}`)
  }
}
