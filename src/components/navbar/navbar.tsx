// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Logo, MobileToggle } from "@/components/shared"
import { NavbarActions, NavbarPlayers } from "@/components/navbar"

const Navbar = async () => {

  return (
    <div className="mx-5 my-3 px-5 py-2.5 flex gap-x-6 justify-between items-center bg-primary/40 rounded-full shadow-lg">
      <div className="flex items-center gap-x-1.5 md:gap-x-2.5">
        <div className="flex items-center gap-x-1 md:flex-row-reverse md:gap-x-4">
          <MobileToggle />

          <Separator className="h-3.5 w-2 bg-primary-foreground/15 rounded-sm"
            orientation="vertical"
          />

          <Logo className="hidden size-5 md:block"
            withRedirect
          />
        </div>

        <NavbarPlayers />
      </div>

      <div className="flex items-center gap-x-2">
        <Separator className="h-5 w-1 rounded-md"
          orientation="vertical"
        />
        
        <NavbarActions />
      </div>
    </div>
  )
}

export default Navbar
