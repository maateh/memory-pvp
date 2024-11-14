import Link from "next/link"

// utils
import { cn } from "@/lib/utils"

// icons
import { UserPlus2 } from "lucide-react"

// shadcn
import { buttonVariants } from "@/components/ui/button"

// components
import { UserAvatar, UserManageButton } from "@/components/user"
import { PlayerBadge } from "@/components/player"
import SelectActivePlayer from "./select-active-player"

type ActivePlayerProps = {
  user: ClientUser | null
  players: ClientPlayer[]
}

const ActivePlayer = ({ user, players }: ActivePlayerProps) => {
  const activePlayer = players.find((player) => player.isActive)

  if (!user) {
    return (
      <UserManageButton className="mx-auto"
        showSignInIfLoggedOut
      />
    )
  }

  if (!activePlayer) {
    return (
      <Link className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-fit mx-auto py-1.5 gap-x-2 border border-border/25 font-normal dark:font-light tracking-wide"
      )}
        href="/profile/players"
        scroll={false}
      >
        <UserPlus2 className="size-4" />
        <span>Create player</span>
      </Link>
    )
  }

  return (
    <div className="w-fit mx-auto pt-1.5 flex items-center gap-x-2">
      <UserAvatar user={user} />

      <PlayerBadge player={activePlayer} />

      <SelectActivePlayer players={players} />
    </div>
  )
}

export default ActivePlayer
