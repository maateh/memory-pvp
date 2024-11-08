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
import CollectionEditModal from "./collection-edit-modal"
import CollectionDeleteWarning from "./collection-delete-warning"

// hooks
import { useDeleteCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionActionsDropdownProps = {
  collection: ClientCardCollection
} & React.ComponentProps<typeof DropdownMenuTrigger>

const CollectionActionsDropdown = ({ collection, ...props }: CollectionActionsDropdownProps) => {
  const [showEditPopover, setShowEditPopover] = useState<boolean>(false)
  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false)

  const { deleteCollection } = useDeleteCollectionMutation()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger {...props} asChild />

        <DropdownMenuContent>
          <DropdownMenuItem
            variant="muted"
            onClick={() => setShowEditPopover(true)}
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

      <CollectionEditModal
        collection={collection}
        open={showEditPopover}
        onOpenChange={() => setShowEditPopover(false)}      
      />

      <CollectionDeleteWarning
        collection={collection}
        open={showDeleteWarning}
        onOpenChange={() => setShowDeleteWarning(false)}
      />
    </>
  )
}

export default CollectionActionsDropdown
