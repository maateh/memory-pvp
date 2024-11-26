import { Suspense } from "react"

// server
import { getCollection } from "@/server/db/collection"

// shadcn
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

// components
import { CollectionPreviewItem, CollectionPreviewList } from "@/components/collection"
import { CollectionEditForm } from "@/components/collection/form"
import { Popup, PopupContent, PopupHeader, PopupTrigger } from "@/components/popup"
import { Await } from "@/components/shared"

type CollectionEditPopupProps = ({
  renderer: "trigger"
  collection: ClientCardCollection
  collectionId?: never
} | {
  renderer: "router"
  collectionId: string
  collection?: never
}) & React.ComponentProps<typeof PopupTrigger>

const CollectionEditPopup = ({ renderer, collection, collectionId, ...props }: CollectionEditPopupProps) => {
  return (
    <Popup renderer={renderer}>
      <PopupTrigger renderer={renderer} {...props} />

      <PopupContent>
        <PopupHeader
          title="Update collection"
          description="Update the name or the description of this collection."
        />

        <Separator className="mb-3 bg-border/15 md:mb-1" />

        {renderer === "trigger" && (
          <CollectionEditContent collection={collection} />
        )}

        {renderer === "router" && (
          <Suspense fallback={<CollectionEditSkeleton />}>
            <Await promise={getCollection({ id: collectionId })}>
              {(collection) => collection ? (
                <CollectionEditContent collection={collection} />
              ) : (
                <>TODO: not found fallback</>
              )}
            </Await>
          </Suspense>
        )}
      </PopupContent>
    </Popup>
  )
}

const CollectionEditContent = ({ collection }: { collection: ClientCardCollection }) => (
  <div className="space-y-10 max-md:p-5">
    <div className="w-max mx-auto text-center">
      <p className="mx-auto text-xl sm:text-2xl font-bold font-heading tracking-wider small-caps">
        {collection.name}
      </p>

      <CollectionPreviewList className="pt-1 justify-center" dense>
        {collection.cards.map((card) => (
          <CollectionPreviewItem
            imageUrl={card.imageUrl}
            imageSize={24}
            key={card.id}
            dense
          />
        ))}
      </CollectionPreviewList>

      <Separator className="mt-5 mb-2.5 bg-border/15 rounded-full" />
    </div>

    <CollectionEditForm
      collection={collection}
      key={collection.updatedAt.toString()}
    />
  </div>
)

const CollectionEditSkeleton = () => (
  <div className="space-y-10 max-md:p-5">
    <div className="w-1/3 mx-auto">
      <Skeleton className="w-full max-w-48 mx-auto h-8 bg-muted-foreground/50" />

      <CollectionPreviewList className="pt-1.5 justify-center" dense>
        {Array(8).fill('').map((_, index) => (
          <CollectionPreviewItem
            imageUrl={null}
            imageSize={24}
            key={index}
            dense
          >
            <Skeleton className="size-7 bg-muted-foreground/20 rounded-full" />
          </CollectionPreviewItem>
        ))}
      </CollectionPreviewList>
    </div>

    <div className="space-y-4">
      <Skeleton className="w-full max-w-96 h-10 mx-auto rounded-xl bg-muted-foreground/50" />
      <Skeleton className="w-full max-w-96 h-10 mx-auto rounded-xl bg-muted-foreground/50" />
    </div>
  </div>
)

export default CollectionEditPopup
