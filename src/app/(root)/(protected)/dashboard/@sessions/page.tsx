// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants"

// icons
import { ChevronRightCircle, SquareSigma } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"

// components
import { WidgetCard } from "@/components/widgets"

const SessionsWidgetCard = () => {
  // TODO: show played sessions per categories
  // A "breadcrumb"-like filter mechanism

  // CASUAL sessions (+ offline played)
  // - [SINGLE] sessions (+ offline played)
  //    - [...TABLE_SIZES] sessions (+ offline played)
  // - [COOP] sessions
  //    - [...TABLE_SIZES] sessions (+ offline played)

  // COMPETITIVE sessions
  // - [SINGLE] sessions
  //    - [...TABLE_SIZES] sessions
  // - [COOP] sessions
  //    - [...TABLE_SIZES] sessions
  // - [PVP] sessions
  //    - [...TABLE_SIZES] sessions

  return (
    <WidgetCard
      widgetLink="/dashboard/sessions"
      {...gameSessionsWidgetInfo}
    >
      <h4 className="mt-2 mb-3 w-fit border-t border-t-accent text-lg font-heading font-semibold small-caps">
        Summary of your sessions
      </h4>

      <div className="flex items-center gap-x-1.5">
        <Badge>
          Casual
        </Badge>

        <Badge>
          Competitive
        </Badge>

        <ChevronRightCircle className="size-4 text-foreground/65" />
      </div>

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
