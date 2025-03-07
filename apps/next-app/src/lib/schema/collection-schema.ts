import { z } from "zod"

// prisma
import { TableSize } from "@repo/db"

// config
import {
  collectionAcceptedMimeTypes,
  collectionMaxFileSize,
  collectionMaxFileSizeInBytes
} from "@/config/collection-settings"

// schemas
import { clientUserSchema } from "@/lib/schema/user-schema"

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

/* Client base schemas */
export const clientMemoryCardSchema = z.object({
  id: z.string(),
  imageUrl: z.string()
})

export const clientCollectionSchema = z.object({
  id: z.string(),
  name: collectionNameSchema,
  description: collectionDescriptionSchema,
  tableSize: z.nativeEnum(TableSize),
  user: clientUserSchema,
  cards: z.array(clientMemoryCardSchema),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type CollectionName = z.infer<typeof collectionNameSchema>
export type CollectionDescription = z.infer<typeof collectionDescriptionSchema>
export type CollectionCardImage = z.infer<typeof collectionCardImageSchema>
export type ClientMemoryCard = z.infer<typeof clientMemoryCardSchema>
export type ClientCardCollection = z.infer<typeof clientCollectionSchema>
