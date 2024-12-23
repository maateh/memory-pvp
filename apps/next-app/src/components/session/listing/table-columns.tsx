import Link from "next/link"

// types
import type { ColumnDef } from "@tanstack/react-table"

// config
import {
  gameModePlaceholders,
  gameTypePlaceholders,
  tableSizePlaceholders
} from "@/config/game-settings"

// icons
import { CalendarCheck, CalendarClock, Dices, ExternalLink, Gamepad2, Minus, StepForward } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"

// components
import { PlayerBadge } from "@/components/player"
import { SessionInfoBadge, SessionBadge } from "@/components/session"
import { CustomDate } from "@/components/shared"

export const columns: ColumnDef<ClientGameSession>[] = [
  {
    id: "Session",
    accessorKey: "status",
    enableHiding: false,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Session"
          sortValueKey="status"
        />
      )
    },
    cell({ row }) {
      const session = row.original

      return (
        <SessionBadge className="2xl:text-base"
          session={session}
        />
      )
    },
  },
  {
    id: "Type / Mode",
    accessorKey: "type",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Type / Mode"
          sortValueKey="type"
        />
      )
    },
    cell({ row }) {
      const session = row.original

      return (
        <SessionInfoBadge
          Icon={Gamepad2}
          label={gameTypePlaceholders[session.type].label}
          subLabel={gameModePlaceholders[session.mode].label}
        />
      )
    },
  },
  {
    id: "Table size",
    accessorKey: "tableSize",
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
      const tableSize = getValue<ClientGameSession['tableSize']>()

      return (
        <SessionInfoBadge
          Icon={Dices}
          label={tableSizePlaceholders[tableSize].label}
          subLabel={tableSizePlaceholders[tableSize].size}
        />
      )
    }
  },
  {
    id: "Player(s)",
    accessorKey: "players",
    enableHiding: true,
    header: "Player(s)",
    cell({ getValue }) {
      const players = getValue<ClientGameSession['players']>()

      return (
        <ul className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {Object.values(players).map((player) => player && (
            <li key={player.tag}>
              <PlayerBadge player={player} key={player.tag} />
            </li>
          ))}
        </ul>
      )
    }
  },
  {
    id: "Started at",
    accessorKey: "startedAt",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Started at"
          sortValueKey="startedAt"
        />
      )
    },
    cell({ getValue }) {
      const date = getValue<ClientGameSession['startedAt']>()

      return (
        <CustomDate
          date={date}
          Icon={CalendarClock}
        />
      )
    },
  },
  {
    id: "Closed at",
    accessorKey: "closedAt",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Closed at"
          sortValueKey="closedAt"
        />
      )
    },
    cell({ getValue }) {
      const date = getValue<ClientGameSession['closedAt']>()

      if (!date) {
        return (
          <Minus className="size-3 shrink-0 text-muted-foreground"
            strokeWidth={2.5}
          />
        )
      }

      return (
        <CustomDate
          date={date}
          Icon={CalendarCheck}
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
      const session = row.original

      if (session.status === 'RUNNING') {
        return (
          <Button className="ml-auto p-1.5 rounded-full"
            tooltip="Continue session"
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/game/single">
              <StepForward className="size-4 sm:size-5 shrink-0 text-accent"
                strokeWidth={2.5}
              />
            </Link>
          </Button>
        )
      }

      return (
        <Button className="p-1.5 rounded-full"
          tooltip="Open summary"
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href={`/game/summary/${session.slug}`}>
            <ExternalLink className="size-4 sm:size-5 shrink-0 text-muted-foreground transition group-hover:text-foreground/90" />
          </Link>
        </Button>
      )
    }
  }
]
