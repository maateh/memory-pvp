// types
import type { Prisma } from "@repo/db"

export const resultSchemaFields = {
  player: true,
  session: {
    select: {
      slug: true,
      mode: true,
      format: true,
      tableSize: true,
      stats: true,
      startedAt: true
    }
  }
} satisfies Prisma.ResultInclude
