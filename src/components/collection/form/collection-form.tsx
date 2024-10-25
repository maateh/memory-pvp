"use client"

// types
import type { z } from "zod"

// constants
import { collectionSizeEndpointMap } from "@/constants/collection"

// utils
import { handleApiError, logError } from "@/lib/utils"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createCollectionClientSchema } from "@/lib/validations/collection-schema"

// shadcn
import { Form } from "@/components/ui/form"

// components
import CollectionFormFields from "./collection-form-fields"

// hooks
import { useForm } from "react-hook-form"
import { useUploadThing } from "@/hooks/use-upload-thing"
import { useCreateCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionFormValues = z.infer<typeof createCollectionClientSchema>

const CollectionForm = () => {
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(createCollectionClientSchema),
    defaultValues: {
      name: '',
      description: '',
      tableSize: 'SMALL',
      images: []
    }
  })

  const tableSize = form.watch('tableSize')

  const { createCollection, handleCreateCollection } = useCreateCollectionMutation()

  const { startUpload, routeConfig, isUploading } = useUploadThing(collectionSizeEndpointMap[tableSize], {
    onClientUploadComplete: async (files) => {
      const utImages = files.map(({ key, url }) => ({
        utKey: key,
        imageUrl: url
      }))

      await handleCreateCollection({ ...form.getValues(), utImages })
    },
    onUploadError: (err) => {
      let description = "Failed to create card collection. Please try again later."

      if (err.code === "FILE_LIMIT_EXCEEDED") {
        description = "Sorry, but due to limitations, only one card collection can be uploaded per account."
      }

      handleApiError(err, description)
    }
  })

  const onSubmit = async (values: CollectionFormValues) => {
    const { images, ...data } = values

    try {
      await startUpload(images, data)
    } catch (err) {
      logError(err)
    }
  }

  return (
    <Form {...form}>
      <form className="mt-5 flex flex-col gap-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CollectionFormFields
          form={form}
          routeConfig={routeConfig}
          isPending={isUploading || createCollection.isPending}
          disabled={isUploading || createCollection.isPending}
        />
      </form>
    </Form>
  )
}

export default CollectionForm
export type { CollectionFormValues }
