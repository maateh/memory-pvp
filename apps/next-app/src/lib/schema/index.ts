import { z } from "zod"

export const sortKeys = z.enum(['asc', 'desc']).optional()
