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
  connectedAt: new Date(),
  disconnectedAt: null
})

export const offlinePlayer = (
  opts: PlayerConnectionOpts
): OfflinePlayerConnection => ({
  ...opts,
  status: "offline",
  disconnectedAt: new Date(),
  socketId: null,
  connectedAt: null
})
