// trpc
import { api } from "@/trpc/server"

// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants"

// utils
import { logError } from "@/lib/utils"

// components
import { WidgetCard, WidgetSubheader } from "@/components/widgets"
import { SessionBreadcrumbFilter } from "@/components/session/filter"
import SessionCounter from "./session-counter"

const SessionsWidgetCard = async () => {
  try {
    const amount = await api.session.count()

    return (
      <WidgetCard
        widgetLink="/dashboard/sessions"
        {...gameSessionsWidgetInfo}
      >
        <WidgetSubheader className="mt-2 mb-3">
          Summary of your sessions
        </WidgetSubheader>
  
        <SessionBreadcrumbFilter />
  
        <SessionCounter initialData={amount} />
      </WidgetCard>
    )
  } catch (err) {
    logError(err)
  }
}

export default SessionsWidgetCard
