// utils
import { cn } from "@/lib/utils"

// icons
import { History, Plus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

type NavbarActionsProps = {
  hasActivePlayer: boolean
}

const NavbarActions = ({ hasActivePlayer }: NavbarActionsProps) => {
  return (
    <div className={cn("flex items-center gap-x-5", {
      "flex-1 justify-between": !hasActivePlayer
    })}>
      <Button className={cn("h-fit py-1.5 gap-x-2 bg-accent/30 hidden xl:flex hover:bg-accent/35", {
        "flex": !hasActivePlayer
      })}>
        <Plus className="size-4" strokeWidth={4} />
        New player {/* TODO: open manage player profiles dialog */}
      </Button>

      <Button className={cn("h-fit py-1.5 gap-x-2 hidden 2xl:flex", {
        "lg:flex": !hasActivePlayer
      })}>
        <History className="size-4" strokeWidth={2.5} />
        Game sessions {/* TODO: add previous game sessions modal or page */}
      </Button>
    </div>
  )
}

export default NavbarActions
