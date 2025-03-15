// types
import type { ColumnDef } from "@tanstack/react-table"
import type { WaitingRoom } from "@repo/schema/room"

// schemas
import { sessionSort } from "@repo/schema/session"

// config
import {
  matchFormatPlaceholders,
  sessionModePlaceholders,
  tableSizePlaceholders
} from "@repo/config/game"

// icons
import { CalendarClock, Dices, Gamepad2 } from "lucide-react"

// shadcn
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"

// components
import { CustomDate } from "@/components/shared"
import { PlayerBadge } from "@/components/player"
import { SessionInfoBadge, SessionBadge } from "@/components/session"
import { RoomJoinButton } from "@/components/room"

export const columns: ColumnDef<WaitingRoom>[] = [
  {
    id: "Owner",
    accessorKey: "owner",
    enableHiding: true,
    header: "Owner",
    cell({ getValue }) {
      const owner = getValue<WaitingRoom["owner"]>()

      return (
        <PlayerBadge className="w-fit"
          size="lg"
          player={owner}
        />
      )
    }
  },
  {
    id: "Settings",
    accessorKey: "settings",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          sortSchema={sessionSort}
          header="Settings"
          sortValueKey="mode"
        />
      )
    },
    cell({ getValue }) {
      const { mode, format } = getValue<WaitingRoom["settings"]>()

      return (
        <SessionInfoBadge className="py-0 text-xs"
          iconProps={{ className: "size-3.5" }}
          Icon={Gamepad2}
          label={sessionModePlaceholders[mode].label}
          subLabel={matchFormatPlaceholders[format].label}
        />
      )
    },
  },
  {
    id: "Table size",
    accessorKey: "settings",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          sortSchema={sessionSort}
          header="Table size"
          sortValueKey="tableSize"
        />
      )
    },
    cell({ getValue }) {
      const { tableSize } = getValue<WaitingRoom["settings"]>()

      return (
        <SessionInfoBadge className="py-0 text-xs"
          iconProps={{ className: "size-3.5" }}
          Icon={Dices}
          label={tableSizePlaceholders[tableSize].label}
          subLabel={tableSizePlaceholders[tableSize].size}
        />
      )
    }
  },
  {
    id: "Room",
    accessorKey: "slug",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          sortSchema={sessionSort}
          header="Session"
          sortValueKey="status"
        />
      )
    },
    cell({ getValue }) {
      const slug = getValue<WaitingRoom["slug"]>()

      return (
        <SessionBadge className="text-xs"
          session={{ slug, status: "RUNNING" }}
        />
      )
    },
  },
  {
    id: "Created at",
    accessorKey: "createdAt",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          sortSchema={sessionSort}
          header="Created at"
          sortValueKey="createdAt"
        />
      )
    },
    cell({ getValue }) {
      const date = getValue<WaitingRoom["createdAt"]>()

      return (
        <CustomDate
          date={date}
          Icon={CalendarClock}
        />
      )
    },
  },
  {
    id: "Actions",
    enableHiding: false,
    header({ table }) {
      return <DataTableColumnToggle table={table} />
    },
    cell({ row }) {
      const { slug } = row.original

      return <RoomJoinButton roomSlug={slug} />
    }
  }
]
