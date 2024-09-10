"use client"

import { useState } from "react"

// prisma
import { PlayerProfile } from "@prisma/client"

// shadcn
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"

// components
import { PlayerBadge } from "@/components/player"

// hooks
import { useSaveOfflineSessionMutation } from "@/lib/react-query/mutations/game"

type SelectPlayerProfileProps = {
  players: PlayerProfile[]
}

const SelectPlayerProfile = ({ players }: SelectPlayerProfileProps) => {
  const [playerTag, setPlayerTag] = useState('')

  const { saveOfflineSession, handleSaveOfflineSession } = useSaveOfflineSessionMutation()

  return (
    <div className="flex flex-col gap-y-10">
      <ButtonGroup className="px-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3.5"
        defaultValue={playerTag}
        onValueChange={setPlayerTag}
      >
        {players.map((player) => (
          <ButtonGroupItem className="min-w-36 flex-1"
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

      <Button
        variant="secondary"
        size="lg"
        onClick={() => handleSaveOfflineSession(playerTag)}
        disabled={saveOfflineSession.isPending}
      >
        Save Results
      </Button>
    </div>
  )
}

export default SelectPlayerProfile
