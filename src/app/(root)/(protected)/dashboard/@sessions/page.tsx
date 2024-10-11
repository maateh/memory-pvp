// trpc
import { api } from "@/trpc/server"

// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants"

// components
import { WidgetCard } from "@/components/widgets"
import { SessionBreadcrumbFilter } from "@/components/session/filter"
import SessionCounter from "./session-counter"

const SessionsWidgetCard = async () => {
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
}

export default SessionsWidgetCard
