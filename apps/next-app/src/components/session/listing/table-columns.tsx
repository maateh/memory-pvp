import Link from "next/link"

// types
import type { ColumnDef } from "@tanstack/react-table"
import type { ClientSessionVariants } from "@repo/schema/session"

// schemas
import { sessionSort } from "@repo/schema/session"

// config
import {
  matchFormatPlaceholders,
  sessionModePlaceholders,
  tableSizePlaceholders
} from "@repo/config/game"

// icons
import { CalendarCheck, CalendarClock, Dices, ExternalLink, Gamepad2, Minus, StepForward } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"

// components
import { CustomDate } from "@/components/shared"
import { PlayerBadge } from "@/components/player"
import { SessionInfoBadge, SessionBadge } from "@/components/session"

export const columns: ColumnDef<ClientSessionVariants>[] = [
  {
    id: "Session",
    accessorKey: "status",
    enableHiding: false,
    header() {
      return (
        <DataTableColumnSortingHeader
          sortSchema={sessionSort}
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
    id: "Settings",
    accessorKey: "mode",
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
    cell({ row }) {
      const { mode, format } = row.original

      return (
        <SessionInfoBadge
          Icon={Gamepad2}
          label={sessionModePlaceholders[mode].label}
          subLabel={matchFormatPlaceholders[format].label}
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
          sortSchema={sessionSort}
          header="Table size"
          sortValueKey="tableSize"
        />
      )
    },
    cell({ getValue }) {
      const tableSize = getValue<ClientSessionVariants["tableSize"]>()

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
    cell({ row }) {
      const session = row.original
      const players = [session.owner]

      if (session.format === "PVP" || session.format === "COOP") {
        players.push(session.guest)
      }

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
          sortSchema={sessionSort}
          header="Started at"
          sortValueKey="startedAt"
        />
      )
    },
    cell({ getValue }) {
      const date = getValue<ClientSessionVariants["startedAt"]>()

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
          sortSchema={sessionSort}
          header="Closed at"
          sortValueKey="closedAt"
        />
      )
    },
    cell({ getValue }) {
      const date = getValue<ClientSessionVariants["closedAt"]>()

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

      if (session.status === "RUNNING") {
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
