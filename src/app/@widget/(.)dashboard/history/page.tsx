import { Suspense } from "react"

// types
import type { SessionFilter, SessionSort } from "@/components/session/filter/types"

// constants
import { sessionHistoryWidgetInfo } from "@/components/widgets/constants" 
import { sessionSortOptions } from "@/components/session/filter/constants"

// utils
import { parseFilterParams } from "@/lib/utils"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// components
import { SessionCardList, SessionCardListSkeleton } from "@/components/session/card"
import { SessionSettingsFilter, SessionStatusFilter } from "@/components/session/filter"
import { SortDropdownButton } from "@/components/shared"
import { WidgetModal, WidgetSubheader } from "@/components/widgets"

type CollectionsPageProps = {
  searchParams: SessionFilter & SessionSort
}

const SessionHistoryWidgetModal = ({ searchParams }: CollectionsPageProps) => {
  const params = new URLSearchParams(searchParams as {})
  const { filter, sort } = parseFilterParams<typeof searchParams>(params)

  return (
    <WidgetModal {...sessionHistoryWidgetInfo}>
      <WidgetSubheader className="-mb-2">
        Filter sessions by
      </WidgetSubheader>

      <div className="space-y-2 sm:space-y-1">
        <div className="flex justify-between items-center gap-x-6">
          <SessionStatusFilter filterKey="history" />
          <SortDropdownButton options={sessionSortOptions} />
        </div>

        <Separator className="w-1/5 mx-auto bg-border/10" />

        <SessionSettingsFilter filterKey="history" />
      </div>

      <Separator className="w-4/5 mx-auto bg-border/15" />

      <ScrollArea className="max-h-96 pr-3">
        <Suspense fallback={<SessionCardListSkeleton />}>
          <SessionCardList
            filter={filter}
            sort={sort}
          />
        </Suspense>
      </ScrollArea>
    </WidgetModal>
  )
}

export default SessionHistoryWidgetModal
