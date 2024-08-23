// icons
import { ChartColumn, Gamepad2, LayoutDashboard, Swords, UserCircle, UsersRound } from "lucide-react"

export const navigation = {
  public: [
    {
      label: 'Single',
      href: '/game/single',
      Icon: Gamepad2
    },
    {
      label: 'PvP',
      href: '/game/pvp',
      Icon: Swords
    },
    {
      label: 'Co-Op',
      href: '/game/coop',
      Icon: UsersRound
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
    },
    {
      label: 'Leaderboard',
      href: '/leaderboard',
      Icon: ChartColumn
    }
  ]
}
