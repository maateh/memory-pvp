// types
import type { PlayerConnection, SocketConnection } from "@repo/types/socket-api"

// redis
import { redis } from "@/redis"

// config
import { connectionKey, playerConnectionKey } from "@repo/config/redis-keys"

// utils
import { SocketError } from "@repo/types/socket-api-error"

export async function getSocketConnection(socketId: string) {
  const connection = await redis.hgetall<SocketConnection>(connectionKey(socketId))
  if (connection) return connection

  // TODO: force close session
  SocketError.throw({
    key: "SOCKET_CONNECTION_NOT_FOUND",
    message: "Socket connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}

export async function getSocketConnectionByField<F extends SocketConnection[keyof SocketConnection]>(
  socketId: string,
  field: keyof SocketConnection
) {
  const fieldValue = await redis.hget<F>(connectionKey(socketId), field)
  if (fieldValue) return fieldValue

  // TODO: force close session
  SocketError.throw({
    key: "SOCKET_CONNECTION_NOT_FOUND",
    message: "Socket connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}

export async function getPlayerConnection(playerId: string) {
  const connection = await redis.hgetall<PlayerConnection>(playerConnectionKey(playerId))
  if (connection) return connection

  // TODO: force close session
  SocketError.throw({
    key: "PLAYER_CONNECTION_NOT_FOUND",
    message: "Player connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}

export async function getPlayerConnectionByField<F extends PlayerConnection[keyof PlayerConnection]>(
  playerId: string,
  field: keyof PlayerConnection
) {
  const fieldValue = await redis.hget<F>(playerConnectionKey(playerId), field)
  if (fieldValue) return fieldValue

  // TODO: force close session
  SocketError.throw({
    key: "PLAYER_CONNECTION_NOT_FOUND",
    message: "Player connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}
