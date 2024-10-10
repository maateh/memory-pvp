// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants"

// icons
import { SquareSigma } from "lucide-react"

// components
import { WidgetCard } from "@/components/widgets"
import SessionBreadcrumbFilter from "./session-breadcrumb-filter"

const SessionsWidgetCard = () => {
  return (
    <WidgetCard
      widgetLink="/dashboard/sessions"
      {...gameSessionsWidgetInfo}
    >
      <h4 className="mt-2 mb-3 w-fit border-t border-t-accent text-lg font-heading font-semibold small-caps">
        Summary of your sessions
      </h4>

      <SessionBreadcrumbFilter />

      <div className="mt-5 pt-2.5 flex gap-x-2 border-t border-border/70">
        <SquareSigma className="size-4 sm:size-5" />
        <p className="font-heading small-caps">
          Total sessions: <span className="font-medium">420</span>
        </p>
      </div>
    </WidgetCard>
  )
}

export default SessionsWidgetCard
