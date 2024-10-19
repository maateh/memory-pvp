"use client"

import { useRouter } from "next/navigation"

// prisma
import type { User } from "@prisma/client"

// icons
import { UserCheck2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { SelectPlayerDropdown } from "@/components/inputs"
import { SignInButton, Warning } from "@/components/shared"
import { PlayerWithAvatar } from "@/components/player"

// hooks
import { useSelectAsActiveMutation } from "@/lib/react-query/mutations/player"

type SelectActivePlayerProps = {
  user: User | null
  players: ClientPlayer[]
}

// TODO: refactor this component
// move everything into a whole new component -> `active-player` (ssr)
// leave only `SelectPlayerDropdown` here
const SelectActivePlayer = ({ user, players }: SelectActivePlayerProps) => {
  const router = useRouter()

  const activePlayer = players.find((player) => player.isActive)

  const { selectAsActive, handleSelectAsActive } = useSelectAsActiveMutation()

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
          <UserCheck2 className="size-4" strokeWidth={2.5} />
          Create player
        </Button>
      ) : (
        <div className="pt-1.5 flex items-center gap-x-2">
          <PlayerWithAvatar className="mx-auto"
            player={activePlayer}
            imageSize={28}
          />

          <SelectPlayerDropdown
            players={players}
            handleSelectPlayer={handleSelectAsActive}
            isPending={selectAsActive.isPending}
          >
            <Button className="p-1.5 border border-border/20"
              variant="ghost"
              size="icon"
            >
              <UserCheck2 className="size-4 sm:size-5 text-muted-foreground"
                strokeWidth={1.5}
              />
            </Button>
          </SelectPlayerDropdown>
        </div>
      )}
    </div>
  )
}

export default SelectActivePlayer
