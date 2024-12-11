import { z } from "zod"
import { TableSize } from "@prisma/client"

// schemas
import { sortKeys } from "@/lib/schema"

/* Query filters */
export const collectionFilterSchema = z.object({
  username: z.string(),
  name: z.string(),
  tableSize: z.nativeEnum(TableSize),
  excludeUser: z.coerce.boolean().optional()
}).partial()

export const collectionSortSchema = z.object({
  name: sortKeys,
  tableSize: sortKeys,
  createdAt: sortKeys,
  updatedAt: sortKeys
}).partial()
