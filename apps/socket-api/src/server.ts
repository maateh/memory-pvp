import express from "express"
import http from "http"

// socket
import { Server } from "socket.io"

// events
import {
  disconnect,
  roomCreate,
  roomJoin,
  roomReady,
  roomLeave,
  roomClose,
  sessionCreated,
  sessionUpdate,
  sessionReconnect,
  sessionStarting
} from "@/events"

const app = express()
const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

io.on("connection", (socket) => {
  console.info("Connection: ", socket.id)

  socket.on("room:create", roomCreate(socket))
  socket.on("room:join", roomJoin(socket))
  socket.on("room:ready", roomReady(socket))
  socket.on("room:leave", roomLeave(socket))
  socket.on("room:close", roomClose(socket))

  socket.on("session:starting", sessionStarting(socket))
  socket.on("session:created", sessionCreated(socket))
  socket.on("session:update", sessionUpdate(socket))
  socket.on("session:reconnect", sessionReconnect(socket))

  socket.on("disconnect", disconnect(socket))
})

const port = process.env.APP_PORT!
server.listen(port, () => {
  console.info('memory/socket server is running on PORT', port)
})
