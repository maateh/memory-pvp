// trpc
import { api } from "@/trpc/server"

// icons
import { ArrowDown } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { PlayerBadge } from "@/components/player"

const NavbarPlayers = async () => {
  const userWithPlayers = await api.user.getWithPlayerProfiles()

  return (
    <ul className="flex gap-x-2">
      {userWithPlayers?.playerProfiles.map((player) => (
        <li key={player.id}>
          <PlayerBadge player={player} />
        </li>
      ))}

      {(userWithPlayers?.playerProfiles?.length || 0) > 3 && (
        <Button className="h-auto px-2.5 flex items-center gap-x-1.5 font-medium small-caps"
          size="sm"
        >
          <ArrowDown className="size-4 text-accent" />
          <span>Show more</span>
        </Button>
      )}
    </ul>
  )
}

export default NavbarPlayers
