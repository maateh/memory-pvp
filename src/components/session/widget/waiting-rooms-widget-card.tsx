// constants
import { waitingRoomsWidget } from "@/constants/dashboard"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetSubtitle
} from "@/components/widget"

const WaitingRoomsWidgetCard = () => {
  return (
    <WidgetCard widget={waitingRoomsWidget}>
      <WidgetActionWrapper>
        <WidgetLink href={waitingRoomsWidget.href} />
      </WidgetActionWrapper>

      <WidgetSubtitle>
        Room Settings
      </WidgetSubtitle>

      <SessionSettingsFilter
        filterService="store"
        filterKey="rooms"
      />
    </WidgetCard>
  )
}

export default WaitingRoomsWidgetCard
