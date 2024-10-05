"use client"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import SessionPlayer, { SessionPlayerSkeleton } from "./session-player"

type SessionFooterProps = {
  session: ClientGameSession
}

const SessionFooter = ({ session }: SessionFooterProps) => {
  return (
    <div className="w-full min-h-16 mx-auto py-3 px-3 flex flex-col items-center justify-center gap-x-4 bg-primary md:px-6 md:flex-row md:rounded-t-3xl md:max-w-screen-md lg:max-w-[896px]">
      <SessionPlayer
        player={session.players.current}
        session={session}
      />

      {session.mode !== 'SINGLE' && session.players.other && (
        <>
          <Separator className="flex w-4/5 h-1 mx-auto my-4 bg-secondary-foreground/80 rounded-full md:hidden"
            orientation="vertical"
          />

          <Separator className="hidden w-1.5 h-14 bg-secondary-foreground/80 rounded-full md:flex"
            orientation="vertical"
          />

          <SessionPlayer
            player={session.players.other}
            session={session}
            flipOrder
          />
        </>
      )}
    </div>
  )
}

export default SessionFooter
