// constants
import { gameSessionsWidgetInfo } from "@/components/widgets/constants" 

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import { WidgetModal, WidgetSubheader } from "@/components/widgets"
import { SessionBreadcrumbFilter } from "@/components/session/filter"
import { SessionCardList } from "@/components/session/card"

const SessionsWidgetModal = () => {
  return (
    <WidgetModal isOpen {...gameSessionsWidgetInfo}>
      <WidgetSubheader className="-mb-2">
        Filter sessions by
      </WidgetSubheader>

      {/* TODO: sort by */}

      <SessionBreadcrumbFilter />

      <Separator className="w-4/5 mx-auto bg-border/15" />

      <SessionCardList />
    </WidgetModal>
  )
}

export default SessionsWidgetModal
