// prisma
import { PrismaClient } from "@repo/db"
import "@repo/db/json-types"

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db
}

export const disconnectPrisma = async () => {
  await db.$disconnect()
}
