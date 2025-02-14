import { z } from "zod"

export const playerConnectionStatus = z.enum(["online", "offline"])

export const basePlayerConnection = z.object({
  playerId: z.string(),
  playerTag: z.string(),
  roomSlug: z.string(),
  createdAt: z.coerce.date()
})

export const onlinePlayerConnection = basePlayerConnection.extend({
  status: z.literal(playerConnectionStatus.enum.online),
  socketId: z.string(),
  connectedAt: z.coerce.date()
})

export const offlinePlayerConnection = basePlayerConnection.extend({
  status: z.literal(playerConnectionStatus.enum.offline),
  socketId: z.null(),
  connectedAt: z.null()
})

export const playerConnection = onlinePlayerConnection.or(offlinePlayerConnection)

export type PlayerConnectionStatus = z.infer<typeof playerConnectionStatus>
export type OnlinePlayerConnection = z.infer<typeof onlinePlayerConnection>
export type OfflinePlayerConnection = z.infer<typeof offlinePlayerConnection>
export type PlayerConnection = z.infer<typeof playerConnection>
