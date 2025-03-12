import { z } from "zod"

// config
import {
  collectionAcceptedMimeTypes,
  collectionMaxFileSize,
  collectionMaxFileSizeInBytes
} from "@/config/collection-settings"

export const collectionCardImage = z.custom<File>()
  .refine((file: File) => file.size <= collectionMaxFileSizeInBytes, {
    message: `Maximum image size is ${collectionMaxFileSize}`
  })
  .refine((file: File) => collectionAcceptedMimeTypes.includes(file.type), {
    message: "Uploaded image file format is not supported."
  })

export type CollectionCardImage = z.infer<typeof collectionCardImage>
