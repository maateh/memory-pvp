import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { deleteCollection } from "@/server/action/collection-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useDeleteCollectionAction = () => useAction(deleteCollection, {
  onSuccess({ data: collection }) {
    if (!collection) return

    toast.warning('Card collection deleted!', {
      description: `Deleted collection name: ${collection.name}`
    })  
  },
  onError({ error }) {
    handleServerError(error.serverError, 'Failed to delete card collection. Please try again later.')
  }
})
