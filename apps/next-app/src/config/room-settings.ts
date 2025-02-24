// types
import type { RoomVariants } from "@repo/schema/room"

type RoomHeaderMap = Record<RoomVariants["status"], {
  key: RoomVariants["status"]
  title: string
  description: string
}>

export const roomHeaderMap = {
  waiting: {
    key: "waiting",
    title: "Waiting for another player to join...",
    description: "...or share the invite code with your friends."
  },
  joined: {
    key: "joined",
    title: "Waiting for players to be ready...",
    description: "If you want to start the game, change your status to ready and wait for the other player."
  },
  ready: {
    key: "ready",
    title: "Game is ready to start!",
    description: "Initializing game session..."
  },
  running: {
    key: "running",
    title: "Game started!",
    description: "Redirecting..."
  },
  cancelled: {
    key: "cancelled",
    title: "Game session has been cancelled.",
    description: "Please reconnect and wait for the other player."
  },
  finished: {
    key: "finished",
    title: "Game is over in this session.",
    description: "You can check the results in the summary."
  }
} satisfies RoomHeaderMap
