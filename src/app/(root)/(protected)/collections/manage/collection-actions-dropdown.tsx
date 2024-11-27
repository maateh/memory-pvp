"use client"

import { useRouter } from "next/navigation"

// icons
import { Edit3, ImageMinus } from "lucide-react"

// shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

type CollectionActionsDropdownProps = {
  collection: ClientCardCollection
} & React.ComponentProps<typeof DropdownMenuTrigger>

const CollectionActionsDropdown = ({ collection, ...props }: CollectionActionsDropdownProps) => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props} asChild />

      <DropdownMenuContent>
        <DropdownMenuItem
          variant="muted"
          onClick={() => router.push(`/collections/${collection.id}/edit`)}
        >
          <Edit3 className="size-4 shrink-0" />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onClick={() => router.push(`/collections/${collection.id}/delete`)}
        >
          <ImageMinus className="size-4 shrink-0" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CollectionActionsDropdown
