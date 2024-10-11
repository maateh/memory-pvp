// trpc
import { api } from "@/trpc/server"

// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants"

// utils
import { logError } from "@/lib/utils"

// components
import { WidgetCard } from "@/components/widgets"
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
        <h4 className="mt-2 mb-3 w-fit border-t border-t-accent text-lg font-heading font-semibold small-caps">
          Summary of your sessions
        </h4>
  
        <SessionBreadcrumbFilter />
  
        <SessionCounter initialData={amount} />
      </WidgetCard>
    )
  } catch (err) {
    logError(err)
  }
}

export default SessionsWidgetCard
