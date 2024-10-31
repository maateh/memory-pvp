import { useRouter } from "next/navigation"
import { toast } from "sonner"

// types
import type { z } from "zod"
import type { createCollectionSchema } from "@/lib/validations/collection-schema"

// constants
import { tableSizePlaceholders } from "@/constants/game"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError, logError } from "@/lib/utils"

type UseCreateCollectionMutationParams = {
  onAfterSuccess?: () => void
}

export const useCreateCollectionMutation = ({ onAfterSuccess }: UseCreateCollectionMutationParams) => {
  const router = useRouter()

  const createCollection = api.collection.create.useMutation({
    onSuccess: ({ tableSize }) => {
      const placeholder = tableSizePlaceholders[tableSize]

      toast.success('Card collection created!', {
        description: `You've created a new card collection for this table size: ${placeholder.label} (${placeholder.size})`
      })

      onAfterSuccess?.()
      router.refresh()
    },
    onError: (err) => {
      handleApiError(err.shape?.cause, 'Failed to create card collection. Please try again later.')
    }
  })

  const handleCreateCollection = async (values: z.infer<typeof createCollectionSchema>) => {
    try {
      await createCollection.mutateAsync(values)
    } catch (err) {
      logError(err)
    }
  }

  return { createCollection, handleCreateCollection }
}
