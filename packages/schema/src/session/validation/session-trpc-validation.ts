import { z } from "zod"

// schemas
import { sessionFilter } from "@/session"

export const sessionCountValidation = z.object({
  filter: sessionFilter
})

export type SessionCountValidation = z.infer<typeof sessionCountValidation>
