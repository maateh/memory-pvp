// redis
import { redis } from "@repo/redis"

type RoomCreateData = {
  owner: ClientPlayer
  settings: SessionFormValues
}

export const roomCreate: SocketEventHandler<
  RoomCreateData,
  SessionRoom
> = (socket) => async (data, response) => {
  const { owner, settings } = data

  console.info("room:create -> ")

  // TODO: create proper `SessionRoom`
  const room: SessionRoom = {
    id: socket.id,
    status: "starting",
    owner,
    guest: owner,
    session: {
      ...settings,
      slug: ""
    }
  }

  try {
    // TODO: setup redis data structure properly

    await redis.set<SessionRoom>(`waiting_room:${room.id}`, room)
    socket.join(room.id)
  
    response({
      success: true,
      message: "Waiting for another user to join...",
      data: room
    })
  } catch (err) {
    console.error(err)
  }
}
