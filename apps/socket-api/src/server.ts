import express from "express"
import http from "http"

// types
import type { RoomVariants } from "@repo/schema/room"

// socket
import { Server } from "socket.io"

// prisma
import { PrismaClient } from "@repo/db"

// middlewares
import {
  authenticate,
  connectionLoader,
  roomLoader
} from "./middlewares"

// events
import { disconnect, connectionClear } from "@/events"
import {
  roomReady,
  roomLeave,
  roomClose,
  roomKick,
  sessionCreated,
  sessionStarting
} from "@/events/room"
import { sessionReconnect } from "@/events/session"

const app = express()
const server = http.createServer(app)

export const db = new PrismaClient()
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

io.use(authenticate)
io.use(connectionLoader)
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
  socket.on("room:leave", roomLeave(socket))
  socket.on("room:close", roomClose(socket))
  socket.on("room:ready", roomReady(socket))
  socket.on("room:kick", roomKick(socket))
  socket.on("session:starting", sessionStarting(socket))
  socket.on("session:created", sessionCreated(socket))

  socket.on("session:reconnect", sessionReconnect(socket))

  socket.on("connection:clear", connectionClear(socket))
  socket.on("disconnect", disconnect(socket))
})

const port = process.env.APP_PORT!
server.listen(port, () => {
  console.info('memory/socket server is running on PORT', port)

  // FIXME: bulk remove every `memory:connections` hashes from redis
})
