import { z } from "zod"

// schemas
import { clientPlayer, playerConnection } from "@/player"

export const roomPlayerRole = z.enum(["owner", "guest"])

export const roomPlayer = clientPlayer.extend({
  ready: z.boolean(),
  role: roomPlayerRole,
  connection: playerConnection
})

export type RoomPlayerRole = z.infer<typeof roomPlayerRole>
export type RoomPlayer = z.infer<typeof roomPlayer>
