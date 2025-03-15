import { Suspense } from "react"
import Link from "next/link"

// db
import { getPlayer } from "@/server/db/query/player-query"

// icons
import { History, UserRoundPlus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { Await } from "@/components/shared"
import { SessionCounter } from "@/components/session"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetSubtitle
} from "@/components/widget"

const SessionsWidgetCard = () => {
  return (
    <WidgetCard
      title="Session History"
      description="Browse through your previous game sessions."
      Icon={History}
    >
      <WidgetActionWrapper>
        <WidgetLink href="/dashboard/sessions" />
      </WidgetActionWrapper>

      {/* TODO: create loading fallback for `WidgetCard` */}
      <Suspense fallback={<>Loading...</>}>
        <Await promise={getPlayer({ isActive: true })}>
          {(player) => player ? (
            <>
              <div className="space-y-1.5">
                <WidgetSubtitle>
                  Session settings
                </WidgetSubtitle>

                <SessionStatusFilter
                  filterService="store"
                  filterKey="history"
                />

                <SessionSettingsFilter
                  filterService="store"
                  filterKey="history"
                />
              </div>

              <SessionCounter player={player} />
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
                  Create a player profile first
                </span>
              </Link>
            </Button>
          )}
        </Await>
      </Suspense>
    </WidgetCard>
  )
}

export default SessionsWidgetCard
