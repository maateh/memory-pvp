"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// prisma
import type { PlayerProfile } from "@prisma/client"

// icons
import { BadgeInfo, Save, UserCog2 } from "lucide-react"

// shadcn
import { Button, ButtonTooltip } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"

// components
import { PlayerBadge } from "@/components/player"
import { PlayerProfileForm } from "@/components/form"

// hooks
import { useSaveOfflineSessionMutation } from "@/lib/react-query/mutations/game"

type SaveOfflineGameProps = {
  players: PlayerProfile[]
}

const SaveOfflineGame = ({ players }: SaveOfflineGameProps) => {
  const router = useRouter()
  const [playerTag, setPlayerTag] = useState('')

  const { saveOfflineSession, handleSaveOfflineSession } = useSaveOfflineSessionMutation()

  return (
    <section className="w-11/12 max-w-lg mx-auto sm:max-w-screen-sm">
      <div className="flex items-center justify-center gap-x-2.5 sm:items-end">
        <ButtonTooltip className="p-1.5 text-accent bg-accent/20 dark:bg-accent/10 sm:p-2"
          tooltip="Add new player"
          variant="ghost"
          size="icon"
          onClick={() => router.push('/profile/players', { scroll: false })}
        >
          <UserCog2 className="size-4 sm:size-5" strokeWidth={2.25} />
        </ButtonTooltip>

        <h2 className="text-base align-bottom font-heading font-semibold small-caps heading-decorator sm:text-lg">
          Select Player Profile
        </h2>
      </div>

      <p className="max-w-md mt-1.5 mx-auto text-sm text-center font-light font-heading sm:text-base">
        Please, select a player profile first where you would like to save the results of your offline session.
      </p>

      <Separator className="w-4/5 mx-auto mt-3.5 mb-5 bg-border/40" />

      {players.length === 0 ? (
        <div className="pt-6">
          <PlayerProfileForm />

          <div className="mt-2 flex items-center gap-x-2">
            <BadgeInfo className="size-4 shrink-0 sm:size-5" />
            <p className="text-xs font-extralight sm:text-sm">
              Please, <span className="text-accent font-light">create a player profile</span> first to save your results.
            </p>
          </div>
        </div>
      ) : (
        <ButtonGroup className="px-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3.5"
          defaultValue={playerTag}
          onValueChange={setPlayerTag}
        >
          {players.map((player) => (
            <ButtonGroupItem className="min-w-36 max-w-36 flex-1"
              variant="outline"
              value={player.tag}
              key={player.tag}
            >
              <PlayerBadge className="border-none"
                variant="outline"
                player={player}
                hideVerified
              />
            </ButtonGroupItem>
          ))}
        </ButtonGroup>
      )}

      <Separator className="w-4/5 mx-auto my-5 bg-border/40" />

      <Button className="mx-auto flex gap-x-2"
        variant="secondary"
        size="lg"
        onClick={() => handleSaveOfflineSession(playerTag)}
        disabled={!playerTag || saveOfflineSession.isPending}
      >
        <Save className="size-5 sm:size-6" />
        Save Results
      </Button>
    </section>
  )
}

export default SaveOfflineGame
