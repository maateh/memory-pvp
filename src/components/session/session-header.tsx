"use client"

// utils
import { cn } from "@/lib/utils"
import { formatTimer } from "@/lib/utils/game"

// icons
import { RefreshCcw, RefreshCcwDot, RefreshCwOff, type LucideIcon } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { ThemeToggle } from "@/components/shared"
import { SessionActionsDropdown } from "@/components/session"

// hooks
import { useTimer } from "@/hooks/use-timer"
import { useSessionStore, type SessionSyncState } from "@/hooks/store/use-session-store"

function getSyncIcon(syncState: SessionSyncState): LucideIcon {
  switch(syncState) {
    case "SYNCHRONIZED": return RefreshCcw
    case "OUT_OF_SYNC": return RefreshCwOff
    case "PENDING": return RefreshCcwDot
  }
}

type SessionHeaderProps = {
  session: ClientGameSession
}

const SessionHeader = ({ session }: SessionHeaderProps) => {
  const { timer } = useTimer({ initialInMs: session.timer * 1000 })

  const syncState = useSessionStore((state) => state.syncState)
  const SyncIcon = getSyncIcon(syncState)

  return (
    <div className="w-full min-h-14 mx-auto py-3 px-1.5 flex items-center justify-between bg-primary sm:px-5 sm:rounded-b-2xl sm:max-w-lg md:max-w-xl">
      <SessionActionsDropdown session={session} />

      <div className="relative">
        <p className="pt-1 text-xl sm:text-2xl font-heading font-bold tracking-wider">{formatTimer(timer)}</p>

        <div className="flex items-center gap-x-2 absolute -right-8 inset-y-0">
          <Separator className="h-4 sm:h-[1.125rem] w-0.5 rounded-full" orientation="vertical" />

          <SyncIcon className={cn("size-4 rounded-full", {
            "text-accent": syncState === 'SYNCHRONIZED',
            "text-destructive": syncState === 'OUT_OF_SYNC',
            "text-muted-foreground": syncState === 'PENDING'
          })}
            strokeWidth={2.15}
          />
        </div>
      </div>

      <ThemeToggle className="hover:bg-primary-foreground/5 hover:text-primary-foreground"
        variant="ghost"
      />
    </div>
  )
}

export default SessionHeader
