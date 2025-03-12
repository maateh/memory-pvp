import type { z } from "zod"

// schemas
import { offlineClientSession } from "@/session"

// TODO: move directly to the next application (?)
export const offlineSessionStorage = offlineClientSession
  .omit({
    slug: true,
    status: true,
    mode: true,
    format: true,
    owner: true,
    currentTurn: true,
    closedAt: true
  })

export const offlineSessionMetadata = offlineClientSession
  .pick({
    slug: true,
    status: true,
    mode: true,
    format: true,
    owner: true,
    currentTurn: true
  })

export type OfflineSessionStorage = z.infer<typeof offlineSessionStorage>
export type OfflineSessionMetadata = z.infer<typeof offlineSessionMetadata>
