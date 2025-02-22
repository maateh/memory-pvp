// types
import type { RoomVariants } from "@repo/schema/room"

type RoomHeaderMap = Record<RoomVariants["status"], {
  key:  RoomVariants["status"]
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
  starting: {
    key: "starting",
    title: "Game is ready to start!",
    description: "Initializing game session..."
  },
  running: {
    key: "running",
    title: "Session is already running.",
    description: "Please reconnect."
  },
  finished: {
    key: "finished",
    title: "Session is finished.",
    description: "The game has already ended in this room."
  }
} satisfies RoomHeaderMap
