import z from "zod"

export const playerStats = z.object({
  elo: z.coerce.number(),
  flips: z.coerce.number(),
  matches: z.coerce.number(),
  avgTime: z.coerce.number(),
  totalTime: z.coerce.number(),
  sessions: z.coerce.number()
})

export const sessionCardMetadata = z.object({
  id: z.string(),
  key: z.coerce.number()
})

export const sessionCard = z.object({
  id: z.string(),
  key: z.coerce.number(),
  matchedBy: z.string().nullable()
})

export const sessionStats = z.object({
  timer: z.coerce.number(),
  flips: z.record(z.string(), z.coerce.number()),
  matches: z.record(z.string(), z.coerce.number())
})
