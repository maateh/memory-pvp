import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Tailwind class builder helper function (@shadcn/ui) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
