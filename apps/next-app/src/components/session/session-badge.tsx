// types
import type { ClientGameSession } from "@/lib/types/client"

// utils
import { cn } from "@/lib/util"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// components
import { SessionStatusIndicator } from "@/components/session"
import { CustomTooltip } from "@/components/shared"

type SessionBadgeProps = {
  session: Pick<ClientGameSession, 'slug' | 'status'>
} & React.ComponentProps<typeof Badge>

const SessionBadge = ({
  session,
  variant = "muted",
  className,
  ...props
}: SessionBadgeProps) => {
  return (
    <CustomTooltip
      tooltipProps={{ className: "border-border/45" }}
      tooltip={(
        <div className="flex items-center gap-x-2">
          <SessionStatusIndicator className="size-2.5"
            status={session.status}
          />

          <p className="mt-0.5 font-heading font-normal tracking-wide">
            Session status:
            <span className={cn("ml-1 text-lg font-semibold small-caps", {
              "text-yellow-500 dark:text-yellow-200": session.status === 'RUNNING',
              "text-secondary": session.status === 'FINISHED',
              "text-destructive": session.status === 'ABANDONED',
              "text-muted-foreground": session.status === 'OFFLINE'
            })}>
              {session.status.toLowerCase()}
            </span>
          </p>
        </div>
      )}
    >
      <Badge className={cn("gap-x-2.5 border text-sm text-foreground/80 font-heading font-normal hover:bg-inherit/5", {
        "bg-yellow-500/10 border-yellow-500/15": session.status === 'RUNNING',
        "bg-secondary/10 border-secondary/15": session.status === 'FINISHED',
        "bg-destructive/10 border-destructive/15": session.status === 'ABANDONED',
        "bg-muted/10 border-muted-foreground/15": session.status === 'OFFLINE'
      }, className)}
        variant={variant}
        {...props}
      >
        <SessionStatusIndicator
          status={session.status}
          withIcon
        />

        <Separator className="w-1 h-4 bg-border/80 rounded-full" />

        <p className="mt-0.5">
          {session.slug}
        </p>
      </Badge>
    </CustomTooltip>
  )
}

export default SessionBadge
