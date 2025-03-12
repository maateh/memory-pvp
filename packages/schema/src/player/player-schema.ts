import { z } from "zod"

// schemas
import { playerStats } from "@repo/db/json-schema"

export const playerTag = z.string()
  .min(4, { message: "Too short." })
  .max(16, { message: "Too long." })

export const playerColor = z.string()
  .length(7, { message: "Color must be a valid HEX color. e.g. #f1f1f1" })
  .regex(/^#/, { message: "Color must be a valid HEX color. e.g. #f1f1f1" })

export const clientPlayer = z.object({
  id: z.string(),
  tag: playerTag,
  color: playerColor,
  isActive: z.coerce.boolean(),
  imageUrl: z.string().nullable().optional(),
  stats: playerStats,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export type PlayerTag = z.infer<typeof playerTag>
export type PlayerColor = z.infer<typeof playerColor>
export type ClientPlayer = z.infer<typeof clientPlayer>
