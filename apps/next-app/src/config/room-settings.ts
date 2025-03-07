// types
import type { LucideIcon } from "lucide-react"
import type { RoomVariants } from "@repo/schema/room"

// icons
import { MonitorCheck, MonitorPlay, Swords, UserRoundCheck, UserRoundSearch, X } from "lucide-react"

type RoomHeaderMap = Record<RoomVariants["status"], {
  key: RoomVariants["status"]
  Icon: LucideIcon
  title: string
  description: string
}>

export const roomHeaderMap = {
  waiting: {
    key: "waiting",
    Icon: UserRoundSearch,
    title: "Waiting for another player to join...",
    description: "...or share the invite code with your friends."
  },
  joined: {
    key: "joined",
    Icon: UserRoundCheck,
    title: "Waiting for players to be ready...",
    description: "If you want to start the game, change your status to ready and wait for the other player."
  },
  ready: {
    key: "ready",
    Icon: Swords,
    title: "Game is ready to start!",
    description: "Initializing game session..."
  },
  running: {
    key: "running",
    Icon: MonitorPlay,
    title: "Game started!",
    description: "Redirecting..."
  },
  cancelled: {
    key: "cancelled",
    Icon: X,
    title: "Game session has been cancelled.",
    description: "Please reconnect and wait for the other player."
  },
  finished: {
    key: "finished",
    Icon: MonitorCheck,
    title: "Game is over in this session.",
    description: "You can check the results in the summary."
  }
} satisfies RoomHeaderMap
