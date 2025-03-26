import express from "express"
import http from "http"

// types
import type { RoomVariants } from "@repo/schema/room"

// socket
import { Server } from "socket.io"

// server
import { disconnectPrisma } from "@repo/server/db"

// middlewares
import {
  authenticate,
  connectionLoader,
  roomAccess,
  roomLoader
} from "@/middlewares"

// events
import { disconnect, connectionClear } from "@/events"
import {
  roomReady,
  roomKick,
  roomLeave,
  roomCloseWaiting,
  roomCloseCancelled,
  sessionCreated,
  sessionStartingFailed
} from "@/events/room"
import { sessionCardFlip } from "@/events/session"

const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

io.use(authenticate)
io.use(connectionLoader)
io.use(roomAccess)
io.use(roomLoader)

io.on("connection", (_socket) => {
  const socket = _socket as SocketWithContext
  const { playerTag, roomSlug } = socket.ctx.connection

  console.info("Connection: ", socket.id)

  socket.join(roomSlug)
  io.to(roomSlug).emit("room:connected", {
    message: `${playerTag} has connected.`,
    data: socket.ctx.room
  } satisfies SocketResponse<RoomVariants>)

  /**
   * NOTE: "room:join" event might be necessary in the future because
   * if the action fails after the redis commands have already run
   * the room status can "stuck" without the owner even being notifed.
   */
  socket.on("room:ready", roomReady(socket))
  socket.on("room:kick", roomKick(socket))
  socket.on("session:starting:failed", sessionStartingFailed(socket))
  socket.on("session:created", sessionCreated(socket))

  socket.on("room:leave", roomLeave(socket))
  socket.on("room:close:waiting", roomCloseWaiting(socket))
  socket.on("room:close:cancelled", roomCloseCancelled(socket))

  socket.on("session:card:flip", sessionCardFlip(socket))

  socket.on("connection:clear", connectionClear(socket))
  socket.on("disconnect", disconnect(socket))
})

const port = process.env.APP_PORT!
server.listen(port, () => {
  console.info('memory/socket server is running on PORT', port)

  // FIXME: bulk remove every `memory:connections` hashes from redis
})

process.on("SIGINT", async () => {
  console.info("Shutting down...")
  await disconnectPrisma()
  server.close(() => process.exit(0))
})

process.on("SIGTERM", async () => {
  console.info("Shutting down...")
  await disconnectPrisma()
  server.close(() => process.exit(0))
})
