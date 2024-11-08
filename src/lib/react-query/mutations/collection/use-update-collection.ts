import { useRouter } from "next/navigation"

import { toast } from "sonner"

// trpc
import { api } from "@/trpc/client"

// utils
import { logError, handleApiError } from "@/lib/utils"

type HandleUpdateCollectionParams = {
  collection: Pick<ClientCardCollection, 'id' | 'name' | 'description'>
  updatedCollection: Partial<Pick<ClientCardCollection, 'name' | 'description'>>
  resetForm: () => void
}

export const useUpdateCollectionMutation = () => {
  const router = useRouter()

  const updateCollection = api.collection.update.useMutation({
    onSuccess: async ({ name }) => {
      toast.success('Collection updated!', {
        description: `New name of your card collection: ${name}`
      })

      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to update card collection. Please try again later.')
    }
  })

  const handleUpdateCollection = async ({ collection, updatedCollection, resetForm }: HandleUpdateCollectionParams) => {
    const { name, description } = updatedCollection

    if (name === collection.name && description === collection.description) {
      resetForm()
      return
    }

    try {
      await updateCollection.mutateAsync({
        id: collection.id,
        name, description
      })

      resetForm()
    } catch (err) {
      logError(err)
    }
  }

  return { updateCollection, handleUpdateCollection }
}
