// types
import type { NavGroup } from "@/components/app-sidebar/types"

// icons
import { ChartColumn, Gamepad2, History, ImagePlus, Images, LayoutDashboard, Swords } from "lucide-react"

export const navigation = [
  {
    label: "Links",
    isProtected: true,
    links: [
      {
        title: "Dashboard",
        url: "/dashboard",
        Icon: LayoutDashboard,
        sublinks: [
          {
            title: "Player profiles",
            url: "/dashboard/players",
            Icon: Gamepad2
          },
          {
            title: "Waiting rooms",
            url: "/dashboard/rooms",
            Icon: Swords
          },
          {
            title: "Session history",
            url: "/dashboard/sessions",
            Icon: History
          }
        ]
      },
      {
        title: "Collections",
        url: "/collections",
        Icon: Images,
        sublinks: [
          {
            title: "Manage",
            url: "/collections/manage",
            Icon: ImagePlus
          }
        ]
      }
    ]
  },
  {
    label: "Stats",
    isProtected: false,
    links: [
      {
        title: 'Leaderboard',
        url: '/leaderboard',
        Icon: ChartColumn
      }
    ]
  }
] satisfies NavGroup[]
