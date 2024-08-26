import { Separator } from "@/components/ui/separator"

// components
import { Logo, MobileToggle } from "@/components/shared"

const Navbar = () => {
  return (
    <div className="mx-5 my-3 px-5 py-2 flex justify-between items-center gap-x-6 bg-primary/40 rounded-full">
      <div className="flex items-center gap-x-2">
        <MobileToggle />

        <Separator className="h-8 bg-foreground/40 md:hidden"
          orientation="vertical"
        />

        <Logo className="size-5 ml-1.5"
          withRedirect
        />
      </div>

      <div className="flex gap-x-2">
        <p className="p-1 rounded-full">player1</p>
        <p className="p-1 rounded-full">player2</p>
        <p className="p-1 rounded-full">player3</p>

        <button>+ Add new</button>
      </div>

      <p className="hidden md:block">Logout</p>
    </div>
  )
}

export default Navbar
