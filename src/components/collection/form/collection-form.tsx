"use client"

import { useForm } from "react-hook-form"
import { UploadThingError } from "uploadthing/server"

// types
import type { z } from "zod"

// config
import { collectionMaxSizeMap, collectionMinSizeMap } from "@/config/collection-settings"

// utils
import { handleServerError, logError } from "@/lib/util/error"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { createCollectionClientSchema } from "@/lib/schema/validation/collection-validation"

// components
import { Form } from "@/components/shared"
import CollectionFormFields from "./collection-form-fields"

// hooks
import { useCreateCollectionAction } from "@/lib/safe-action/collection"

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
  const images = form.watch('images')

  const {
    startUpload,
    routeConfig,
    isUploading,
    executeAsync: executeCreateCollection,
    status: createCollectionStatus
  } = useCreateCollectionAction({ tableSize })

  const handleExecute = async ({ images, ...values }: CollectionFormValues) => {
    try {
      const files = await startUpload(images, values)
      
      if (!files) {
        throw new UploadThingError({
          code: "UPLOAD_FAILED",
          message: "Failed to create card collection."
        })
      }

      await executeCreateCollection({
        ...values,
        utImages: files.map(({ key, url }) => ({
          utKey: key,
          imageUrl: url
        }))
      })

      form.reset()
    } catch (err) {
      if (err instanceof UploadThingError) {
        handleServerError(err, "Something unexpected happened while uploading the files. Please try again later.")
      }

      logError(err)
    }
  }

  return (
    <Form<CollectionFormValues>
      className="mt-5"
      form={form}
      onSubmit={handleExecute}
    >
      <CollectionFormFields
        form={form}
        routeConfig={routeConfig}
        isPending={isUploading || createCollectionStatus === 'executing'}
        disabled={
          isUploading || 
          createCollectionStatus === 'executing' || 
          images.length < collectionMinSizeMap[tableSize] ||
          images.length > collectionMaxSizeMap[tableSize]
        }
      />
    </Form>
  )
}

export default CollectionForm
export type { CollectionFormValues }
