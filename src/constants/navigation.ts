// types
import type { NavGroup } from "@/components/app-sidebar/types"

// icons
import { BookImage, ChartColumn, ImagePlus, Images, LayoutDashboard } from "lucide-react"

export const navigation: NavGroup[] = [
  {
    label: "Links",
    isProtected: true,
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
]
