import Link from "next/link"
import { Suspense } from "react"

// db
import { getPlayer } from "@/server/db/query/player-query"

// redis
import { getActiveRoom } from "@repo/server/redis-commands"

// icons
import { CircleFadingPlus, PlayCircle, Swords, UserRoundPlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { Await, GlowingOverlay } from "@/components/shared"
import { ActiveRoomCardContent } from "@/components/room"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetSubtitle
} from "@/components/widget"

const WaitingRoomsWidgetCard = () => {
  return (
    <WidgetCard
      title="Waiting Rooms"
      description="Create or join waiting rooms to start a multiplayer game session."
      Icon={Swords}
    >
      <WidgetActionWrapper>
        <WidgetLink href="/dashboard/rooms" />
      </WidgetActionWrapper>

      <Suspense>
        <Await promise={getPlayer({ filter: { isActive: true } })}>
          {(player) => player ? (
            <Await promise={getActiveRoom(player.id)}>
              {(activeRoom) => activeRoom ? (
                <div className="space-y-1.5 my-auto">
                  <WidgetSubtitle>
                    Active room
                  </WidgetSubtitle>

                  <ActiveRoomCardContent room={activeRoom} />
                </div>
              ) : (
                <div className="my-auto flex flex-wrap justify-evenly items-center gap-x-8 gap-y-4">
                  <GlowingOverlay className="size-18 sm:size-20"
                    overlayProps={{ className: "opacity-90 dark:opacity-45" }}
                  >
                    <Button className="z-10 relative size-full flex-col justify-end gap-y-0.5 rounded-full transition-none"
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link href="/game/setup?mode=PVP">
                        <CircleFadingPlus className="size-4 sm:size-5 shrink-0"
                          strokeWidth={2.25}
                        />

                        <span className="text-xs sm:text-sm font-heading">
                          Create
                        </span>
                      </Link>
                    </Button>
                  </GlowingOverlay>

                  <GlowingOverlay className="size-18 sm:size-20"
                    overlayProps={{ className: "bg-destructive opacity-90 dark:opacity-45" }}
                  >
                    <Button className="z-10 relative size-full flex-col justify-end gap-y-0.5 rounded-full transition-none"
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link href="/dashboard/rooms">
                        <PlayCircle className="size-4 sm:size-5 shrink-0"
                          strokeWidth={2.25}
                        />

                        <span className="text-xs sm:text-sm font-heading">
                          Join
                        </span>
                      </Link>
                    </Button>
                  </GlowingOverlay>
                </div>
              )}
            </Await>
          ) : (
            <Button className="flex-1 p-3 flex-wrap gap-x-2.5 gap-y-1.5 text-center text-sm sm:text-base text-muted-foreground font-normal font-heading whitespace-normal"
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href="/dashboard/players">
                <UserRoundPlus className="size-4 sm:size-5" />
                <span className="mt-1 break-words">
                  Create your first player profile
                </span>
              </Link>
            </Button>
          )}
        </Await>
      </Suspense>
    </WidgetCard>
  )
}

export default WaitingRoomsWidgetCard
