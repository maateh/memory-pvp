"use client"

import { useState } from "react"

// types
import type { SortingState, VisibilityState } from "@tanstack/react-table"
import type { ClientCardCollection } from "@repo/schema/collection"

// react-table
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// constants
import { columns } from "./table-columns"

// utils
import { cn } from "@/lib/util"

// icons
import { ImageOff } from "lucide-react"

// shadcn
import { DataTable } from "@/components/ui/data-table"

// components
import { CollectionCard, CollectionCardSkeleton } from "@/components/collection/listing"
import { CardItem, NoListingData } from "@/components/shared"

// hooks
import { useSidebar } from "@/components/ui/sidebar"
import { TableSkeleton } from "@/components/ui/table"

type CollectionListingMetadata = {
  type: "listing" | "manage"
}

type CollectionListingProps = {
  collections: ClientCardCollection[]
  metadata: CollectionListingMetadata
  imageSize?: number
}

const CollectionListing = ({ collections, metadata, imageSize }: CollectionListingProps) => {
  const { open: sidebarOpen } = useSidebar({ provideFallback: true })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "Owner": metadata.type === "listing",
    "Created at": metadata.type === "manage",
    "Updated at": false
  })

  const table = useReactTable({
    columns,
    data: collections,
    meta: metadata,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility }
  })

  if (collections.length === 0) {
    return (
      <NoListingData className="mt-44"
        Icon={ImageOff}
        message="No collection found."
      />
    )
  }
  
  return (
    <>
      <ul className={cn("flex flex-wrap gap-8 md:hidden lg:hidden xl:hidden", {
        "md:flex 2xl:hidden": sidebarOpen,
        "xl:flex": sidebarOpen && metadata.type === "manage"
      })}>
        {collections.map((collection) => (
          <li className="flex-1 min-w-52 md:min-w-80" key={collection.id}>
            <CollectionCard
              collection={collection}
              metadata={metadata}
              imageSize={imageSize}
              key={collection.id}
              showActions
            />
          </li>
        ))}
      </ul>

      <div className={cn("hidden md:block lg:block xl:block", {
        "md:hidden 2xl:block": sidebarOpen,
        "xl:hidden": sidebarOpen && metadata.type === "manage"
      })}>
        <DataTable table={table} />
      </div>
    </>
  )
}

const CollectionListingSkeleton = () => (
  <>
    <ul className="space-y-6 block 2xl:hidden">
      {Array.from({ length: 4 }).fill('').map((_, index) => (
        <CollectionCardSkeleton key={index} />
      ))}
    </ul>

    <div className="hidden 2xl:block">
      <TableSkeleton columns={6} rows={7} />
    </div>
  </>
)

export default CollectionListing
export { CollectionListingSkeleton }
export type { CollectionListingMetadata }
