// prisma
import type { GameMode, GameType, TableSize } from "@prisma/client"

// icons
import { Dice4, Dice5, Dice6, Gamepad2, Sword, Swords, UserRound, UsersRound, type LucideIcon } from "lucide-react"

type GamePlaceholderMap<K extends GameType | GameMode | TableSize, O extends Object = {}> = Record<K, {
  key: K
  label: string
  Icon: LucideIcon
} & O>

export const gameTypePlaceholders: GamePlaceholderMap<GameType> = {
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
} as const

export const gameModePlaceholders: GamePlaceholderMap<GameMode> = {
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

/**
 * Note: These image placeholders is used only for testing purposes.
 * In the future, there will be an option for users to upload
 * their custom image sets for memory card placeholders.
 */
export const baseCardUrl = "https://picsum.photos/id"
