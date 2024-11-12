"use client"

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
import { useForm } from "react-hook-form"
import { useUpdateCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionEditFormValues = z.infer<typeof updateCollectionSchema>

type CollectionEditFormProps = {
  collection: ClientCardCollection
  resetForm?: () => void
}

const CollectionEditForm = ({ collection, resetForm }: CollectionEditFormProps) => {
  const form = useForm<CollectionEditFormValues>({
    resolver: zodResolver(updateCollectionSchema),
    defaultValues: collection
  })

  const { updateCollection, handleUpdateCollection } = useUpdateCollectionMutation()

  const onSubmit = async (values: CollectionEditFormValues) => {
    try {
      await handleUpdateCollection({
        collection,
        updatedCollection: values,
        resetForm: () => {
          form.reset()
          resetForm?.()
        }
      })
    } catch (err) {
      logError(err)
    }
  }

  return (
    <Form<CollectionEditFormValues>
      className="mt-5"
      form={form}
      onSubmit={onSubmit}
    >
      <CollectionEditFormFields form={form} />

      <Button className="flex gap-x-2 rounded-2xl max-sm:mx-auto sm:ml-auto"
        variant="secondary"
        size="sm"
        type="submit"
        disabled={updateCollection.isPending}
      >
        {updateCollection.isPending ? (
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