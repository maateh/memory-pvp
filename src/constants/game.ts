// prisma
import { GameMode, GameType, TableSize } from "@prisma/client"

// icons
import { Dice4, Dice5, Dice6, Gamepad2, Swords, UsersRound } from "lucide-react"

export const gameTypes = [
  {
    key: GameType.CASUAL,
    label: 'Casual',
    Icon: Gamepad2
  },
  {
    key: GameType.COMPETITIVE,
    label: 'Competitive',
    Icon: Swords
  }
]

export const gameModes = [
  {
    key: GameMode.SINGLE,
    label: 'Single',
    Icon: Gamepad2
  },
  {
    key: GameMode.PVP,
    label: 'PvP',
    Icon: Swords
  },
  {
    key: GameMode.COOP,
    label: 'Co-Op',
    Icon: UsersRound
  }
]

export const tableSizes = [
  {
    key: TableSize.SMALL,
    label: 'Small (4x4)',
    Icon: Dice4
  },
  {
    key: TableSize.MEDIUM,
    label: 'Small (5x5)',
    Icon: Dice5
  },
  {
    key: TableSize.LARGE,
    label: 'Small (6x6)',
    Icon: Dice6
  }
]

export const tableSizeMap = {
  [TableSize.SMALL]: 16,
  [TableSize.MEDIUM]: 24,
  [TableSize.LARGE]: 32
}

export const offlineSessionMetadata: Omit<ClientGameSession, keyof UnsignedClientGameSession> = {
  type: 'CASUAL',
  mode: 'SINGLE',
  status: 'OFFLINE'
}
