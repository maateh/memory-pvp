// server
import { getPlayer } from "@/server/db/player"

// icons
import { History } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionCounter } from "@/components/session"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetSubtitle
} from "@/components/widget"

const SessionsWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })

  return (
    <WidgetCard
      title="Session History"
      description="Browse through your previous game sessions."
      Icon={History}
    >
      <WidgetActionWrapper>
        <WidgetLink href="/dashboard/history" /> {/* TODO: change to `/dashboard/sessions` later */}
      </WidgetActionWrapper>

      <WidgetSubtitle>
        Summary of your sessions
      </WidgetSubtitle>

      <div className="space-y-1.5 sm:space-y-1">
        <SessionStatusFilter
          filterService="store"
          filterKey="history"
        />

        <Separator className="w-1/5 mx-auto bg-border/10" />

        <SessionSettingsFilter
          filterService="store"
          filterKey="history"
        />
      </div>

      <SessionCounter playerTag={player?.tag} />
    </WidgetCard>
  )
}

export default SessionsWidgetCard
