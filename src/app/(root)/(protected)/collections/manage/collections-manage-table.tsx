"use client"

import { useState } from "react"

// types
import type { SortingState } from "@tanstack/react-table"

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

  const table = useReactTable({
    columns,
    data: collections,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    }
  })
  
  return <DataTable table={table} />
}

export default CollectionsManageTable
