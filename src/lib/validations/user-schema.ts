import { z } from "zod"

export const userCreateSchema = z.object({
  clerkId: z.string(),
  username: z.string(),
  email: z.string().email(),
  imageUrl: z.string().url()
})

export const userUpdateSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  imageUrl: z.string().url()
})

export const userDeleteSchema = z.object({
  clerkId: z.string()
})
