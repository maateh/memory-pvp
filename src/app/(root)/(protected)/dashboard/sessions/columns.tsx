import Link from "next/link"

// types
import type { ColumnDef } from "@tanstack/react-table"

// constants
import { gameModePlaceholders, gameTypePlaceholders, tableSizePlaceholders } from "@/constants/game"

// icons
import { CalendarCheck, CalendarClock, Dices, ExternalLink, Gamepad2, Hash, Minus, StepForward } from "lucide-react"

// shadcn
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"

// components
import { PlayerBadge } from "@/components/player"
import { SessionInfoBadge, SessionStatusBadge } from "@/components/session"
import { CustomDate } from "@/components/shared"

export const columns: ColumnDef<ClientGameSession>[] = [
  {
    id: "Status",
    accessorKey: "status",
    enableHiding: false,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Status"
          sortValueKey="status"
        />
      )
    },
    cell({ getValue }) {
      const status = getValue<ClientGameSession['status']>()

      // TODO: rename to `SessionStatusIndicator`
      // TODO: add label
      return <SessionStatusBadge status={status} />
    },
  },
  {
    id: "Slug",
    accessorKey: "slug",
    enableHiding: false,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Slug"
          sortValueKey="slug"
        />
      )
    },
    cell({ getValue }) {
      const slug = getValue<ClientGameSession['slug']>()

      return (
        <Badge className="gap-x-2 text-sm 2xl:text-base text-foreground/80" variant="muted">
          <Hash className="size-3.5" strokeWidth={4} />

          <Separator className="w-1 h-4 bg-border/80 rounded-full" />

          <p className="mt-0.5 font-heading font-normal">
            {slug}
          </p>
        </Badge>
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
        // TODO: continue session
        return (
          <Button className="p-1.5 rounded-full"
            tooltip="Continue session (WIP)"
            variant="ghost"
            size="icon"
          >
            <StepForward className="size-4 sm:size-5 shrink-0 text-accent"
              strokeWidth={2.5}
            />
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
