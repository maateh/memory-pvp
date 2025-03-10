import { z } from "zod"

// schemas
import { sessionCard } from "@repo/db/json-schema"
import {
  baseClientSession,
  sessionSettings,
  offlineClientSession
} from "@/session-schema"
import { roomSettings } from "@/room-schema"
import { createRoomValidation } from "@/validation/room-validation"

export const createSoloSessionValidation = z.object({
  settings: sessionSettings
    .omit({ format: true })
    .extend({ format: z.literal(sessionSettings.shape.format.enum.SOLO) }),
  forceStart: z.coerce.boolean().optional()
})

export const sessionFormValidation = z.object({
  settings: createSoloSessionValidation.shape.settings
    .or(createRoomValidation.shape.settings),
  forceStart: z.coerce.boolean().optional()
})

export const createMultiplayerSessionValidation = z.object({
  settings: roomSettings,
  slug: z.string(),
  guestId: z.string()
})

export const finishSoloSessionValidation = z.object({
  clientSession: baseClientSession
    .omit({ status: true, cards: true })
    .extend({
      cards: z.array(sessionCard.extend({
        matchedBy: z.string()
      }))
    })
})

export const abandonSoloSessionValidation = z.object({
  clientSession: baseClientSession
    .omit({ status: true })
    .optional()
})

export const saveOfflineSessionValidation = z.object({
  playerId: z.string(),
  clientSession: offlineClientSession
    .omit({ cards: true })
    .extend({
      cards: z.array(sessionCard.extend({
        matchedBy: z.string()
      }))
    })
})

export type CreateSoloSessionValidation = z.infer<typeof createSoloSessionValidation>
export type SessionFormValidation = z.infer<typeof sessionFormValidation>
export type CreateMultiplayerSessionValidation = z.infer<typeof createMultiplayerSessionValidation>
export type FinishSoloSessionValidation = z.infer<typeof finishSoloSessionValidation>
export type AbandonSoloSessionValidation = z.infer<typeof abandonSoloSessionValidation>
export type SaveOfflineSessionValidation = z.infer<typeof saveOfflineSessionValidation>
