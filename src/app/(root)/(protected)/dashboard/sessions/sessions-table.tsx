"use client"

import { useState } from "react"

// types
import type { SortingState, VisibilityState } from "@tanstack/react-table"

// react-table
import { getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"

// constants
import { columns } from "./columns"

// shadcn
import { DataTable } from "@/components/ui/data-table"

// components
import { SessionCardList } from "@/components/session/card"

type SessionsTableProps = {
  sessions: ClientGameSession[]
}

const SessionsTable = ({ sessions }: SessionsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    columns,
    data: sessions,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility }
  })
  
  return (
    <>
      <div className="block xl:hidden">
        <SessionCardList sessions={sessions} />
      </div>

      <div className="hidden xl:block">
        <DataTable table={table} />
      </div>
    </>
  )
}

export default SessionsTable
