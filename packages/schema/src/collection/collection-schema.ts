import { z } from "zod"

// schemas
import { TableSizeSchema } from "@repo/db/zod"
import { clientUser } from "@/user"

export const collectionName = z.string()
  .min(4, { message: "Collection name is too short." })
  .max(28, { message: "Collection name is too long." })

export const collectionDescription = z.string()
  .min(8, { message: "Collection description is too short." })
  .max(128, { message: "Collection description is too long." })

export const clientMemoryCard = z.object({
  id: z.string(),
  imageUrl: z.string()
})

export const clientCardCollection = z.object({
  id: z.string(),
  name: collectionName,
  description: collectionDescription,
  tableSize: TableSizeSchema,
  user: clientUser,
  cards: z.array(clientMemoryCard),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type CollectionName = z.infer<typeof collectionName>
export type CollectionDescription = z.infer<typeof collectionDescription>
export type ClientMemoryCard = z.infer<typeof clientMemoryCard>
export type ClientCardCollection = z.infer<typeof clientCardCollection>
