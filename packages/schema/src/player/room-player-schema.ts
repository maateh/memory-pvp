import { z } from "zod"

// schemas
import { clientPlayer, playerConnection } from "@/player"

export const roomPlayerRole = z.enum(["owner", "guest"])

export const roomPlayerSchema = clientPlayer.extend({
  ready: z.coerce.boolean(),
  role: roomPlayerRole,
  connection: playerConnection
})

export type RoomPlayerRole = z.infer<typeof roomPlayerRole>
export type RoomPlayer = z.infer<typeof roomPlayerSchema>
