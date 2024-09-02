// icons
import { History, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

const NavbarActions = () => {
  return (
    <div className="hidden mr-3 items-center gap-x-5 xl:flex">
      <Button className="h-fit py-1.5 gap-x-2 hidden 2xl:flex">
        <History className="size-4" strokeWidth={2.5} />
        Game sessions {/* TODO: add previous game sessions modal or page */}
      </Button>

      <Button className="h-fit py-1.5 gap-x-2 bg-accent/30 hover:bg-accent/35 hidden xl:flex">
        <Plus className="size-4" strokeWidth={4} />
        Create new player {/* TODO: open manage player profiles dialog */}
      </Button>
    </div>
  )
}

export default NavbarActions
