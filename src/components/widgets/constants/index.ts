// types
import type { WidgetIconMap, WidgetInfo, WidgetKey, WidgetProps } from "@/components/widgets/types"

// icons
import { ChartArea, Gamepad2, History, Images, ImageUp, Swords, UserCircle } from "lucide-react"

export const widgetIconMap: WidgetIconMap = {
  statistics: ChartArea,
  rooms: Swords,
  history: History,
  collectionUpload: ImageUp,
  collectionManage: Images,
  account: UserCircle,
  players: Gamepad2
}

// DASHBOARD
export const playerStatisticsWidgetInfo: WidgetInfo<'statistics'> = {
  widgetKey: "statistics",
  title: "Player Statistics",
  description: "A brief summary about the statistics of your active player profile."
}

export const waitingRoomsWidgetInfo: WidgetInfo<'rooms'> = {
  widgetKey: "rooms",
  title: "Waiting Rooms (WIP)",
  description: "Online multiplayer sessions where other players are currently waiting for their opponents or teammates."
}

export const sessionHistoryWidgetInfo: WidgetInfo<'history'> = {
  widgetKey: "history",
  title: "Session History",
  description: "Browse through your previous game sessions."
}

// COLLECTIONS
export const collectionUploadWidgetInfo: WidgetInfo<'collectionUpload'> = {
  widgetKey: "collectionUpload",
  title: "Upload Collection",
  description: "Upload your own card collection."
}

export const collectionManageWidgetInfo: WidgetInfo<'collectionManage'> = {
  widgetKey: "collectionManage",
  title: "Your Collections",
  description: "Manage your card collections."
}

// PROFILE
export const manageAccountWidgetInfo: WidgetInfo<'account'> = {
  widgetKey: "account",
  title: "Your Account",
  description: "Manage your account with Clerk."
}

export const playerProfilesWidgetInfo: WidgetInfo<'players'> = {
  widgetKey: "players",
  title: "Player Profiles",
  description: "Create different player profiles to play with it. It makes easily possible to use smurf profiles if you want."
}
