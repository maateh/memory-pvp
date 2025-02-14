// types
import type {
  OfflinePlayerConnection,
  OnlinePlayerConnection,
  PlayerConnectionOpts
} from "@repo/schema/player-connection"

export const onlinePlayer = (
  opts: PlayerConnectionOpts,
  socketId: string
): OnlinePlayerConnection => ({
  ...opts,
  status: "online",
  socketId,
  connectedAt: new Date()
})

export const offlinePlayer = (
  opts: PlayerConnectionOpts
): OfflinePlayerConnection => ({
  ...opts,
  status: "offline",
  socketId: null,
  connectedAt: null
})
