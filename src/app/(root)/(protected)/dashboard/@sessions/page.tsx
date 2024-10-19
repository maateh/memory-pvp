// server
import { getPlayer } from "@/server/actions/player"

// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { WidgetCard, WidgetSubheader } from "@/components/widgets"
import SessionCounter from "./session-counter"

const SessionsWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })

  return (
    <WidgetCard
      widgetLink="/dashboard/sessions"
      {...gameSessionsWidgetInfo}
    >
      <WidgetSubheader className="mt-2 mb-3">
        Summary of your sessions
      </WidgetSubheader>

      <div className="space-y-1.5 sm:space-y-1">
        <SessionStatusFilter />

        <Separator className="w-1/5 mx-auto bg-border/10" />

        <SessionSettingsFilter />
      </div>

      <SessionCounter playerTag={player?.tag} />
    </WidgetCard>
  )
}

export default SessionsWidgetCard
