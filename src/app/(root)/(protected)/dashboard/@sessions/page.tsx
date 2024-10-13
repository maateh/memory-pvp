// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants"

// components
import { WidgetCard, WidgetSubheader } from "@/components/widgets"
import { SessionBreadcrumbFilter } from "@/components/session/filter"
import SessionCounter from "./session-counter"

const SessionsWidgetCard = () => {
  return (
    <WidgetCard
      widgetLink="/dashboard/sessions"
      {...gameSessionsWidgetInfo}
    >
      <WidgetSubheader className="mt-2 mb-3">
        Summary of your sessions
      </WidgetSubheader>

      <SessionBreadcrumbFilter />

      <SessionCounter />
    </WidgetCard>
  )
}

export default SessionsWidgetCard
