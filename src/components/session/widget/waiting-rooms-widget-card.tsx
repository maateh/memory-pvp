// constants
import { waitingRoomsWidget } from "@/constants/dashboard"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import { WidgetCard } from "@/components/widget"

const WaitingRoomsWidgetCard = () => {
  return (
    <WidgetCard widget={waitingRoomsWidget}>
      <h4 className="text-lg font-heading font-semibold small-caps heading-decorator subheading">
        Room Settings
      </h4>

      <SessionSettingsFilter
        filterService="store"
        filterKey="rooms"
      />
    </WidgetCard>
  )
}

export default WaitingRoomsWidgetCard
