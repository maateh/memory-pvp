// types
import type { TableSize } from "@prisma/client"
import type { FileRouterInputKey } from "@uploadthing/shared"
import type { UploadRouter } from "@/server/uploadthing/core"

// constants
import { tableSizeMap } from "@/constants/game"

/** Schema parser keys */
export const clientCardCollectionKeys: (keyof ClientCardCollection)[] = [
  'id', 'name', 'description', 'tableSize', 'cards',
  'user', 'createdAt', 'updatedAt'
] as const

export const clientMemoryCardKeys: (keyof ClientMemoryCard)[] = [
  'id', 'imageUrl'
]

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
