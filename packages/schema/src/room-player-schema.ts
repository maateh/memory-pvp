import { z } from "zod"

// schemas
import { clientPlayer } from "@/player-schema"
import { playerConnection } from "@/player-connection-schema"

export const roomPlayerRole = z.enum(["owner", "guest"])

export const roomPlayerSchema = clientPlayer.extend({
  ready: z.coerce.boolean(),
  role: roomPlayerRole,
  connection: playerConnection
})

export type RoomPlayerRole = z.infer<typeof roomPlayerRole>
export type RoomPlayer = z.infer<typeof roomPlayerSchema>
