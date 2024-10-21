// types
import type { WidgetInfo } from "@/components/widgets/types"

// icons
import { ChartArea, Gamepad2, History, Swords, UserCircle } from "lucide-react"

// DASHBOARD
export const playerStatisticsWidgetInfo: WidgetInfo = {
  title: "Player Statistics",
  description: "A brief summary about the statistics of your active player profile.",
  icon: <ChartArea />
}

export const waitingRoomsWidgetInfo: WidgetInfo = {
  title: "Waiting Rooms (WIP)",
  description: "Online multiplayer sessions where other players are currently waiting for their opponents or teammates.",
  icon: <Swords />
}

export const sessionHistoryWidgetInfo: WidgetInfo = {
  title: "Session History",
  description: "Browse through your previous game sessions.",
  icon: <History />
}

// PROFILE
export const manageAccountWidgetInfo: WidgetInfo = {
  title: "Your Account",
  description: "Manage your account with Clerk.",
  icon: <UserCircle />
}

export const playerProfilesWidgetInfo: WidgetInfo = {
  title: "Player Profiles",
  description: "Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want.",
  icon: <Gamepad2 />
}
