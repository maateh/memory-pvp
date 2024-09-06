// prisma
import { GameMode, TableSize } from "@prisma/client"

// icons
import { ChartColumn, Dice4, Dice5, Dice6, Gamepad2, LayoutDashboard, Swords, UserCircle, UsersRound } from "lucide-react"

export const gamemodes = [
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

export const routes = {
  public: [
    {
      label: 'Leaderboard',
      href: '/leaderboard',
      Icon: ChartColumn
    }
  ],
  protected: [
    {
      label: 'Dashboard',
      href: '/dashboard',
      Icon: LayoutDashboard
    },
    {
      label: 'Profile',
      href: '/profile',
      Icon: UserCircle
    }
  ]
}
