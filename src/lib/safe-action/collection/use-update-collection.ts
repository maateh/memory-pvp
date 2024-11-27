import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { updateCollection } from "@/server/actions/collection"

// utils
import { handleActionError } from "@/lib/utils"

export const useUpdateCollectionAction = () => useAction(updateCollection, {
  onSuccess({ data: collection }) {
    if (!collection) return

    toast.success('Card collection updated!', {
      description: `Updated collection name: ${collection.name}`
    })
  },
  onError({ error }) {
    handleActionError(error.serverError, 'Failed to update card collection. Please try again later.')
  }
})
