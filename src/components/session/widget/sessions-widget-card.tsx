// server
import { getPlayer } from "@/server/db/query/player-query"

// icons
import { History } from "lucide-react"

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
  const player = await getPlayer({ filter: { isActive: true } })

  return (
    <WidgetCard
      title="Session History"
      description="Browse through your previous game sessions."
      Icon={History}
    >
      <WidgetActionWrapper>
        <WidgetLink href="/dashboard/sessions" />
      </WidgetActionWrapper>

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
    </WidgetCard>
  )
}

export default SessionsWidgetCard
