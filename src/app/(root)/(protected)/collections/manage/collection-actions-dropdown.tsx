"use client"

import { useState } from "react"

// icons
import { Edit3, ImageMinus, Loader2 } from "lucide-react"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// components
import CollectionDeleteWarning from "./collection-delete-warning"

// hooks
import { useDeleteCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionActionsDropdownProps = {
  collection: ClientCardCollection
} & React.ComponentProps<typeof DropdownMenuTrigger>

const CollectionActionsDropdown = ({ collection, ...props }: CollectionActionsDropdownProps) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false)

  const { deleteCollection } = useDeleteCollectionMutation()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger {...props} asChild />

        <DropdownMenuContent>
          <DropdownMenuItem
            variant="muted"
            onClick={() => {}} // TODO: implement ui for editing
          >
            <Edit3 className="size-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowDeleteWarning(true)}
            disabled={deleteCollection.isPending}
          >
            {deleteCollection.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImageMinus className="size-4" />
            )}
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CollectionDeleteWarning
        collection={collection}
        open={showDeleteWarning}
        onOpenChange={() => setShowDeleteWarning(false)}
      />
    </>
  )
}

export default CollectionActionsDropdown
