import { z } from "zod"

// schemas
import { clientPlayerSchema } from "./player-schema"
import { playerConnection } from "./player-connection-schema"

export const roomPlayerSchema = clientPlayerSchema.extend({ // TODO: must be replaced by db schema
  ready: z.coerce.boolean(),
  connection: playerConnection
})

export type RoomPlayer = z.infer<typeof roomPlayerSchema>
