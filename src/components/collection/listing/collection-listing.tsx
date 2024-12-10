"use client"

import { useState } from "react"

// types
import type { SortingState, VisibilityState } from "@tanstack/react-table"

// react-table
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// constants
import { columns } from "./table-columns"

// shadcn
import { DataTable } from "@/components/ui/data-table"

// components
import CollectionCard from "./collection-card"

type CollectionListingMetadata = {
  type: "listing" | "manage"
}

type CollectionListingProps = {
  collections: ClientCardCollection[]
  metadata: CollectionListingMetadata
  imageSize?: number
}

const CollectionListing = ({ collections, metadata, imageSize }: CollectionListingProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "Uploaded by": metadata.type === "listing",
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
      <ul className="grid xl:hidden gap-x-10 gap-y-8 ">
        {collections.map((collection) => (
          <li key={collection.id}>
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

      <div className="hidden xl:block">
        <DataTable table={table} />
      </div>
    </>
  )
}

export default CollectionListing
export type { CollectionListingMetadata }
