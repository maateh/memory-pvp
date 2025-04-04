import { Suspense } from "react"

// types
import type { ClientCardCollection } from "@repo/schema/collection"

// server
import { getCollection } from "@/server/db/query/collection-query"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { CollectionCard } from "@/components/collection/listing"
import {
  Popup,
  PopupContent,
  PopupFooter,
  PopupHeader,
  PopupTrigger
} from "@/components/popup"
import { Await, RedirectFallback } from "@/components/shared"
import CollectionDeletePopupActions from "./collection-delete-popup-actions"

type CollectionDeletePopupProps = ({
  renderer: "trigger"
  collection: ClientCardCollection
  collectionId?: never
} | {
  renderer: "router"
  collectionId: string
  collection?: never
}) & React.ComponentProps<typeof PopupTrigger>

const CollectionDeletePopup = ({ renderer, collection, collectionId, ...props }: CollectionDeletePopupProps) => {
  return (
    <Popup renderer={renderer}>
      <PopupTrigger renderer={renderer} {...props} />

      <PopupContent size="sm">
        <PopupHeader
          title="Delete card collection"
          description="Are you sure you want to delete this card collection?"
          size="sm"
        />

        <Separator className="mb-3 bg-border/15 md:mb-1" />

        {renderer === "trigger" && (
          <div className="px-4">
            <CollectionCard className="h-fit w-full max-w-sm sm:max-w-lg"
              collection={collection}
              metadata={{ type: "listing" }}
              imageSize={28}
            />

            <Separator className="bg-border/15 md:mt-2" />

            <PopupFooter variant="action" size="sm">
              <CollectionDeletePopupActions collection={collection} />
            </PopupFooter>
          </div>
        )}

        {renderer === "router" && (
          <Suspense fallback={<Skeleton className="h-32 bg-primary/80 rounded-2xl" />}>
            <Await promise={getCollection(collectionId)}>
              {(collection) => collection ? (
                <div className="px-4">
                  <CollectionCard className="h-fit w-full max-w-sm sm:max-w-lg"
                    collection={collection}
                    metadata={{ type: "listing" }}
                    imageSize={28}
                    key={collection.id}
                  />

                  <Separator className="bg-border/15 mt-4 md:mt-2" />

                  <PopupFooter variant="action" size="sm">
                    <CollectionDeletePopupActions collection={collection} />
                  </PopupFooter>
                </div>
              ) : (
                <RedirectFallback
                  type="back"
                  message="Collection cannot be loaded."
                  description="Unable to find collection with this identifier."
                />
              )}
            </Await>
          </Suspense>
        )}
      </PopupContent>
    </Popup>
  )
}

export default CollectionDeletePopup
