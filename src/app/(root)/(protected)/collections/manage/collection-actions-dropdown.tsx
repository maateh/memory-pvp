"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

// icons
import { CloudCog,  ImageMinus, Images, Loader2 } from "lucide-react"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// components
import CollectionDeleteWarning from "./collection-delete-warning"

// hooks
import { useDeleteCollectionMutation } from "@/lib/react-query/mutations/collection"

type CollectionActionsDropdownProps = {
  collection: ClientCardCollection
} & React.ComponentProps<typeof DropdownMenuTrigger>

const CollectionActionsDropdown = ({ collection, ...props }: CollectionActionsDropdownProps) => {
  const router = useRouter()
  const [showDeleteWarning, setShowDeleteWarning] = useState<boolean>(false)

  const { deleteCollection } = useDeleteCollectionMutation()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger {...props} asChild />

        <DropdownMenuContent>
          <DropdownMenuLabel className="flex items-center justify-between gap-x-8">
            <div className="flex items-center gap-x-2">
              <Separator className="h-4 w-1 rounded-full bg-border/50"
                orientation="vertical"
              />

              <p className="pt-0.5 text-base font-normal font-heading tracking-wider">
                Manage collection
              </p>
            </div>

            <CloudCog className="size-4" strokeWidth={1.5} />
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="muted"
            // TODO: open dialog rendered on server using parallel routes
            onClick={() => router.push(`/collections/${collection.id}`)}
          >
            <Images className="size-4" />
            <span>Collection info</span>
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
            <span>Delete collection</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* TODO: create a page for this component and render on server (`/collections/[collectionId]/delete`) */}
      <CollectionDeleteWarning
        collection={collection}
        open={showDeleteWarning}
        onOpenChange={() => setShowDeleteWarning(false)}
      />
    </>
  )
}

export default CollectionActionsDropdown
