"use client"

import { useRouter } from "next/navigation"

// types
import type { ClientCardCollection } from "@/lib/types/client"

// utils
import { logError } from "@/lib/util/error"

// shadcn
import { Button } from "@/components/ui/button"

// hooks
import { useDeleteCollectionAction } from "@/lib/safe-action/collection"

type CollectionDeletePopupActionsProps = {
  collection: ClientCardCollection
}

const CollectionDeletePopupActions = ({ collection }: CollectionDeletePopupActionsProps) => {
  const router = useRouter()

  const {
    executeAsync: executeDeleteCollection,
    status: deleteCollectionStatus
  } = useDeleteCollectionAction()

  const handleExecute = async () => {
    try {
      await executeDeleteCollection({ id: collection.id })
      router.back()
    } catch (err) {
      logError(err)
    }
  }

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
        onClick={handleExecute}
        disabled={deleteCollectionStatus === 'executing'}
      >
        Delete
      </Button> 
    </>
  )
}

export default CollectionDeletePopupActions
