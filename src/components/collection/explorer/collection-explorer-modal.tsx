"use client"

import { useRouter } from "next/navigation"

// constants
import { collectionSortOptions } from "@/components/collection/filter/constants"

// shadcn
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// components
import { CollectionExplorer } from "@/components/collection/explorer"
import {
  CollectionNameFilter,
  CollectionSizeFilter,
  CollectionUserToggleFilter
} from "@/components/collection/filter"
import { SortDropdownButton } from "@/components/shared"

type CollectionExplorerModalProps = {
  collections: ClientCardCollection[]
  renderer: PopupRenderer
} & React.ComponentProps<typeof DialogTrigger>


const CollectionExplorerModal = ({ renderer, collections, ...props }: CollectionExplorerModalProps) => {
  const router = useRouter()

  return (
    <Dialog
      open={renderer === 'router' || undefined}
      onOpenChange={renderer === 'router' ? router.back : undefined}
    >
      {renderer === 'trigger' && <DialogTrigger {...props} />}

      <DialogContent className="xl:max-w-screen-lg">
        <DialogHeader className="space-y-0">
          <DialogTitle className="text-2xl sm:text-3xl font-heading heading-decorator">
            Browse collections
          </DialogTitle>

          <DialogDescription className="font-light text-sm">
            Browse the following card collections and choose the one you would like to play with.
          </DialogDescription>
        </DialogHeader>

        <div className="max-w-xs space-y-2">
          <CollectionNameFilter />

          <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
            <SortDropdownButton options={collectionSortOptions} />
            <CollectionSizeFilter />
            <CollectionUserToggleFilter includeByDefault />
          </div>
        </div>

        <Separator className="w-11/12 mx-auto bg-border/25" />

        <ScrollArea className="max-h-96 pr-3">
          <CollectionExplorer className="md:grid-cols-2 2xl:grid-cols-2"
            cardProps={{ imageSize: 36 }}
            collections={collections}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CollectionExplorerModal
