// types
import type { TableSize } from "@prisma/client"

// constants
import {
  collectionMaxFilePixels,
  collectionMaxFileSize,
  collectionMaxSizeMap,
  collectionMinSizeMap
} from "@/constants/collection"

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
