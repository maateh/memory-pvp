// icons
import { ChartColumn, Gamepad2, LayoutDashboard, Swords, UserCircle, UsersRound } from "lucide-react"

export const gamemodes = [
  {
    label: 'Single',
    href: '/game/setup?mode=single',
    Icon: Gamepad2
  },
  {
    label: 'PvP',
    href: '/game/setup?mode=pvp',
    Icon: Swords
  },
  {
    label: 'Co-Op',
    href: '/game/setup?mode=coop',
    Icon: UsersRound
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
