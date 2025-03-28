"use client"

// config
import {
  matchFormatPlaceholders,
  sessionModePlaceholders,
  tableSizePlaceholders
} from "@repo/config/game"

// icons
import { Dices, Gamepad2 } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SyncIndicator } from "@/components/shared"
import { SessionInfoBadge } from "@/components/session"
import SessionActionsDropdown from "./session-actions-dropdown"
import SessionHeaderTimer from "./session-header-timer"

// hooks
import { useSessionStore } from "@/components/provider/session-store-provider"

const SessionHeader = () => {
  const session = useSessionStore((state) => state.session)
  const syncStatus = useSessionStore((state) => state.syncStatus)

  return (
    <header className="relative w-full min-h-14 mx-auto py-3 px-2.5 flex items-center justify-between gap-x-5 bg-background/65 md:px-5 md:rounded-b-2xl md:max-w-2xl">
      <div className="flex items-center gap-x-1.5 absolute sm:static">
        <SessionActionsDropdown />

        <Separator className="h-4 sm:h-5 w-1 bg-border/50 rounded-full"
          orientation="vertical"
        />

        <div className="hidden sm:flex flex-wrap items-center gap-x-2 gap-y-1">
          <SessionInfoBadge
            Icon={Gamepad2}
            label={sessionModePlaceholders[session.mode].label}
            subLabel={matchFormatPlaceholders[session.format].label}
          />

          <SessionInfoBadge
            Icon={Dices}
            label={tableSizePlaceholders[session.tableSize].label}
            subLabel={tableSizePlaceholders[session.tableSize].size}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-x-2 ml-auto sm:flex-row-reverse">
        <SessionHeaderTimer startedAt={session.startedAt} />

        {session.format !== "OFFLINE" && (
          <>
            <Separator className="h-4 sm:h-[1.125rem] w-1 bg-border/50 rounded-full"
              orientation="vertical"
            />

            <SyncIndicator status={syncStatus} />
          </>
        )}
      </div>
    </header>
  )
}

export default SessionHeader
