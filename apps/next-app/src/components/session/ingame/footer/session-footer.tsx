"use client"

import { useMemo } from "react"

// helpers
import { calculatePlayerSessionScore, getFreeFlips } from "@/lib/helper/session-helper"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import SessionPlayer from "./session-player"

// hooks
import { useSingleSessionStore } from "@/components/provider/single-session-store-provider"

const SessionFooter = () => {
  const session = useSingleSessionStore((state) => state.session)

  const currentPlayer = session.players.current
  const otherPlayer = session.players.other
  const freeFlips = useMemo(() => getFreeFlips(session), [session])

  return (
    <footer className="w-full min-h-16 mx-auto py-3 px-3 flex flex-col items-center justify-center gap-x-4 bg-primary md:px-6 md:flex-row md:rounded-t-3xl md:max-w-screen-md lg:max-w-[896px]">
      <SessionPlayer
        player={currentPlayer}
        freeFlips={freeFlips}
        flips={session.stats.flips[currentPlayer.id]}
        score={calculatePlayerSessionScore(session, currentPlayer.id)}
      />

      {session.mode !== 'SINGLE' && otherPlayer && (
        <>
          <Separator className="flex w-4/5 h-1 mx-auto my-4 bg-secondary-foreground/80 rounded-full md:hidden"
            orientation="vertical"
          />

          <Separator className="hidden w-1.5 h-14 bg-secondary-foreground/80 rounded-full md:flex"
            orientation="vertical"
          />

          <SessionPlayer
            player={otherPlayer}
            freeFlips={freeFlips}
            flips={session.stats.flips[otherPlayer.id]}
            score={calculatePlayerSessionScore(session, otherPlayer.id)}
            flipOrder
          />
        </>
      )}
    </footer>
  )
}

export default SessionFooter
