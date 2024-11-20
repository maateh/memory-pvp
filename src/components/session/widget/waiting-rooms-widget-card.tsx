// icons
import { Swords } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionSettingsFilter } from "@/components/session/filter"
import {
  WidgetActionWrapper,
  WidgetCard,
  WidgetLink,
  WidgetSubtitle
} from "@/components/widget"
import { Warning } from "@/components/shared"

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

      <Separator className="w-2/3 mx-auto my-4 bg-border/10" />

      <Warning className="h-auto mt-6 mx-auto text-base font-heading"
        messageProps={{ className: "mt-1" }}
        message="Waiting rooms have not been implemented yet."
      />
    </WidgetCard>
  )
}

export default WaitingRoomsWidgetCard
