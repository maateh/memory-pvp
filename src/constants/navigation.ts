// types
import type { NavGroup } from "@/components/app-sidebar/types"

// icons
import { BookImage, ChartColumn, ImagePlus, Images, LayoutDashboard, UserRoundCog } from "lucide-react"

export const navigation: NavGroup[] = [
  {
    label: "Links",
    links: [
      {
        title: "Dashboard",
        url: "/dashboard",
        Icon: LayoutDashboard
      },
      {
        title: "Collections",
        url: "/collections",
        Icon: BookImage,
        sublinks: [
          {
            title: "Explorer",
            url: "/collections",
            Icon: Images
          },
          {
            title: "Manage",
            url: "/collections/manage",
            Icon: ImagePlus
          }
        ]
      },
      // TODO: merge `Player Profiles` into `Dashboard`
      // TODO: create a custom layout for clerk
      {
        title: "Profile",
        url: "/profile",
        Icon: UserRoundCog
      }
    ]
  },
  {
    label: "Stats",
    links: [
      {
        title: 'Leaderboard',
        url: '/leaderboard',
        Icon: ChartColumn
      }
    ]
  }
]
