"use client"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import SessionActionsDropdown from "./session-actions-dropdown"
import SessionBasics from "./session-basics"
import SessionSyncMarker from "./session-sync-marker"
import SessionTimer from "./session-timer"

type SessionHeaderProps = {
  session: ClientGameSession
}

const SessionHeader = ({ session }: SessionHeaderProps) => {
  return (
    <div className="relative w-full min-h-14 mx-auto py-3 px-1.5 flex items-center justify-between gap-x-5 bg-primary md:px-5 md:rounded-b-2xl md:max-w-2xl">
      <div className="flex items-center gap-x-1 sm:gap-x-2 absolute sm:static">
        <SessionActionsDropdown session={session} />

        <Separator className="h-4 sm:h-5 w-1 bg-border/50 rounded-full"
          orientation="vertical"
        />

        <SessionBasics {...session} />
      </div>

      <div className="mx-auto sm:mr-0 flex items-center justify-center gap-x-2 relative">
        <div className="flex flex-row-reverse sm:flex-row items-center gap-x-2 absolute sm:static inset-y-1/2 -right-8">
          <SessionSyncMarker />

          <Separator className="h-4 sm:h-[1.125rem] w-0.5 rounded-full"
            orientation="vertical"
          />
        </div>

        <SessionTimer initialInMs={session.timer * 1000} />
      </div>
    </div>
  )
}

export default SessionHeader
