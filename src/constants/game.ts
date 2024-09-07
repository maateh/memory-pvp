// prisma
import { GameMode, GameType, TableSize } from "@prisma/client"

// icons
import { Dice4, Dice5, Dice6, Gamepad2, Swords, UsersRound } from "lucide-react"

export const gameTypes = [
  {
    key: GameType.CASUAL,
    label: 'Casual',
    query: 'mode=casual',
    Icon: Gamepad2
  },
  {
    key: GameType.COMPETITIVE,
    label: 'Competitive',
    query: 'mode=competitive',
    Icon: Swords
  }
]

export const gameModes = [
  {
    key: GameMode.SINGLE,
    label: 'Single',
    query: 'mode=single',
    Icon: Gamepad2
  },
  {
    key: GameMode.PVP,
    label: 'PvP',
    query: 'mode=pvp',
    Icon: Swords
  },
  {
    key: GameMode.COOP,
    label: 'Co-Op',
    query: 'mode=coop',
    Icon: UsersRound
  }
]

export const tableSizes = [
  {
    key: TableSize.SMALL,
    label: 'Small (4x4)',
    query: 'size=small',
    Icon: Dice4
  },
  {
    key: TableSize.MEDIUM,
    label: 'Small (5x5)',
    query: 'size=medium',
    Icon: Dice5
  },
  {
    key: TableSize.LARGE,
    label: 'Small (6x6)',
    query: 'size=large',
    Icon: Dice6
  }
]
