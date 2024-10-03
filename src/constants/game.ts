// prisma
import type { GameMode, GameType, TableSize } from "@prisma/client"

// icons
import { Dice4, Dice5, Dice6, Gamepad2, Swords, UsersRound, type LucideIcon } from "lucide-react"

type GamePlaceholderMap<K extends GameType | GameMode | TableSize> = Record<K, {
  key: K
  label: string
  Icon: LucideIcon
}>

export const gameTypePlaceholders: GamePlaceholderMap<GameType> = {
  CASUAL: {
    key: "CASUAL",
    label: "Casual",
    Icon: Gamepad2
  },
  COMPETITIVE: {
    key: "COMPETITIVE",
    label: "Competitive",
    Icon: Swords
  }
} as const

export const gameModePlaceholders: GamePlaceholderMap<GameMode> = {
  SINGLE: {
    key: "SINGLE",
    label: "Single",
    Icon: Gamepad2
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

export const tableSizePlaceholders: GamePlaceholderMap<TableSize> = {
  SMALL: {
    key: "SMALL",
    label: "Small (16 cards)",
    Icon: Dice4
  },
  MEDIUM: {
    key: "MEDIUM",
    label: "Medium (24 cards)",
    Icon: Dice5
  },
  LARGE: {
    key: "LARGE",
    label: "Large (36 cards)",
    Icon: Dice6
  }
} as const

export const tableSizeMap: Record<TableSize, number> = {
  SMALL: 16,
  MEDIUM: 24,
  LARGE: 32
} as const

export const offlineSessionMetadata: Pick<ClientGameSession, 'type' | 'mode' | 'status'> = {
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
} as const

/**
 * Note: These image placeholders is used only for testing purposes.
 * In the future, there will be an option for users to upload
 * their custom image sets for memory card placeholders.
 */
export const baseCardUrl = "https://picsum.photos/id"
