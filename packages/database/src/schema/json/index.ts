import z from "zod"

export const playerStats = z.object({
  score: z.number(),
  timer: z.number(),
  flips: z.number(),
  matches: z.number(),
  sessions: z.number()
})

export const sessionCardMetadata = z.object({
  id: z.string(),
  key: z.number()
})

export const sessionCard = z.object({
  id: z.string(),
  key: z.number(),
  matchedBy: z.string().nullable(),
})

export const sessionStats = z.object({
  timer: z.number(),
  flips: z.record(z.string(), z.number()),
  matches: z.record(z.string(), z.number())
})
