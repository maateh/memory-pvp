import Link from "next/link"

// types
import type { CollectionListingMetadata } from "./collection-listing"

// icons
import { Edit3, EllipsisVertical, ImageMinus, StepForward } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

type CollectionActionsProps = {
  collection: ClientCardCollection
  metadata: CollectionListingMetadata
}

const CollectionActions = ({ collection, metadata }: CollectionActionsProps) => {
  if (metadata.type === "listing") {
    return (
      <Button className="p-1.5"
        tooltip="Start game with this collection"
        variant="ghost"
        size="icon"
        asChild
      >
        <Link href="/game/single">
          <StepForward className="size-4 sm:size-5 shrink-0 text-accent"
            strokeWidth={2.5}
          />
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-1.5"
          tooltip="Show actions"
          variant="ghost"
          size="icon"
        >
          <EllipsisVertical className="size-4 sm:size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem variant="muted" asChild>
          <Link href={`/collections/${collection.id}/edit`}>
            <Edit3 className="size-4 shrink-0" />
            <span>Edit</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" asChild>
          <Link href={`/collections/${collection.id}/delete`}>
            <ImageMinus className="size-4 shrink-0" />
            <span>Delete</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CollectionActions
