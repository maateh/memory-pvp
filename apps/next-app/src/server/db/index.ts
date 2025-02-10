// prisma
import { PrismaClient } from "@repo/server/db"
import "@repo/server/db-types"

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}
