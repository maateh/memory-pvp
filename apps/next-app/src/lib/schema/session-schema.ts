import { z } from "zod"

// schemas
import { clientSessionSchema } from "@repo/schema/session"

/* Client base schemas */
export const unsignedClientSessionSchema = clientSessionSchema.omit({
  slug: true,
  type: true,
  mode: true,
  status: true,
  closedAt: true
})

export type UnsignedClientGameSession = z.infer<typeof unsignedClientSessionSchema>

/* Shared re-exports */
export * from "@repo/schema/session"
export type * from "@repo/schema/session"
