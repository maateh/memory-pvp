// utils
import { cn } from "@/lib/utils"

// icons
import { BadgeInfo, RefreshCcw, RefreshCcwDot, RefreshCwOff } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { CustomTooltip } from "@/components/shared"

// hooks
import { useSessionStore, type SessionSyncState } from "@/hooks/store/use-session-store"

const syncStateMap: Record<SessionSyncState, { icon: React.ReactNode; description: string }> = {
  "SYNCHRONIZED": {
    icon: <RefreshCcw className="size-3.5 text-accent" />,
    description: "Session is synchronized."
  },
  "OUT_OF_SYNC": {
    icon: <RefreshCwOff className="size-3.5 text-destructive" />,
    description: "Session is out of sync."
  },
  "PENDING": {
    icon: <RefreshCcwDot className="size-3.5 text-muted-foreground" />,
    description: "Synchronizing..."
  }
}

const SessionSyncMarker = () => {
  const syncState = useSessionStore((state) => state.syncState)

  const tooltipContent = (
    <>
      <BadgeInfo className="mb-1 size-5 mx-auto text-secondary" strokeWidth={2.5} />

      <p className="max-w-sm text-sm font-light text-center">
        Indicates that your game session is synchronized or not.
        <span className="block mt-1 text-xs text-muted-foreground">
          This means that if something unexpected happens on your side <i>(e.g. browser crashes or the internet connection is lost)</i>, the current session will be stored at the last synchronized point.
        </span>
      </p>

      <Separator className="w-1/5 mx-auto my-2.5 bg-border/40" />

      <ul className="w-fit space-y-1 mx-auto">
        {Object.entries(syncStateMap).map(([state, { icon, description }]) => (
          <li className="flex items-center justify-center gap-x-2" key={state}>
            {icon}
            <p className={cn("text-xs", {
              "text-accent": (state as SessionSyncState) === 'SYNCHRONIZED',
              "text-destructive": (state as SessionSyncState) === 'OUT_OF_SYNC',
              "text-muted-foreground": (state as SessionSyncState) === 'PENDING',
            })}>
              {description}
            </p>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <CustomTooltip className="cursor-help"
      tooltip={tooltipContent}
    >
      {syncStateMap[syncState].icon}
    </CustomTooltip>
  )
}

export default SessionSyncMarker
