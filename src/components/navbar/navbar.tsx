// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { Logo, MobileToggle } from "@/components/shared"
import { NavbarActions, NavbarDropdownActions, NavbarPlayerInfo } from "@/components/navbar"

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
        <NavbarActions />

        <Separator className="h-5 w-1 bg-primary-foreground/15 rounded-sm"
          orientation="vertical"
        />

        <NavbarDropdownActions />
      </div>
    </div>
  )
}

export default Navbar
