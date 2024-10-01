// prisma
import { PlayerProfile } from "@prisma/client"

// icons
import { ChevronRightCircle, Gamepad2, Sparkles, Timer } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"

// components
import { PlayerBadge } from "@/components/player"

type NavbarPlayerInfoProps = {
  activePlayer: PlayerProfile
}

const NavbarPlayerInfo = ({ activePlayer }: NavbarPlayerInfoProps) => {
  return (
    <div className="h-full flex items-center gap-x-2">
      <PlayerBadge player={activePlayer} />

      <div className="hidden items-center gap-x-2 lg:flex">
        <ChevronRightCircle className="flex-none size-[1.1rem] text-foreground/80" />

        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <Badge className="py-1 gap-x-1.5 font-normal tracking-wide">
            <Sparkles className="size-4 flex-none" />
            {/* TODO: GET -> Total score */}
            <span>50</span> points
          </Badge>
          
          <Badge className="py-1 gap-x-1.5 font-normal tracking-wide">
            <Timer className="size-4 flex-none" />
            {/* TODO: GET -> Total playtime */}
            <span>1h 30sec</span>
          </Badge>

          <Badge className="py-1 gap-x-1.5 font-normal tracking-wide">
            <Gamepad2 className="size-4 flex-none" />
            {/* TODO: GET -> Amount of played sessions */}
            <span>69 sessions</span>
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default NavbarPlayerInfo
