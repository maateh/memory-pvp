"use client"

import Link from "next/link"
import { useState } from "react"

// types
import type { ClientPlayer } from "@/lib/schema/player-schema"

// helpers
import { validateCardMatches } from "@/lib/helper/session-helper"

// utils
import { getSessionFromStorage } from "@/lib/util/storage"
import { logError } from "@/lib/util/error"

// icons
import { BadgeInfo, Save, UserCog2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import { Separator } from "@/components/ui/separator"

// components
import { PlayerBadge } from "@/components/player"
import { PlayerProfileForm } from "@/components/player/form"

// hooks
import { useSaveOfflineSessionAction } from "@/lib/safe-action/session"

type SaveOfflineSessionProps = {
  players: ClientPlayer[]
}

const SaveOfflineSession = ({ players }: SaveOfflineSessionProps) => {
  const [playerId, setPlayerId] = useState('')

  const {
    executeAsync: executeSaveOfflineSession,
    status: saveOfflineSessionStatus
  } = useSaveOfflineSessionAction()

  const handleExecute = async () => {
    const offlineSession = getSessionFromStorage()
    if (!offlineSession) return

    try {
      await executeSaveOfflineSession({
        ...offlineSession,
        playerId,
        cards: validateCardMatches(offlineSession.cards)
      })
    } catch (err) {
      logError(err)
    }
  }

  return (
    <section className="w-11/12 max-w-lg mx-auto sm:max-w-screen-sm">
      <div className="flex items-center justify-center gap-x-2.5 sm:items-end">
        <Button className="p-1.5 sm:p-2"
          tooltip="Add new player"
          variant="outline"
          size="icon"
          asChild
        >
          <Link href="/players/select" scroll={false}>
            <UserCog2 className="size-4 sm:size-5" strokeWidth={2.25} />
          </Link>
        </Button>

        <h2 className="text-base align-bottom font-heading font-semibold small-caps heading-decorator sm:text-lg">
          Select Player Profile
        </h2>
      </div>

      <p className="max-w-md mt-1.5 mx-auto text-sm text-center font-heading dark:font-light sm:text-base">
        Please, select a player profile first to save the results of your offline session.
      </p>

      <Separator className="w-1/5 mx-auto mt-3.5 mb-5 bg-border/15" />

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
          defaultValue={playerId}
          onValueChange={setPlayerId}
        >
          {players.map((player) => (
            <ButtonGroupItem className="min-w-36 max-w-36 flex-1"
              variant="outline"
              value={player.id}
              key={player.id}
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

      <Separator className="w-1/5 mx-auto my-5 bg-border/15" />

      <Button className="mx-auto flex gap-x-2"
        variant="secondary"
        size="lg"
        onClick={handleExecute}
        disabled={saveOfflineSessionStatus === 'executing'}
      >
        <Save className="size-5 sm:size-6" />
        Save Results
      </Button>
    </section>
  )
}

export default SaveOfflineSession
