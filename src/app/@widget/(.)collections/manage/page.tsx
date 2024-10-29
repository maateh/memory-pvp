// server
import { getUserCollections } from "@/server/actions/collection"

// constants
import { collectionManageWidgetInfo } from "@/components/widgets/constants" 

// icons
import { EllipsisVertical } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// components
import { WidgetModal, WidgetSubheader } from "@/components/widgets"
import {
  CollectionWidgetCard,
  CollectionWidgetItem,
  CollectionWidgetList
} from "@/components/collection/widget"
import CollectionActionsDropdown from "./collection-actions-dropdown"

const CollectionsManageWidgetModal = async () => {
  const collections = await getUserCollections()

  return (
    <WidgetModal {...collectionManageWidgetInfo}>
      <WidgetSubheader>
        Manage your collections
      </WidgetSubheader>

      <ScrollArea className="max-h-96 pr-3">
        <CollectionWidgetList className="flex flex-col gap-y-5">
          {collections.map((collection) => (
            <CollectionWidgetItem className="relative" key={collection.id}>
              <CollectionWidgetCard className="py-1"
                imageSize={44}
                collection={collection}
              />
        
              <CollectionActionsDropdown
                collection={collection}
              >
                <Button className="p-1 sm:p-1.5 absolute right-4 top-4"
                  variant="ghost"
                  size="icon"
                >
                  <EllipsisVertical className="size-3.5 sm:size-4" strokeWidth={2.5} />
                </Button>
              </CollectionActionsDropdown>
            </CollectionWidgetItem>
          ))}
        </CollectionWidgetList>
      </ScrollArea>
    </WidgetModal>
  )
}

export default CollectionsManageWidgetModal
