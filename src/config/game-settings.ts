// prisma
import type { GameMode, GameType, TableSize } from "@prisma/client"
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
  UsersRound
} from "lucide-react"

type GamePlaceholderMap<K extends GameType | GameMode | TableSize, O extends Object = {}> = Record<K, {
  key: K
  label: string
  Icon: LucideIcon
} & O>

export const gameTypePlaceholders = {
  CASUAL: {
    key: "CASUAL",
    label: "Casual",
    Icon: Gamepad2
  },
  COMPETITIVE: {
    key: "COMPETITIVE",
    label: "Competitive",
    Icon: Sword
  }
} satisfies GamePlaceholderMap<GameType>

export const gameModePlaceholders = {
  SINGLE: {
    key: "SINGLE",
    label: "Single",
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
} satisfies GamePlaceholderMap<GameMode>

export const tableSizePlaceholders = {
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
} satisfies GamePlaceholderMap<TableSize, { size: string }>

export const tableSizeMap = {
  SMALL: 16,
  MEDIUM: 24,
  LARGE: 32
} satisfies Record<TableSize, number>

/**
 * Multiplier to calculate the amount of the "free flips"
 * in 'Competitive - Single or Co-Op' sessions.
 */
export const freeFlipsMultiplier = 0.75
