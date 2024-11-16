// server
import { getPlayer } from "@/server/db/player"

// constants
import { sessionsWidget } from "@/constants/dashboard"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionCounter } from "@/components/session"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { WidgetCard } from "@/components/widget"

const SessionsWidgetCard = async () => {
  const player = await getPlayer({ isActive: true })

  return (
    <WidgetCard widget={sessionsWidget}>
      <h4 className="text-lg font-heading font-semibold small-caps heading-decorator subheading">
        Summary of your sessions
      </h4>

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
