import Link from "next/link"

// types
import type { CollectionListingMetadata } from "./collection-listing"
import type { ClientCardCollection } from "@/lib/types/client"

// utils
import { cn } from "@/lib/util"

// icons
import { Edit3, EllipsisVertical, ImageMinus } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

// components
import { CollectionQuickSetupLink } from "@/components/collection"

type CollectionActionsProps = {
  collection: ClientCardCollection
  metadata: CollectionListingMetadata
} & React.ComponentProps<typeof Button>

const CollectionActions = ({
  collection,
  metadata,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: CollectionActionsProps) => {
  if (metadata.type === "listing") {
    return (
      <CollectionQuickSetupLink className={cn("text-foreground/75 hover:text-foreground/85", className)}
        collectionId={collection.id}
        variant={variant}
        size={size}
        {...props}
      />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("p-1.5", className)}
          tooltip="Show actions"
          variant={variant}
          size={size}
          {...props}
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
