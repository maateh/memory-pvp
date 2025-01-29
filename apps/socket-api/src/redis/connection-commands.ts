// redis
import { redis } from "@/redis"

// config
import { connectionKey, playerConnectionKey } from "@repo/config/redis-keys"

// utils
import { SocketError } from "@repo/types/socket-api-error"

export async function getSocketConnection(socketId: string) {
  const connection = await redis.hgetall<SocketPlayerConnection>(connectionKey(socketId))
  if (connection) return connection

  // TODO: force close session
  SocketError.throw({
    key: "SOCKET_CONNECTION_NOT_FOUND",
    message: "Socket connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}

export async function getSocketConnectionByField<F extends SocketPlayerConnection[keyof SocketPlayerConnection]>(
  socketId: string,
  field: keyof SocketPlayerConnection
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
  const connection = await redis.hgetall<SocketPlayerConnection>(playerConnectionKey(playerId))
  if (connection) return connection

  // TODO: force close session
  SocketError.throw({
    key: "PLAYER_CONNECTION_NOT_FOUND",
    message: "Player connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}

export async function getPlayerConnectionByField<F extends SocketPlayerConnection[keyof SocketPlayerConnection]>(
  playerId: string,
  field: keyof SocketPlayerConnection
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
