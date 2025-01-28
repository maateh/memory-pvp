// types
import type { ColumnDef } from "@tanstack/react-table"
import type { WaitingRoom } from "@repo/schema/session-room"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// icons
import { CalendarClock, Dices, Gamepad2, PlayCircle } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"

// components
import { PlayerBadge } from "@/components/player"
import { SessionInfoBadge, SessionBadge } from "@/components/session"
import { CustomDate } from "@/components/shared"

export const columns: ColumnDef<WaitingRoom>[] = [
  {
    id: "Owner",
    accessorKey: "owner",
    enableHiding: true,
    header: "Owner",
    cell({ getValue }) {
      const owner = getValue<WaitingRoom['owner']>()

      return (
        <PlayerBadge className="w-fit"
          size="lg"
          player={owner}
        />
      )
    }
  },
  {
    id: "Type / Mode",
    accessorKey: "settings",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Type / Mode"
          sortValueKey="type"
        />
      )
    },
    cell({ getValue }) {
      const settings = getValue<WaitingRoom['settings']>()

      return (
        <SessionInfoBadge className="py-0 text-xs"
          iconProps={{ className: "size-3.5" }}
          Icon={Gamepad2}
          label={gameTypePlaceholders[settings.type].label}
          subLabel={gameModePlaceholders[settings.mode].label}
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
          header="Table size"
          sortValueKey="tableSize"
        />
      )
    },
    cell({ getValue }) {
      const { tableSize } = getValue<WaitingRoom['settings']>()

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
          header="Session"
          sortValueKey="status"
        />
      )
    },
    cell({ getValue }) {
      const slug = getValue<WaitingRoom['slug']>()

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
          header="Created at"
          sortValueKey="createdAt"
        />
      )
    },
    cell({ getValue }) {
      const date = getValue<WaitingRoom['createdAt']>()

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
      const room = row.original

      return (
        <Button className="ml-auto p-1.5"
          tooltip="Join room..."
          variant="ghost"
          size="icon"
          onClick={() => {}} // TODO: implement join
        >
          <PlayCircle className="size-4 sm:size-5 md:size-6 shrink-0 text-accent" />
        </Button>
      )
    }
  }
]
