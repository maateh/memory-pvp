import { z } from "zod"

export const playerProfileFormSchema = z.object({
  playerTag: z.string(),
  color: z.string()
})
