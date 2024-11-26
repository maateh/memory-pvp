"use client"

import { useRouter } from "next/navigation"

// icons
import { Edit3, ImageMinus, Loader2 } from "lucide-react"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// hooks
import { useDeleteCollectionMutation, useUpdateCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionActionsDropdownProps = {
  collection: ClientCardCollection
} & React.ComponentProps<typeof DropdownMenuTrigger>

const CollectionActionsDropdown = ({ collection, ...props }: CollectionActionsDropdownProps) => {
  const router = useRouter()

  const { updateCollection } = useUpdateCollectionMutation()
  const { deleteCollection } = useDeleteCollectionMutation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props} asChild />

      <DropdownMenuContent>
        <DropdownMenuItem
          variant="muted"
          onClick={() => router.push(`/collections/${collection.id}/edit`)}
          disabled={updateCollection.isPending || deleteCollection.isPending}
        >
          {deleteCollection.isPending ? (
            <Loader2 className="size-4 shrink-0 animate-spin" />
          ) : (
            <Edit3 className="size-4 shrink-0" />
          )}
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onClick={() => router.push(`/collections/${collection.id}/delete`)}
          disabled={updateCollection.isPending || deleteCollection.isPending}
        >
          {deleteCollection.isPending ? (
            <Loader2 className="size-4 shrink-0 animate-spin" />
          ) : (
            <ImageMinus className="size-4 shrink-0" />
          )}
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CollectionActionsDropdown
