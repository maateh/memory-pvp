// types
import type { TableSize } from "@prisma/client"

// constants
import {
  collectionMaxFilePixels,
  collectionMaxFileSize,
  collectionMaxSizeMap,
  collectionMinSizeMap
} from "@/constants/collection"

/**
 * TODO: write doc
 * 
 * @param fileCount 
 * @returns 
 */
export function getCollectionImageSettings(tableSize: TableSize) {
  return {
    maxFileSize: collectionMaxFileSize,
    additionalProperties: {
      height: collectionMaxFilePixels,
      width: collectionMaxFilePixels
    },
    minFileCount: collectionMinSizeMap[tableSize],
    maxFileCount: collectionMaxSizeMap[tableSize]
  } as const
}
