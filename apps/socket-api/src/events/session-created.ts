// types
import type { SessionCreatedValidation } from "@repo/schema/session-room-validation"

// schemas
import { sessionCreatedValidation } from "@repo/schema/session-room-validation"

// redis
import { getRoomByField } from "@repo/server/redis-commands"

// socket
import { io } from "@/server"

// utils
import { SocketError } from "@repo/types/socket-api-error"
import { validate } from "@/utils/validate"

export const sessionCreated: SocketEventHandler<
  SessionCreatedValidation
> = (socket) => async (input) => {
  console.log("session:created ->", socket.id)

  try {
    const { roomSlug } = validate(sessionCreatedValidation, input)
    const {
      type,
      mode,
      tableSize
    } = await getRoomByField(roomSlug, "settings")

    io.to(roomSlug).emit("session:started", {
      message: "The game session has started!",
      // TODO: formatting helpers would be cool here
      // (which are currently only used on the client-side)
      description: `${type} | ${mode} | ${tableSize}`,
      data: roomSlug
    } satisfies SocketResponse<string>)
  } catch (err) {
    io.to(input.roomSlug).emit("session:started", {
      message: "Failed to start game session.",
      error: SocketError.parser(err)
    } satisfies SocketResponse)
  }
}
