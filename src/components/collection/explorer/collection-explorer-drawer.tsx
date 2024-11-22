"use client"

import { useRouter } from "next/navigation"

// constants
import { collectionSortOptions } from "@/components/collection/filter/constants"

// shadcn
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
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

type CollectionExplorerDrawerProps = {
  collections: ClientCardCollection[]
  renderer: PopupRenderer
} & React.ComponentProps<typeof DrawerTrigger>

const CollectionExplorerDrawer = ({ collections, renderer, ...props }: CollectionExplorerDrawerProps) => {
  const router = useRouter()

  return (
    <Drawer
      open={renderer === 'router' || undefined}
      onOpenChange={renderer === 'router' ? router.back : undefined}
    >
      {renderer === 'trigger' && <DrawerTrigger {...props} />}

      <DrawerContent className="max-h-[80vh] border-border/25">
        <DrawerHeader className="gap-y-0">
          <DrawerTitle className="mt-2 text-2xl font-heading heading-decorator">
            Browse collections
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground font-light">
            Browse the following card collections and choose the one you would like to play with.
          </DrawerDescription>
        </DrawerHeader>

        <div className="max-w-xs px-6 space-y-2">
          <CollectionNameFilter />

          <div className="mt-1 flex items-center gap-x-2 sm:gap-x-3.5">
            <SortDropdownButton options={collectionSortOptions} />
            <CollectionSizeFilter />
            <CollectionUserToggleFilter includeByDefault />
          </div>
        </div>

        <Separator className="w-11/12 mx-auto my-5 bg-border/25" />

        <ScrollArea className="h-auto px-3 mb-4 overflow-y-auto">
          <CollectionExplorer className="md:grid-cols-2 2xl:grid-cols-2"
            cardProps={{ imageSize: 36 }}
            collections={collections}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

export default CollectionExplorerDrawer
