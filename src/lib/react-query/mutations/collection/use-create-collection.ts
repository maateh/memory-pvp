// types
import type { z } from "zod"
import type { createCollectionSchema } from "@/lib/validations/collection-schema"

// trpc
import { api } from "@/trpc/client"

// utils
import { handleApiError, logError } from "@/lib/utils"

export const useCreateCollectionMutation = () => {
  const createCollection = api.collection.create.useMutation({
    onSuccess: () => {
      // TODO: show toast
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
