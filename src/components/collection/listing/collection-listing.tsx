"use client"

import { useState } from "react"

// types
import type { SortingState, VisibilityState } from "@tanstack/react-table"

// react-table
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// constants
import { columns } from "./table-columns"

// utils
import { cn } from "@/lib/util"

// shadcn
import { DataTable } from "@/components/ui/data-table"

// components
import { CollectionCard } from "@/components/collection/listing"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

type CollectionListingMetadata = {
  type: "listing" | "manage"
}

type CollectionListingProps = {
  collections: ClientCardCollection[]
  metadata: CollectionListingMetadata
  imageSize?: number
}

const CollectionListing = ({ collections, metadata, imageSize }: CollectionListingProps) => {
  const { open: sidebarOpen } = useSidebar()

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
    // TODO: create a generally reusable `NoData` component
    return "No data to display."
  }
  
  return (
    <>
      <ul className={cn("flex flex-wrap gap-8 md:hidden lg:hidden xl:hidden", {
        "md:flex 2xl:hidden": sidebarOpen,
        "xl:flex": sidebarOpen && metadata.type === "manage",
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
        "xl:hidden": sidebarOpen && metadata.type === "manage",
      })}>
        <DataTable table={table} />
      </div>
    </>
  )
}

export default CollectionListing
export type { CollectionListingMetadata }
