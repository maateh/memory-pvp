import { z } from "zod"

// schemas
import { sessionCard } from "@repo/db/json-schema"
import { roomSettings } from "@/room"
import {
  clientSession,
  sessionSettings,
  offlineSessionStorage,
  soloClientSession
} from "@/session"

export const createSoloSessionValidation = z.object({
  settings: sessionSettings
    .omit({ format: true })
    .extend({ format: z.literal(sessionSettings.shape.format.enum.SOLO) }),
  forceStart: z.coerce.boolean().optional()
})

export const createMultiplayerSessionValidation = z.object({
  settings: roomSettings,
  slug: z.string(),
  guestId: z.string()
})

export const storeSoloSessionValidation = z.object({
  clientSession: soloClientSession
})

export const finishSoloSessionValidation = z.object({
  clientSession: clientSession
    .omit({ status: true, cards: true })
    .extend({
      cards: z.array(sessionCard.extend({
        matchedBy: z.string()
      }))
    })
})

export const forceCloseSoloSessionValidation = z.object({
  clientSession: clientSession
    .omit({ status: true })
})

export const saveOfflineSessionValidation = z.object({
  playerId: z.string(),
  clientSession: offlineSessionStorage
    .omit({ cards: true, updatedAt: true })
    .extend({
      cards: z.array(sessionCard.extend({
        matchedBy: z.string()
      }))
    })
})

export type CreateSoloSessionValidation = z.infer<typeof createSoloSessionValidation>
export type CreateMultiplayerSessionValidation = z.infer<typeof createMultiplayerSessionValidation>
export type StoreSoloSessionValidation = z.infer<typeof storeSoloSessionValidation>
export type FinishSoloSessionValidation = z.infer<typeof finishSoloSessionValidation>
export type ForceCloseSoloSessionValidation = z.infer<typeof forceCloseSoloSessionValidation>
export type SaveOfflineSessionValidation = z.infer<typeof saveOfflineSessionValidation>
