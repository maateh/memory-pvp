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

type SessionsTableProps = {
  sessions: ClientGameSession[]
} & Omit<React.ComponentProps<typeof DataTable>, 'table'>

const SessionsTable = ({ sessions, ...props }: SessionsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    columns,
    data: sessions,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting, columnVisibility
    }
  })
  
  return <DataTable table={table} {...props} />
}

export default SessionsTable
