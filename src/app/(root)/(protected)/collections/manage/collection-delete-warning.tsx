"use client"

// types
import type { DialogProps } from "@radix-ui/react-dialog"

// icons
import { Images } from "lucide-react"

// shadcn
import { Separator } from "@/components/ui/separator"

// components
import {
  WarningActionButton,
  WarningCancelButton,
  WarningModal,
  WarningModalFooter
} from "@/components/shared"
import { CollectionPreviewDenseItem, CollectionPreviewDenseList } from "@/components/collection"

// hooks
import { useDeleteCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionDeleteWarningProps = {
  collection: ClientCardCollection
} & DialogProps

const CollectionDeleteWarning = ({ collection, ...props }: CollectionDeleteWarningProps) => {
  const { deleteCollection, handleDeleteCollection } = useDeleteCollectionMutation()

  return (
    <WarningModal
      title="Delete card collection"
      description="Are you sure you want to delete this card collection?"
      {...props}
    >
      <div className="grid gap-y-1.5 sm:gap-y-2">
        <p className="mx-auto mt-1 text-xl sm:text-2xl font-heading font-semibold tracking-wide">
          {collection.name}
        </p>

        <CollectionPreviewDenseList>
          {collection.cards.map((card) => (
            <CollectionPreviewDenseItem
              imageUrl={card.imageUrl}
              imageSize={36}
              key={card.id}
            />
          ))}
        </CollectionPreviewDenseList>
      </div>

      <Separator className="w-1/5 mx-auto bg-border/15" />

      <WarningModalFooter>
        <WarningCancelButton className="text-destructive/85 border-destructive/40 hover:text-destructive/90 hover:bg-destructive/15 dark:hover:bg-destructive/10"
          onClick={() => props.onOpenChange && props.onOpenChange(false)}
        >
          Cancel
        </WarningCancelButton>

        <WarningActionButton
          onClick={() => handleDeleteCollection({
            collectionId: collection.id,
            closeDialog: () => props.onOpenChange
          })}
          disabled={deleteCollection.isPending}
        >
          Delete
        </WarningActionButton>
      </WarningModalFooter>
    </WarningModal>
  )
}

export default CollectionDeleteWarning
