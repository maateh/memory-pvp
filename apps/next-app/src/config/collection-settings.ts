// types
import type { TableSize } from "@repo/db"
import type { FileRouterInputKey } from "@uploadthing/shared"
import type { CardCollectionWithCardsWithUser } from "@/lib/types/prisma"
import type { UploadRouter } from "@/server/uploadthing/core"

// config
import { tableSizeMap } from "@/config/game-settings"

/** `uploadthing` endpoints based on table size */
export const collectionSizeEndpointMap: Record<TableSize, keyof UploadRouter> = {
  SMALL: "collectionSmall",
  MEDIUM: "collectionMedium",
  LARGE: "collectionLarge",
}

export const collectionAcceptedMimeTypes: string[] = ["image/jpeg", "image/png", "image/webp"] as Array<FileRouterInputKey>

/** Maximum file size of a card image inside a collection (in bytes) */
export const collectionMaxFileSizeInBytes: number = 128000

/** Maximum file size of a card image inside a collection (in bytes) */
export const collectionMaxFileSize = "128KB" as const

/** Maximum pixel height and widht of a card image inside a collection */
export const collectionMaxFilePixels: number = 256

/** Collection minimum size multiplier (based on `tableSize`) */
export const collectionMinSizeMultiplier: number = 0.5

/** Collection minimum size mapping (based on `tableSize`) */
export const collectionMinSizeMap: Record<TableSize, number> = {
  SMALL: Math.floor(tableSizeMap['SMALL'] * collectionMinSizeMultiplier),
  MEDIUM: Math.floor(tableSizeMap['MEDIUM'] * collectionMinSizeMultiplier),
  LARGE: Math.floor(tableSizeMap['LARGE'] * collectionMinSizeMultiplier)
}

/** Collection maximum size multiplier (based on `tableSize`) */
export const collectionMaxSizeMultiplier: number = 0.75

/** Collection maximum size mapping (based on `tableSize`) */
export const collectionMaxSizeMap: Record<TableSize, number> = {
  SMALL: Math.floor(tableSizeMap['SMALL'] * collectionMaxSizeMultiplier),
  MEDIUM: Math.floor(tableSizeMap['MEDIUM'] * collectionMaxSizeMultiplier),
  LARGE: Math.floor(tableSizeMap['LARGE'] * collectionMaxSizeMultiplier)
}

type GetCollectionImageSettingsReturn = {
  maxFileSize: typeof collectionMaxFileSize
  additionalProperties: { height: number; width: number }
  minFileCount: number
  maxFileCount: number
}

/**
 * Generates and returns image settings for uploading a card collection based on the specified table size.
 * 
 * - Specifies maximum file size and dimensions (`height` and `width`) for uploaded images.
 * - Determines minimum and maximum file counts based on the collection size requirements for the given `tableSize`.
 * 
 * @param {TableSize} tableSize - The size of the card collection, which determines the required image counts.
 * 
 * @returns {GetCollectionImageSettingsReturn} - Object containing the image upload constraints for the specified table size.
*/
export function getCollectionImageSettings(tableSize: TableSize): GetCollectionImageSettingsReturn {
  return {
    maxFileSize: collectionMaxFileSize,
    additionalProperties: {
      height: collectionMaxFilePixels,
      width: collectionMaxFilePixels
    },
    minFileCount: collectionMinSizeMap[tableSize],
    maxFileCount: collectionMaxSizeMap[tableSize]
  }
}

/**
 * Generates a fallback collection that can be used if the original collection has been deleted.
 * 
 * @param {TableSize} tableSize - The size of the card collection, which determines the required image counts.
 * 
 * @returns {CardCollectionWithCardsWithUser} - Object containing the fallback card collection data with fake cards and user.
 */
export function getFallbackCollection(tableSize: TableSize): CardCollectionWithCardsWithUser {
  return {
    tableSize,
    id: "_fake",
    userId: "_fakeUserId",
    user: {
      id: "_fakeUserId",
      clerkId: "_fakeClerkId",
      username: "Admin",
      email: "admin@memory-pvp.com",
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: null
    },
    cards: [],
    name: "Unknown collection",
    description: "Collection has been removed.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
