// types
import type { PlayerConnection, SocketConnection } from "@repo/types/socket-api"

// redis
import { redis } from "../redis"
import { connectionKey, playerConnectionKey } from "../keys"

// utils
import { ServerError } from "../../error/error"

export async function getSocketConnection(socketId: string) {
  const connection = await redis.hgetall<SocketConnection>(connectionKey(socketId))
  if (connection) return connection

  ServerError.throw({
    type: "REDIS",
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

  ServerError.throw({
    type: "REDIS",
    key: "SOCKET_CONNECTION_NOT_FOUND",
    message: "Socket connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}

export async function getPlayerConnection(playerId: string) {
  const connection = await redis.hgetall<PlayerConnection>(playerConnectionKey(playerId))
  if (connection) return connection

  ServerError.throw({
    type: "REDIS",
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

  ServerError.throw({
    type: "REDIS",
    key: "PLAYER_CONNECTION_NOT_FOUND",
    message: "Player connection data not found.",
    description: "Something went wrong because your connection data has been lost. Your current session will be closed without point losses."
  })
}
