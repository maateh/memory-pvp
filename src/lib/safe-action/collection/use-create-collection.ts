import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { UseFormReturn } from "react-hook-form"
import type { CollectionFormValues } from "@/components/collection/form/collection-form"

// actions
import { createCollection } from "@/server/actions/collection"

// config
import { collectionSizeEndpointMap } from "@/config/collection-settings"
import { tableSizePlaceholders } from "@/constants/game"

// utils
import { handleServerError, logError } from "@/lib/utils/error"

// hooks
import { useUploadThing } from "@/hooks/use-upload-thing"

type UseCreateCollectionActionParams = {
  form: UseFormReturn<CollectionFormValues>
}

export const useCreateCollectionAction = ({ form }: UseCreateCollectionActionParams) => {
  const tableSize = form.watch('tableSize')

  const createCollectionAction = useAction(createCollection, {
    onSuccess({ data: collection }) {
      if (!collection) return
  
      const placeholder = tableSizePlaceholders[collection.tableSize]
      toast.success('Card collection created!', {
        description: `You have created a new card collection! (${placeholder.label} / ${placeholder.size})`
      })
    },
    onError({ error }) {
      handleServerError(error.serverError, 'Failed to create card collection. Please try again later.')
    }
  })

  const upload = useUploadThing(collectionSizeEndpointMap[tableSize], {
    onClientUploadComplete: async (files) => {
      toast.info("Card images uploaded!", {
        description: "Now we are going to create the card collection..."
      })

      try {
        await createCollectionAction.executeAsync({
          ...form.getValues(),
          utImages: files.map(({ key, url }) => ({
            utKey: key,
            imageUrl: url
          }))
        })

        form.reset() 
      } catch (err) {
        logError(err)
      }
    },
    onUploadError: (err) => {
      let description = "Failed to create card collection. Please try again later."

      if (err.code === "FILE_LIMIT_EXCEEDED") {
        description = "Sorry, but due to limitations, only one card collection can be uploaded per account."
      }

      handleServerError(err, description)
    }
  })

  return { ...createCollectionAction, ...upload }
}
