// icons
import { History, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { Logo, MobileToggle } from "@/components/shared"
import { NavbarActions, NavbarPlayerInfo } from "@/components/navbar"

const Navbar = () => {
  return (
    <div className="mx-5 my-3 px-5 py-2.5 flex gap-x-4 justify-between items-center bg-primary/40 rounded-full shadow-lg">
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-1 md:flex-row-reverse md:gap-x-3">
          <MobileToggle />

          <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
            orientation="vertical"
          />

          <Logo className="hidden size-5 md:block"
            withRedirect
          />
        </div>

        <NavbarPlayerInfo />
      </div>

      <div className="flex items-center gap-x-1.5">
        {/* TODO: sync with navbar actions */}
        <div className="hidden mr-3 items-center gap-x-5 xl:flex">
          <Button className="h-fit py-1.5 gap-x-2">
            <History className="size-4" strokeWidth={2.5} />
            Game sessions {/* TODO: add previous game sessions modal or page */}
          </Button>

          <Button className="h-fit py-1.5 gap-x-2 bg-accent/30 hover:bg-accent/35">
            <Plus className="size-4" strokeWidth={4} />
            Create new player {/* TODO: open manage player profiles dialog */}
          </Button>
        </div>

        <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
          orientation="vertical"
        />

        <NavbarActions />
      </div>
    </div>
  )
}

export default Navbar
