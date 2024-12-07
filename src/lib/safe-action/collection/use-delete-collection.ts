import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// actions
import { deleteCollection } from "@/server/actions/collection"

// utils
import { handleServerError } from "@/lib/utils/error"

export const useDeleteCollectionAction = () => {
  const router = useRouter()

  return useAction(deleteCollection, {
    onSuccess({ data: collection }) {
      if (!collection) return
  
      toast.warning('Card collection deleted!', {
        description: `Deleted collection name: ${collection.name}`
      })
  
      router.back()
    },
    onError({ error }) {
      handleServerError(error.serverError, 'Failed to delete card collection. Please try again later.')
    }
  })
}
