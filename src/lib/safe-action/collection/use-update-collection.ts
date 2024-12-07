import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { updateCollection } from "@/server/action/collection-action"

// utils
import { handleServerError } from "@/lib/util/error"

export const useUpdateCollectionAction = () => useAction(updateCollection, {
  onSuccess({ data: collection }) {
    if (!collection) return

    toast.success('Card collection updated!', {
      description: `Updated collection name: ${collection.name}`
    })
  },
  onError({ error }) {
    handleServerError(error.serverError, 'Failed to update card collection. Please try again later.')
  }
})
