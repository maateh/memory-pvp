// icons
import { Swords, Wrench } from "lucide-react"

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
import { CardItem } from "@/components/shared"

const WaitingRoomsWidgetCard = () => {
  const rooms = [] // Mocked array of waiting rooms

  return (
    <WidgetCard
      title="Waiting Rooms (WIP)"
      description="Online multiplayer sessions where other players are currently waiting for their opponents or teammates."
      Icon={Swords}
    >
      <WidgetActionWrapper>
        <WidgetLink href="/dashboard/rooms" />
      </WidgetActionWrapper>

      {rooms.length > 0 && (
        <>
          <WidgetSubtitle>
            Room Settings
          </WidgetSubtitle>

          <SessionSettingsFilter
            filterService="store"
            filterKey="rooms"
          />

          <Separator className="w-2/3 mx-auto my-4 bg-border/10" />
        </>
      )}

      <CardItem className="flex-1 p-3 justify-center flex-wrap gap-x-2.5 gap-y-1.5 text-center text-sm sm:text-base text-muted-foreground font-heading">
        <Wrench className="size-4 sm:size-5" />
        <span className="mt-1">
          Waiting rooms have not been implemented yet.
        </span>
      </CardItem>
    </WidgetCard>
  )
}

export default WaitingRoomsWidgetCard
