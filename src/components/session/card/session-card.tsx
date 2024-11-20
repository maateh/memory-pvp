import Link from "next/link"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { CalendarCheck, CalendarClock, Dices, ExternalLink, Gamepad2, StepForward } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { PlayerBadge } from "@/components/player"
import { SessionInfoBadge, SessionBadge } from "@/components/session"
import { CustomDate } from "@/components/shared"

type SessionCardProps = {
  session: ClientGameSession
}

const SessionCard = ({ session }: SessionCardProps) => {
  return (
    <div className="w-full py-1.5 px-1 sm:px-2 flex flex-wrap justify-between gap-x-3 gap-y-2">
      <div className="space-y-2">
        <SessionBadge className="w-fit"
          session={session}
        />

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <SessionInfoBadge className="max-lg:px-2"
            Icon={Gamepad2}
            label={gameTypePlaceholders[session.type].label}
            subLabel={gameModePlaceholders[session.mode].label}
          />

          <SessionInfoBadge className="max-lg:px-2"
            Icon={Dices}
            label={tableSizePlaceholders[session.tableSize].label}
            subLabel={tableSizePlaceholders[session.tableSize].size}
          />
        </div>
      </div>

      <div className="ml-auto flex flex-col items-end justify-between">
        <div className="mb-1.5 flex flex-wrap-reverse items-center gap-x-1.5 gap-y-1">
          <PlayerBadge player={session.players.current} />

          {session.status === 'RUNNING' ? (
            // TODO: continue session
            <Button className="ml-auto p-2.5 rounded-full"
              tooltip="Continue session (WIP)"
              variant="ghost"
              size="icon"
            >
              <StepForward className="size-4 sm:size-5 shrink-0 text-accent"
                strokeWidth={2.5}
              />
            </Button>
          ) : (
            <Button className="ml-auto p-2.5 rounded-full"
              tooltip="Open summary"
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href={`/game/summary/${session.slug}`}>
                <ExternalLink className="size-4 sm:size-5 shrink-0 text-muted-foreground transition group-hover:text-foreground/90" />
              </Link>
            </Button>
          )}
        </div>

        <Separator className="w-11/12 ml-auto mt-auto mb-1.5 bg-border/65" />

        <CustomDate className="text-end"
          date={session.closedAt || session.startedAt}
          Icon={session.closedAt ? CalendarCheck : CalendarClock}
        />
      </div>
    </div>
  )
}

const SessionCardSkeleton = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-x-3">
        <Skeleton className="size-3.5 rounded-full border border-border bg-muted-foreground/80" />

        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-2">
            <Skeleton className="w-32 h-5 bg-muted/80" />
            <Skeleton className="w-20 h-4 bg-muted/80" />
          </div>

          <div className="flex gap-x-2">
            <Skeleton className="w-24 h-5 bg-accent/35" />
            <Skeleton className="w-24 h-5 bg-accent/35" />
          </div>
        </div>
      </div>

      <ExternalLink className="size-4 sm:size-5 text-muted-foreground animate-pulse transition group-hover:text-foreground/90" />
    </div>
  )
}

export default SessionCard
export { SessionCardSkeleton }
