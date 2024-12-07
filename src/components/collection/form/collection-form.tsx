"use client"

import { useForm } from "react-hook-form"

// types
import type { z } from "zod"

// config
import { collectionMaxSizeMap, collectionMinSizeMap } from "@/config/collection-settings"

// utils
import { logError } from "@/lib/utils/error"

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

  const {
    startUpload,
    routeConfig,
    isUploading,
    status: createCollectionStatus
  } = useCreateCollectionAction({ form })

  const handleExecute = async ({ images, ...values }: CollectionFormValues) => {
    try {
      await startUpload(images, values)
    } catch (err) {
      logError(err)
    }
  }

  const tableSize = form.watch('tableSize')
  const images = form.watch('images')

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
