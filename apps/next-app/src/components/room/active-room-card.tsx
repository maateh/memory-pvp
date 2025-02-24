import Link from "next/link"

// types
import type { RoomVariants } from "@repo/schema/room"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// utils
import { cn } from "@/lib/util"

// icons
import { Dices, Gamepad2, RotateCcw } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// components
import { GlowingOverlay, StatisticItem, StatisticList } from "@/components/shared"
import { SessionBadge } from "@/components/session"
import { PlayerBadge } from "@/components/player"

type ActiveRoomCardProps = {
  room: RoomVariants
} & React.ComponentProps<typeof Card>

const ActiveRoomCard = ({ room, className, ...props }: ActiveRoomCardProps) => {
  return (
    <Card className={cn("max-w-xl px-6 py-4 bg-primary/35 dark:bg-primary/60", className)} {...props}>
      <CardHeader className="px-0">
        <CardTitle className="text-lg sm:text-xl font-heading font-semibold heading-decorator">
          Hey, you have a room you joined
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground font-light">
          Rejoin this room or if you want to join another, please leave this first.
        </CardDescription>
      </CardHeader>

      <Separator className="mt-2 mb-3 bg-border/15" />

      <ActiveRoomCardContent room={room} />
    </Card>
  )
}

type ActiveRoomCardContentProps = {
  room: RoomVariants
} & React.ComponentProps<"div">

const ActiveRoomCardContent = ({ room, className, ...props }: ActiveRoomCardContentProps) => {
  return (
    <div className={cn("flex items-center justify-between gap-x-8", className)} {...props}>
      <div className="flex-1 flex flex-col gap-y-2.5">
        <div className="space-y-2">          
          <SessionBadge session={{
            slug: room.slug,
            status: room.connectionStatus === "offline" ? "OFFLINE" : "RUNNING"
          }} />

          <div className="flex flex-wrap gap-x-3">
            <PlayerBadge className="w-fit"
              size="sm"
              player={room.owner}
            />

            {room.status !== "waiting" && (
              <PlayerBadge className="w-fit"
                size="sm"
                player={room.guest}
              />
            )}
          </div>
        </div>

        <Separator className="bg-border/5" />

        <StatisticList className="justify-start">
          <StatisticItem className="max-w-40"
            size="sm"
            statistic={{
              Icon: Gamepad2,
              label: gameTypePlaceholders[room.settings.type].label,
              data: gameModePlaceholders[room.settings.mode].label
            }}
          />

          <StatisticItem className="max-w-40"
            size="sm"
            statistic={{
              Icon: Dices,
              label: tableSizePlaceholders[room.settings.tableSize].label,
              data: tableSizePlaceholders[room.settings.tableSize].size
            }}
          />
        </StatisticList>
      </div>

      <GlowingOverlay className="size-14 sm:size-16 mr-2 mt-auto mb-4"
        overlayProps={{ className: "opacity-90 dark:opacity-45" }}
      >
        <Button className="z-10 relative size-full flex-col justify-end gap-y-0.5 rounded-full transition-none"
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href="/game/multiplayer">
            <RotateCcw className="size-4 sm:size-5 shrink-0"
              strokeWidth={2.25}
            />

            <span className="text-xs sm:text-sm font-heading">
              Rejoin
            </span>
          </Link>
        </Button>
      </GlowingOverlay>
    </div>
  )
}

export default ActiveRoomCard
export { ActiveRoomCardContent }
