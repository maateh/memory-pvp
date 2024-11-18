// icons
import { Swords } from "lucide-react"

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
    <WidgetCard
      title="Waiting Rooms (WIP)"
      description="Online multiplayer sessions where other players are currently waiting for their opponents or teammates."
      Icon={Swords}
    >
      <WidgetActionWrapper>
        <WidgetLink href="/dashboard/rooms" />
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
