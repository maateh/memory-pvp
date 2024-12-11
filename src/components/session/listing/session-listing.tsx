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
import { TableSkeleton } from "@/components/ui/table"

// components
import { SessionCard, SessionCardSkeleton } from "@/components/session/listing"
import { CardItem } from "@/components/shared"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

type SessionListingProps = {
  sessions: ClientGameSession[]
}

const SessionListing = ({ sessions }: SessionListingProps) => {
  const { open: sidebarOpen } = useSidebar()

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

  if (sessions.length === 0) {
    // TODO: create a generally reusable `NoData` component
    return "No data to display."
  }
  
  return (
    <>
      <ul className={cn("block space-y-3 md:hidden lg:hidden xl:hidden", {
        "md:block lg:block xl:block 2xl:hidden": sidebarOpen
      })}>
        {sessions.map((session) => (
          <CardItem key={session.slug}>
            <SessionCard session={session} key={session.slug} />
          </CardItem>
        ))}
      </ul>

      <div className={cn("hidden md:block lg:block xl:block", {
        "md:hidden lg:hidden xl:hidden 2xl:block": sidebarOpen
      })}>
        <DataTable table={table} />
      </div>
    </>
  )
}

const SessionListingSkeleton = () => (
  <>
    <ul className="space-y-3 block lg:hidden">
      {Array.from({ length: 4 }).fill('').map((_, index) => (
        <CardItem key={index}>
          <SessionCardSkeleton />
        </CardItem>
      ))}
    </ul>

    <div className="hidden lg:block">
      <TableSkeleton columns={6} rows={7} />
    </div>
  </>
)

export default SessionListing
export { SessionListingSkeleton }
