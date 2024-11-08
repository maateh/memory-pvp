"use client"

import { useState } from "react"

// types
import type { SortingState, VisibilityState } from "@tanstack/react-table"

// react-table
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// constants
import { columns } from "./columns"

// components
import { DataTable } from "@/components/ui/data-table"

type CollectionsManageTableProps = {
  collections: ClientCardCollection[]
}

const CollectionsManageTable = ({ collections }: CollectionsManageTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "Updated at": false
  })

  const table = useReactTable({
    columns,
    data: collections,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting, columnVisibility
    }
  })
  
  return <DataTable table={table} />
}

export default CollectionsManageTable
