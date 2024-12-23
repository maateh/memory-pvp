import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

// types
import type { TableSize } from "@prisma/client"

// actions
import { createCollection } from "@/server/action/collection-action"

// config
import { collectionSizeEndpointMap } from "@/config/collection-settings"
import { tableSizePlaceholders } from "@/config/game-settings"

// utils
import { handleServerError } from "@/lib/util/error"

// hooks
import { useUploadThing } from "@/hooks/use-upload-thing"

type UseCreateCollectionActionParams = {
  tableSize: TableSize
}

export const useCreateCollectionAction = ({ tableSize }: UseCreateCollectionActionParams) => {
  const createCollectionAction = useAction(createCollection, {
    onSuccess({ input: collection }) {
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
    onClientUploadComplete: () => {
      toast.info("Card images uploaded!", {
        description: "Now we are going to create the card collection..."
      })
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
