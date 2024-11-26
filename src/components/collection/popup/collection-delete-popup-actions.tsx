"use client"

import { useRouter } from "next/navigation"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useDeleteCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionDeletePopupActionsProps = {
  collection: ClientCardCollection
}

const CollectionDeletePopupActions = ({ collection }: CollectionDeletePopupActionsProps) => {
  const router = useRouter()

  const { deleteCollection, handleDeleteCollection } = useDeleteCollectionMutation()

  return (
    <>
      <Button className="min-w-32"
        variant="outline"
        onClick={router.back}
      >
        Cancel
      </Button>

      <Button className="min-w-32"
        variant="destructive"
        onClick={() => handleDeleteCollection({
          collectionId: collection.id,
          closeDialog: router.back
        })}
        disabled={deleteCollection.isPending}
      >
        Delete
      </Button> 
    </>
  )
}

export default CollectionDeletePopupActions
