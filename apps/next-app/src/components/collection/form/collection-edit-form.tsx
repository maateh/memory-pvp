"use client"

import { useForm } from "react-hook-form"

// types
import type { ClientCardCollection } from "@repo/schema/collection"
import type { UpdateCardCollectionValidation } from "@repo/schema/collection-validation"

// utils
import { logError } from "@/lib/util/error"

// validations
import { zodResolver } from "@hookform/resolvers/zod"
import { updateCollectionValidation } from "@repo/schema/collection-validation"

// icons
import { Edit3, Loader2 } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"

// components
import { Form } from "@/components/shared"
import CollectionEditFormFields from "./collection-edit-form-fields"

// hooks
import { useUpdateCollectionAction } from "@/lib/safe-action/collection"

type CollectionEditFormProps = {
  collection: ClientCardCollection
}

const CollectionEditForm = ({ collection }: CollectionEditFormProps) => {
  const form = useForm<UpdateCardCollectionValidation>({
    resolver: zodResolver(updateCollectionValidation),
    defaultValues: collection
  })

  const {
    executeAsync: executeUpdateCollection,
    status: updateCollectionStatus
  } = useUpdateCollectionAction()

  const handleExecute = async (values: UpdateCardCollectionValidation) => {
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
    <Form<UpdateCardCollectionValidation>
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
