// redis
import { redis } from "@repo/redis"

type RoomCreateData = {
  owner: ClientPlayer
  settings: SessionFormValues
}

type SocketPlayerConnection = ClientPlayer & {
  socketId: string
  roomSlug: string
  createdAt: Date
}

type WaitingRoom = {
  slug: string
  status: "waiting"
  owner: ClientPlayer & { socketId: string }
  settings: SessionFormValues
  createdAt: Date
}

export const roomCreate: SocketEventHandler<
  RoomCreateData,
  WaitingRoom
> = (socket) => async (data, response) => {
  console.info("DEBUG - room:create -> ", socket.id)
  const { owner, settings } = data
  // TODO: validate settings with zod (schema needs to be exported)

  const room: WaitingRoom = {
    slug: "TODO: generate session slug",
    status: "waiting",
    owner: { ...owner, socketId: socket.id },
    settings,
    createdAt: new Date()
  }

  const connection: SocketPlayerConnection = {
    ...owner,
    socketId: socket.id,
    roomSlug: room.slug,
    createdAt: room.createdAt
  }

  try {
    await Promise.all([
      redis.hset(`memory:connections:${socket.id}`, connection),
      redis.hset(`memory:session_rooms:${room.slug}`, room)
    ])

    socket.join(room.owner.socketId)
    response({
      success: true,
      message: "Waiting for another user to join...",
      data: room
    })
  } catch (err) {
    console.error(err)
  }
}
