import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { logError, handleApiError } from "@/lib/utils"

type HandleDeleteCollectionParams = {
  collectionId: string
  closeDialog: () => void
}

export const useDeleteCollectionMutation = () => {
  const router = useRouter()

  const deleteCollection = api.collection.delete.useMutation({
    onSuccess: ({ name }) => {
      toast.warning('Collection deleted!', {
        description: `Card collection with the following name has been deleted: ${name}`
      })

      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to delete card collection. Please try again later.')
    }
  })

  const handleDeleteCollection = async ({ collectionId, closeDialog }: HandleDeleteCollectionParams) => {
    try {
      await deleteCollection.mutateAsync({ id: collectionId })
      closeDialog()
    } catch (err) {
      logError(err)
    }
  }

  return { deleteCollection, handleDeleteCollection }
}
