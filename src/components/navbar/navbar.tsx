// server
import { getPlayers } from "@/server/db/player"

// shadcn
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// components
import { Logo } from "@/components/shared"
import NavbarPlayerStats from "./navbar-player-stats"
import NavbarActions from "./navbar-actions"
import NavbarActionsDropdown from "./navbar-actions-dropdown"

const Navbar = async () => {
  const players = await getPlayers()
  const activePlayer = players.find((player) => player.isActive)

  // TODO: redesign this section
  // - show playerbadge only if sidebar is collapsed
  // - update displaying of `SidebarTrigger` and the logo
  // - remove actions
  // - maybe rename `Navbar` to `StatsBar` or `ActionBar` (?)

  return (
    <div className="min-w-max mx-2.5 my-3 px-2.5 py-2.5 flex gap-x-4 justify-between items-center bg-primary/40 rounded-3xl shadow-lg sm:mx-5 sm:px-5">
      <div className="flex items-center gap-x-1 md:flex-row-reverse md:gap-x-3">
        <SidebarTrigger />

        <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
          orientation="vertical"
        />

        <Logo className="hidden size-5 md:block"
          withRedirect
        />
      </div>

      <div className="flex-1 flex items-center justify-between gap-x-4">
        {activePlayer && <NavbarPlayerStats activePlayer={activePlayer} />}

        <NavbarActions hasActivePlayer={!!activePlayer} />
      </div>

      <div className="flex items-center gap-x-2">
        <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
          orientation="vertical"
        />

        <NavbarActionsDropdown players={players} />
      </div>
    </div>
  )
}

export default Navbar
