import { z } from "zod"

// schemas
import { clientPlayerSchema } from "./player-schema"
import { playerConnection } from "./player-connection-schema"

export const roomPlayerRole = z.enum(["owner", "guest"])

export const roomPlayerSchema = clientPlayerSchema.extend({
  ready: z.coerce.boolean(),
  role: roomPlayerRole,
  connection: playerConnection
})

export type RoomPlayerRole = z.infer<typeof roomPlayerRole>
export type RoomPlayer = z.infer<typeof roomPlayerSchema>
