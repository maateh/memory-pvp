// types
import type { WaitingRoom } from "@repo/schema/session-room"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// icons
import { CalendarClock, Dices, Gamepad2, PlayCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { PlayerBadge } from "@/components/player"
import { SessionBadge, SessionInfoBadge } from "@/components/session"
import { CustomDate } from "@/components/shared"

type WaitingRoomCardProps = {
  room: WaitingRoom
}

const WaitingRoomCard = ({ room }: WaitingRoomCardProps) => {
  return (
    <div className="w-full py-1.5 px-1 sm:px-2 flex flex-wrap justify-between gap-x-3 gap-y-2">
      <div className="space-y-2">
        <PlayerBadge className="w-fit"
          size="lg"
          player={room.owner}
        />

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <SessionInfoBadge className="text-xs max-lg:px-2"
            Icon={Gamepad2}
            label={gameTypePlaceholders[room.settings.type].label}
            subLabel={gameModePlaceholders[room.settings.mode].label}
          />

          <SessionInfoBadge className="text-xs max-lg:px-2"
            Icon={Dices}
            label={tableSizePlaceholders[room.settings.tableSize].label}
            subLabel={tableSizePlaceholders[room.settings.tableSize].size}
          />
        </div>
      </div>

      <div className="ml-auto flex flex-col items-end justify-between">
        <div className="mb-1.5 flex flex-wrap-reverse items-center gap-x-1.5 gap-y-1">
          <SessionBadge className="w-fit"
            session={{ slug: room.slug, status: "RUNNING" }}
          />

          <Button className="ml-auto p-1.5 hover:bg-muted/50"
            tooltip="Join room..."
            variant="ghost"
            size="sm"
            onClick={() => {}} // TODO: implement join
          >
            <PlayCircle className="size-4 sm:size-5 md:size-6 shrink-0 text-accent" />
          </Button>
        </div>

        <Separator className="w-11/12 ml-auto mt-auto mb-1.5 bg-border/65" />

        <CustomDate className="text-end"
          date={room.createdAt}
          Icon={CalendarClock}
        />
      </div>
    </div>
  )
}

const WaitingRoomCardSkeleton = () => {
  return (
    <div className="w-full py-1.5 px-1 sm:px-2 flex flex-wrap justify-between gap-x-3 gap-y-2">
      <div className="space-y-2">
        <Skeleton className="w-28 h-6 bg-muted/80 rounded-full" />

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Skeleton className="w-32 h-6 bg-muted/80 rounded-full" />
          <Skeleton className="w-32 h-6 bg-muted/80 rounded-full" />
        </div>
      </div>

      <div className="ml-auto flex flex-col items-end justify-between">
        <div className="mb-1.5 flex flex-wrap-reverse items-center gap-x-1.5 gap-y-1">
          <Skeleton className="w-36 h-6 bg-muted/80 rounded-full" />

          <Skeleton className="size-7 sm:size-8 bg-muted/80 rounded-full" />
        </div>

        <Separator className="w-11/12 ml-auto mt-auto mb-1.5 bg-border/65" />

        <Skeleton className="w-24 h-4 bg-muted/80 rounded-full" />
      </div>
    </div>
  )
}

export default WaitingRoomCard
export { WaitingRoomCardSkeleton }
