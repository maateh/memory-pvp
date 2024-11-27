"use client"

import { useForm } from "react-hook-form"

// types
import type { z } from "zod"

// utils
import { logError } from "@/lib/utils"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { updateCollectionSchema } from "@/lib/validations/collection-schema"

// icons
import { Edit3, Loader2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { Form } from "@/components/shared"
import CollectionEditFormFields from "./collection-edit-form-fields"

// hooks
import { useUpdateCollectionAction } from "@/lib/safe-action/collection"

type CollectionEditFormValues = z.infer<typeof updateCollectionSchema>

type CollectionEditFormProps = {
  collection: ClientCardCollection
}

const CollectionEditForm = ({ collection }: CollectionEditFormProps) => {
  const form = useForm<CollectionEditFormValues>({
    resolver: zodResolver(updateCollectionSchema),
    defaultValues: collection
  })

  const {
    executeAsync: executeUpdateCollection,
    status: updateCollectionStatus
  } = useUpdateCollectionAction()

  const handleExecute = async (values: CollectionEditFormValues) => {
    if (
      values.name === collection.name &&
      values.description === collection.description
    ) {
      form.reset()
      return
    }

    try {
      await executeUpdateCollection(values)
      form.reset()
    } catch (err) {
      logError(err)
    }
  }

  return (
    <Form<CollectionEditFormValues>
      className="mt-5"
      form={form}
      onSubmit={handleExecute}
    >
      <CollectionEditFormFields form={form} />

      <Button className="flex gap-x-2 rounded-2xl max-sm:mx-auto sm:ml-auto"
        variant="secondary"
        size="sm"
        type="submit"
        disabled={updateCollectionStatus === 'executing'}
      >
        {updateCollectionStatus === 'executing' ? (
          <Loader2 className="size-4 shrink-0 animate-spin" />
        ) : (
          <Edit3 className="size-4 shrink-0" />
        )}

        <span>Update collection</span>
      </Button>
    </Form>
  )
}

export default CollectionEditForm
export type { CollectionEditFormValues }
