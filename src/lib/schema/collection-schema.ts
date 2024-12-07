import { z } from "zod"

// config
import {
  collectionAcceptedMimeTypes,
  collectionMaxFileSize,
  collectionMaxFileSizeInBytes
} from "@/config/collection-settings"

/* Base schemas */
export const collectionNameSchema = z.string()
  .min(4, { message: 'Collection name is too short.' })
  .max(28, { message: 'Collection name is too long.' })

export const collectionDescriptionSchema = z.string()
  .min(8, { message: 'Collection description is too short.' })
  .max(128, { message: 'Collection description is too long.' })

export const collectionCardImageSchema = z.custom<File>()
  .refine((file: File) => file.size <= collectionMaxFileSizeInBytes, {
    message: `Maximum image size is ${collectionMaxFileSize}`
  })
  .refine((file: File) => collectionAcceptedMimeTypes.includes(file.type), {
    message: "Uploaded image file format is not supported."
  })
