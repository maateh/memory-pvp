"use client"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// icons
import { Dices, Gamepad2 } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionInfoBadge } from "@/components/session"
import SessionActionsDropdown from "./session-actions-dropdown"
import SessionSyncMarker from "./session-sync-marker"
import SessionTimer from "./session-timer"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

const SessionHeader = () => {
  const session = useSessionStore((state) => state.session)

  return (
    <header className="relative w-full min-h-14 mx-auto py-3 px-2.5 flex items-center justify-between gap-x-5 bg-primary md:px-5 md:rounded-b-2xl md:max-w-2xl">
      <div className="flex items-center gap-x-1.5 absolute sm:static">
        <SessionActionsDropdown />

        <Separator className="h-4 sm:h-5 w-1 bg-border/50 rounded-full"
          orientation="vertical"
        />

        <div className="hidden sm:flex flex-wrap items-center gap-x-2 gap-y-1">
          <SessionInfoBadge
            Icon={Gamepad2}
            label={gameTypePlaceholders[session.type].label}
            subLabel={gameModePlaceholders[session.mode].label}
          />

          <SessionInfoBadge
            Icon={Dices}
            label={tableSizePlaceholders[session.tableSize].label}
            subLabel={tableSizePlaceholders[session.tableSize].size}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-x-2 ml-auto sm:flex-row-reverse">
        <SessionTimer timer={session.stats.timer} />

        {session.status !== 'OFFLINE' && (
          <>
            <Separator className="h-4 sm:h-[1.125rem] w-1 bg-border/50 rounded-full"
              orientation="vertical"
            />

            <SessionSyncMarker />
          </>
        )}
      </div>
    </header>
  )
}

export default SessionHeader
