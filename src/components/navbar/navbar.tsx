// trpc
import { api } from "@/trpc/server"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Logo, MobileToggle } from "@/components/shared"
import { NavbarActions, NavbarDropdownActions, NavbarPlayerInfo } from "@/components/navbar"

const Navbar = async () => {
  const user = await api.user.getWithPlayerProfiles()

  const activePlayer = user?.playerProfiles.find((player) => player.isActive)

  return (
    <div className="min-w-max mx-2.5 my-3 px-2.5 py-2.5 flex gap-x-4 justify-between items-center bg-primary/40 rounded-3xl shadow-lg sm:mx-5 sm:px-5">
      <div className="flex items-center gap-x-1 md:flex-row-reverse md:gap-x-3">
        <MobileToggle />

        <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
          orientation="vertical"
        />

        <Logo className="hidden size-5 md:block"
          withRedirect
        />
      </div>

      <div className="flex-1 flex items-center justify-between gap-x-4">
        {activePlayer && <NavbarPlayerInfo activePlayer={activePlayer} />}

        <NavbarActions hasActivePlayer={!!activePlayer} />
      </div>

      <div className="flex items-center gap-x-2">
        <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
          orientation="vertical"
        />

        <NavbarDropdownActions players={user?.playerProfiles || []} />
      </div>
    </div>
  )
}

export default Navbar
