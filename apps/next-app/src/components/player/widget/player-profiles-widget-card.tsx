import { Suspense } from "react"
import Link from "next/link"

// db
import { getPlayer } from "@/server/db/query/player-query"

// icons
import { Gamepad2, UserRoundPlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// components
import { Await, CardItem } from "@/components/shared"
import { PlayerProfileCard } from "@/components/player/listing"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetCardLoader,
  WidgetLink,
  WidgetQuickAccess,
  WidgetSubtitle
} from "@/components/widget"

const PlayerProfilesWidgetCard = () => {
  return (
    <WidgetCard
      title="Player Profiles"
      description="Create different player profiles to play with. It makes easily possible to use smurf profiles if you want."
      Icon={Gamepad2}
    >
      <WidgetActionWrapper>
        <WidgetQuickAccess href="/players/select" />
        <WidgetLink href="/dashboard/players" />
      </WidgetActionWrapper>

      <Suspense fallback={<WidgetCardLoader />}>
        <Await promise={getPlayer({ isActive: true })}>
          {(player) => player ? (
            <>
              <div className="space-y-1.5">
                <WidgetSubtitle>
                  Statistics filter
                </WidgetSubtitle>
    
                <SessionStatusFilter
                  filterService="store"
                  filterKey="statistics"
                />
    
                <SessionSettingsFilter
                  filterService="store"
                  filterKey="statistics"
                />
              </div>
    
              <Separator className="w-1/2 mx-auto mt-4 mb-2 bg-border/10" />
    
              <CardItem>
                <PlayerProfileCard player={player} />
              </CardItem>
            </>
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

export default PlayerProfilesWidgetCard
