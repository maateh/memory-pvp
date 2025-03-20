// prisma
import type { SessionMode, MatchFormat, TableSize } from "@repo/db"
import type { LucideIcon } from "lucide-react"

// icons
import {
  Dice4,
  Dice5,
  Dice6,
  Gamepad2,
  Sword,
  Swords,
  UserRound,
  UsersRound,
  WifiOff
} from "lucide-react"

type GamePlaceholderMap<K extends SessionMode | MatchFormat | TableSize, O extends Object = {}> = Record<K, {
  key: K
  label: string
  Icon: LucideIcon
} & O>

export const sessionModePlaceholders: GamePlaceholderMap<SessionMode> = {
  CASUAL: {
    key: "CASUAL",
    label: "Casual",
    Icon: Gamepad2
  },
  RANKED: {
    key: "RANKED",
    label: "Ranked",
    Icon: Sword
  }
} as const

export const matchFormatPlaceholders: GamePlaceholderMap<MatchFormat> = {
  OFFLINE: {
    key: "OFFLINE",
    label: "Offline",
    Icon: WifiOff
  },
  SOLO: {
    key: "SOLO",
    label: "Solo",
    Icon: UserRound
  },
  PVP: {
    key: "PVP",
    label: "PvP",
    Icon: Swords
  },
  COOP: {
    key: "COOP",
    label: "Co-Op",
    Icon: UsersRound
  }
} as const

export const tableSizePlaceholders: GamePlaceholderMap<TableSize, { size: string }> = {
  SMALL: {
    key: "SMALL",
    label: "Small",
    size: "16 cards",
    Icon: Dice4
  },
  MEDIUM: {
    key: "MEDIUM",
    label: "Medium",
    size: "24 cards",
    Icon: Dice5
  },
  LARGE: {
    key: "LARGE",
    label: "Large",
    size: "36 cards",
    Icon: Dice6
  }
} as const

export const tableSizeMap: Record<TableSize, number> = {
  SMALL: 16,
  MEDIUM: 24,
  LARGE: 32
} as const
