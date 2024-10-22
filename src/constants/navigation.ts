// icons
import { ChartColumn, Images, LayoutDashboard, UserCircle } from "lucide-react"

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
      label: 'Collections',
      href: '/collections',
      Icon: Images
    },
    {
      label: 'Profile',
      href: '/profile',
      Icon: UserCircle
    }
  ]
}
