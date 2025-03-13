import { z } from "zod"

/* Sort schemas */
export const sortKey = z.enum(["asc", "desc"])

/* Pagination schemas */
export const paginationParams = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10)
}).partial()

export const paginationWithoutData = z.object({
  totalPage: z.coerce.number(),
  hasNextPage: z.coerce.boolean()
}).extend(paginationParams.required().shape)

export const pagination = <T>(
  dataSchema: z.ZodSchema<T>
) => z.object({
  data: z.array(dataSchema)
}).extend(paginationWithoutData.shape)

/* Sort types */
export type SortKey = z.infer<typeof sortKey>

/* Pagination types */
export type PaginationParams = z.infer<typeof paginationParams>
export type PaginationWithoutData = z.infer<typeof paginationWithoutData>
export type Pagination<T> = z.infer<ReturnType<typeof pagination<T>>>
