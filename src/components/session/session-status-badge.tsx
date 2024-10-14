// utils
import { cn } from "@/lib/utils"

// components
import { CustomTooltip } from "@/components/shared"

type SessionStatusBadgeProps = {
  status: ClientGameSession['status']
}

const SessionStatusBadge = ({ status }: SessionStatusBadgeProps) => {
  return (
    <CustomTooltip
      tooltipProps={{ className: "py-0.5 border-border/45" }}
      tooltip={(
        <div className="flex items-center gap-x-2">
          <SessionStatusMarker className="size-3" status={status} />

          <p className="font-heading">
            Session status:
            <span className={cn("ml-1 text-lg font-semibold small-caps", {
              "text-yellow-500 dark:text-yellow-200": status === 'RUNNING',
              "text-secondary": status === 'FINISHED',
              "text-destructive": status === 'ABANDONED',
              "text-muted-foreground": status === 'OFFLINE'
            })}>
              {status.toLowerCase()}
            </span>
          </p>
        </div>
      )}
    >
      <SessionStatusMarker status={status} />
    </CustomTooltip>
  )
}

type SessionStatusMarkerProps = {
  className?: string
} & SessionStatusBadgeProps

const SessionStatusMarker = ({ className, status }: SessionStatusMarkerProps) => (
  <div className={cn("size-3.5 rounded-full border border-border flex-none", {
    "bg-yellow-500 dark:bg-yellow-200": status === 'RUNNING',
    "bg-secondary": status === 'FINISHED',
    "bg-destructive": status === 'ABANDONED',
    "bg-muted": status === 'OFFLINE'
  }, className)} />
)

export default SessionStatusBadge
export { SessionStatusMarker }
