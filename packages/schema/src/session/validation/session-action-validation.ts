import { z } from "zod"

// schemas
import { roomSettings } from "@/room"
import {
  sessionSettings,
  offlineSessionStorage,
  sessionStateUpdater,
  clientSessionCard
} from "@/session"

export const createSoloSessionValidation = z.object({
  settings: sessionSettings
    .omit({ format: true })
    .extend({ format: z.literal(sessionSettings.shape.format.enum.SOLO) }),
  forceStart: z.boolean().optional()
})

export const createMultiplayerSessionValidation = z.object({
  settings: roomSettings,
  slug: z.string(),
  guestId: z.string()
})

export const storeSoloSessionValidation = sessionStateUpdater
  .omit({ currentTurn: true })

export const finishSoloSessionValidation = sessionStateUpdater
  .omit({ currentTurn: true, cards: true, flipped: true })
  .extend({
    cards: z.array(clientSessionCard.extend({
      matchedBy: z.string()
    }))
  })

export const forceCloseSoloSessionValidation = sessionStateUpdater
  .omit({ currentTurn: true, flipped: true })

export const saveOfflineSessionValidation = z.object({
  playerId: z.string(),
  clientSession: offlineSessionStorage
    .omit({ cards: true, updatedAt: true })
    .extend({
      cards: z.array(clientSessionCard.extend({
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
