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

type CollectionListingMetadata = {
  type: "listing" | "manage"
}

type CollectionListingProps = {
  collections: ClientCardCollection[]
  metadata: CollectionListingMetadata
}

const CollectionListing = ({ collections, metadata }: CollectionListingProps) => {
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
      <div className="block xl:hidden">
        {/* TODO: add `Collection(Explorer)Card` -> needs to be refactored (!) */}
      </div>

      <div className="hidden xl:block">
        <DataTable table={table} />
      </div>
    </>
  )
}

export default CollectionListing
export type { CollectionListingMetadata }
