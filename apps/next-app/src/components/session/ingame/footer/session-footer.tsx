// types
import type { ClientGameSession } from "@repo/schema/session"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import SessionPlayer from "./session-player"

type SessionFooterProps = {
  session: ClientGameSession
}

const SessionFooter = ({ session }: SessionFooterProps) => {
  const currentPlayer = session.players.current
  const otherPlayer = session.players.other

  return (
    <footer className="w-full min-h-16 mx-auto py-3 px-3 flex flex-col items-center justify-center gap-x-4 bg-primary md:px-6 md:flex-row md:rounded-t-3xl md:max-w-screen-md lg:max-w-[896px]">
      <SessionPlayer
        session={session}
        player={currentPlayer}
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
            session={session}
            player={otherPlayer}
            flipOrder
          />
        </>
      )}
    </footer>
  )
}

export default SessionFooter
