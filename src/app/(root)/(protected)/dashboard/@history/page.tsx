// server
import { getPlayer } from "@/server/db/player"

// constants
import { sessionHistoryWidgetInfo } from "@/components/widgets/constants"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { WidgetCard, WidgetSubheader } from "@/components/widgets"
import SessionCounter from "./session-counter"

const SessionHistoryWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })

  return (
    <WidgetCard
      widgetLink="/dashboard/history"
      {...sessionHistoryWidgetInfo}
    >
      <WidgetSubheader className="mt-2 mb-3">
        Summary of your sessions
      </WidgetSubheader>

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

export default SessionHistoryWidgetCard
