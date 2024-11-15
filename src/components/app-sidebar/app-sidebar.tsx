import Link from "next/link"

// server
import { getPlayers } from "@/server/db/player"

// icons
import { Spade } from "lucide-react"

// shadcn
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar"

// components
import { SignedIn } from "@clerk/nextjs"
import { NavLinkGroups } from "./nav-link-group"
import PlayerSwitcher from "./player-switcher"
import NavGame from "./nav-game"
import NavUser from "./nav-user"
import NavTheme from "./nav-theme"

const AppSidebar = async ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const players = await getPlayers(true)
  const activePlayer = players.find((player) => player.isActive)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton className="flex items-center justify-center gap-x-3 [&>svg]:size-5"
          size="lg"
          tooltip="memory/pvp"
          asChild
        >
          <Link className="cursor-pointer" href="/">
            <Spade strokeWidth={2.75} />
            <p className="text-xl font-heading font-medium tracking-wide group-data-[collapsible=icon]:hidden">
              memory/pvp
            </p>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SignedIn>
          <PlayerSwitcher
            players={players}
            activePlayer={activePlayer}
          />
        </SignedIn>

        <SidebarSeparator className="w-1/6 h-1 mx-auto -my-1.5 bg-sidebar-border/30 rounded-full group-data-[collapsible=icon]:my-0" />

        <NavGame />

        <SidebarSeparator />

        <NavLinkGroups />
      </SidebarContent>

      <SidebarSeparator className="mb-2 mt-auto" />

      <SidebarFooter className="flex flex-row items-center justify-between group-data-[collapsible=icon]:flex-col">
        <NavUser />
        <NavTheme />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar
