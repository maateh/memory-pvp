import { z } from "zod"

// schemas
import { clientSessionCard } from "@/session"

export const sessionCardFlipValidation = z.object({
  clickedCard: clientSessionCard
})

export type SessionCardFlipValidation = z.infer<typeof sessionCardFlipValidation>
