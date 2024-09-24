"use client"

// trpc
import { api } from "@/trpc/client"

// utils
import { cn } from "@/lib/utils"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionPlayer } from "@/components/session"

type SessionFooterProps = {
  session: ClientGameSession
}

const SessionFooter = ({ session }: SessionFooterProps) => {
  const { data: players, isLoading } = api.session.getPlayers.useQuery()

  return (
    <div className={cn("w-full min-h-16 mx-auto py-3 px-3 flex flex-col items-center justify-center gap-x-6 bg-primary md:px-6 md:flex-row md:rounded-t-3xl md:max-w-screen-md lg:max-w-[896px]", {
      "sm:px-6 md:px-10": session.mode === 'SINGLE'
    })}>
      {players && !isLoading ? (
        <SessionPlayer
          player={players?.owner}
        />
      ) : (
        <>TODO: loading skeleton</>
      )}

      {session.mode !== 'SINGLE' && players?.guest && (
        <>
          <Separator className="flex w-4/5 h-1 mx-auto my-4 bg-secondary-foreground/80 rounded-full md:hidden"
            orientation="vertical"
          />

          <Separator className="hidden w-1.5 h-14 bg-secondary-foreground/80 rounded-full md:flex"
            orientation="vertical"
          />

          <SessionPlayer
            player={players.guest}
            flipOrder
          />
        </>
      )}
    </div>
  )
}

export default SessionFooter
