import express from "express"
import http from "http"

import { Server } from "socket.io"
import { Redis } from "@upstash/redis"

const app = express()
const server = http.createServer(app)
const redis = Redis.fromEnv()

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

io.on("connection", (socket) => {
  console.info("Connection: ", socket.id)

  socket.on("room:create", async ({ owner, settings }: {
    owner: ClientPlayer
    settings: SessionFormValues
  }, response) => {
    console.info("room:create -> ")
    const room: WaitingRoom = {
      id: socket.id,
      owner,
      settings
    }

    const status = await redis.set<WaitingRoom>(`waiting_room:${room.id}`, room)
    socket.join(room.id)

    response({
      status: status === "OK" ? "success" : "error",
      message: "Waiting for another user to join...",
      room
    })
  })

  socket.on("room:join", ({ roomId, guest }: {
    roomId: string
    guest: ClientPlayer
  }) => {
    console.info("room:join -> ")
    socket.join(roomId)

    // TODO: create session by sending back the guest user to the owner client
    // TODO: needs to be checked that only the owner user was in the room so the session will be created once
    socket.broadcast.to(roomId).emit("room:joined", {
      message: `${guest.username} has connected to the room. Game will start soon...`,
      guest
    })
  })

  socket.on("session:created", async ({ roomId, session }: {
    session: ClientGameSession
    roomId: string
  }) => {
    console.info("session:created -> ")
    await redis.del(`waiting_room:${roomId}`)

    io.to(roomId).emit("session:start", {
      message: "Session has been created. Let's start the game...",
      session
    })
  })

  socket.on("session:update", ({ roomId, session }: {
    roomId: string
    session: ClientGameSession
  }) => {
    console.info("session:update -> ")
    socket.broadcast.to(roomId).emit("session:updated", { session })
  })

  socket.on("disconnect", async () => {
    await redis.del(`waiting_room:${socket.id}`)

    // TODO: close game session

    io.to(socket.id).emit("room:left", {
      message: "USER has disconnected."
    })
  })
})

const port = process.env.APP_PORT!
server.listen(port, () => {
  console.info('memory/socket server is running on PORT', port)
})
