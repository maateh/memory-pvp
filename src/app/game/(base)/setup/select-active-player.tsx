"use client"

import { useRouter } from "next/navigation"

// prisma
import type { User } from "@prisma/client"

// icons
import { UserPlus2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { SignInButton, Warning } from "@/components/shared"
import { PlayerWithAvatar, SelectActivePlayerDropdown } from "@/components/player"

type SelectActivePlayerProps = {
  user: User | null
  players: ClientPlayer[]
}

const SelectActivePlayer = ({ user, players }: SelectActivePlayerProps) => {
  const router = useRouter()

  const activePlayer = players.find((player) => player.isActive)

  return (
    <div className="w-fit mx-auto text-center space-y-2.5">
      {!user ? (
        <>
          <Warning className="text-destructive/90"
            message="You are not signed in yet."
          />

          <SignInButton className="h-8 bg-destructive/75"
            variant="destructive"
          />
        </>
      ) : !activePlayer ? (
        <Button className="h-fit py-1.5 gap-x-2 bg-accent/30 hidden xl:flex hover:bg-accent/35"
          onClick={() => router.push('/profile/players', { scroll: false })}
        >
          <UserPlus2 className="size-4" strokeWidth={2.5} />
          Create player
        </Button>
      ) : (
        <div className="flex items-center gap-x-2">
          <PlayerWithAvatar className="mt-2 mx-auto"
            player={activePlayer}
            imageSize={28}
          />

          <SelectActivePlayerDropdown className="mt-2 mx-auto"
            players={players}
          />
        </div>
      )}
    </div>
  )
}

export default SelectActivePlayer
