// types
import type { LucideIcon } from "lucide-react"
import type { Widget, WidgetKey } from "@/components/widget/types"

// icons
import { ChartArea, Gamepad2, History, Swords } from "lucide-react"

export const widgetIconMap: Record<WidgetKey, LucideIcon> = {
  statistics: ChartArea,
  rooms: Swords,
  sessions: History,
  players: Gamepad2
}

export const playerStatisticsWidget = {
  key: "statistics",
  title: "Player Statistics",
  description: "A brief summary about the statistics of your active player profile."
} satisfies Widget

export const playersWidget = {
  key: "players",
  title: "Player Profiles",
  description: "Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want.",
  href: "/dashboard/players"
} satisfies Widget

export const waitingRoomsWidget = {
  key: "rooms",
  title: "Waiting Rooms (WIP)",
  description: "Online multiplayer sessions where other players are currently waiting for their opponents or teammates.",
  href: "/dashboard/rooms"
} satisfies Widget

export const sessionsWidget = {
  key: "sessions",
  title: "Session History",
  description: "Browse through your previous game sessions.",
  href: "/dashboard/history" // TODO: change to `/dashboard/sessions` later
} satisfies Widget
