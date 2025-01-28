"use client"

import { useState } from "react"

// types
import type { SortingState, VisibilityState } from "@tanstack/react-table"
import type { ClientPlayer } from "@repo/schema/player"
import type { WaitingRoom } from "@repo/schema/session-room"

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
import { WaitingRoomCard, WaitingRoomCardSkeleton } from "@/components/room/listing"
import { CardItem, NoListingData } from "@/components/shared"

// hooks
import { useSidebar } from "@/components/ui/sidebar"

type WaitingRoomListingMetadata = {
  guestPlayer: ClientPlayer
}

type WaitingRoomListingProps = {
  guestPlayer: ClientPlayer
  rooms: WaitingRoom[]
}

const WaitingRoomListing = ({ guestPlayer, rooms }: WaitingRoomListingProps) => {
  const { open: sidebarOpen } = useSidebar()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    meta: { guestPlayer },
    columns,
    data: rooms,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility }
  })

  if (rooms.length === 0) {
    return (
      <NoListingData className="mt-44"
        message="No room found."
      />
    )
  }
  
  return (
    <>
      <ul className={cn("block space-y-3 md:hidden lg:hidden xl:hidden", {
        "md:block lg:block xl:block 2xl:hidden": sidebarOpen
      })}>
        {rooms.map((room) => (
          <CardItem key={room.slug}>
            <WaitingRoomCard
              room={room}
              guestPlayer={guestPlayer}
              key={room.slug}
            />
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

const WaitingRoomListingSkeleton = () => (
  <>
    <ul className="space-y-3 block lg:hidden">
      {Array.from({ length: 4 }).fill('').map((_, index) => (
        <CardItem key={index}>
          <WaitingRoomCardSkeleton />
        </CardItem>
      ))}
    </ul>

    <div className="hidden lg:block">
      <TableSkeleton columns={6} rows={7} />
    </div>
  </>
)

export default WaitingRoomListing
export { WaitingRoomListingSkeleton }
export type { WaitingRoomListingMetadata }
