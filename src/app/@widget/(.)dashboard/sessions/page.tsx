// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants" 

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { SessionCardList } from "@/components/session/card"
import { SessionSettingsFilter, SessionSort, SessionStatusFilter } from "@/components/session/filter"
import { WidgetModal, WidgetSubheader } from "@/components/widgets"

const SessionsWidgetModal = () => {
  return (
    <WidgetModal isOpen {...gameSessionsWidgetInfo}>
      <WidgetSubheader className="-mb-2">
        Filter sessions by
      </WidgetSubheader>

      <div className="space-y-2 sm:space-y-1">
        <div className="flex justify-between items-center gap-x-6">
          <SessionStatusFilter />
          <SessionSort />
        </div>

        <Separator className="w-1/5 mx-auto bg-border/10" />

        <SessionSettingsFilter />
      </div>

      <Separator className="w-4/5 mx-auto bg-border/15" />

      <SessionCardList />
    </WidgetModal>
  )
}

export default SessionsWidgetModal
