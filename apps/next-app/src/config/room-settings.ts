// types
import type { WaitingRoomVariants } from "@repo/schema/room"

type WaitingRoomHeaderMap = Record< WaitingRoomVariants["status"], {
  key:  WaitingRoomVariants["status"]
  title: string
  description: string
}>

export const waitingRoomHeaderMap = {
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
  }
} satisfies WaitingRoomHeaderMap
