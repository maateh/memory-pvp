import { z } from "zod"

/* Base schemas */
export const clientUserSchema = z.object({
  username: z.string(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})
