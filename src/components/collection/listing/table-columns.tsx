// types
import type { ColumnDef } from "@tanstack/react-table"
import type { CollectionListingMetadata } from "./collection-listing"

// icons
import { CalendarCheck, CalendarCheck2 } from "lucide-react"

// shadcn
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"

// components
import { UserAvatar } from "@/components/user"
import { CollectionPreviewItem, CollectionPreviewList } from "@/components/collection"
import { CustomDate } from "@/components/shared"
import CollectionActions from "./collection-actions"

export const columns: ColumnDef<ClientCardCollection>[] = [
  {
    id: "Owner",
    accessorKey: "user",
    header: "Owner",
    enableHiding: true,
    cell({ getValue }) {
      const user = getValue<ClientCardCollection['user']>()

      return (
        <div className="flex items-center gap-x-2">
          <UserAvatar user={user} />
          <span className="text-muted-foreground text-sm font-medium">
            {user.username}
          </span>
        </div>
      )
    },
  },
  {
    id: "Collection name",
    accessorKey: "name",
    enableHiding: false,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Collection name"
          sortValueKey="name"
        />
      )
    },
    cell({ getValue }) {
      const name = getValue<ClientCardCollection['name']>()

      return (
        <span className="max-sm:break-all">
          {name}
        </span>
      )
    },
  },
  {
    id: "Description",
    accessorKey: "description",
    header: "Description",
    enableHiding: true,
    cell({ getValue }) {
      const description = getValue<ClientCardCollection['description']>()

      return (
        <span className="text-xs text-muted-foreground break-all line-clamp-3">
          {description}
        </span>
      )
    },
  },
  {
    id: "Cards",
    accessorKey: "cards",
    header: "Card images",
    enableHiding: true,
    cell({ getValue }) {
      const cards = getValue<ClientCardCollection['cards']>()

      return (
        <CollectionPreviewList className="pl-1.5 justify-start" dense>
          {cards.map((card) => (
            <CollectionPreviewItem className="first:-ml-1.5 -ml-1.5"
              imageUrl={card.imageUrl}
              imageSize={20}
              key={card.id}
              dense
            />
          ))}
        </CollectionPreviewList>
      )
    }
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
      const date = getValue<ClientCardCollection['createdAt']>()

      return (
        <CustomDate
          date={date}
          Icon={CalendarCheck}
        />
      )
    },
  },
  {
    id: "Updated at",
    accessorKey: "updatedAt",
    enableHiding: true,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Updated at"
          sortValueKey="updatedAt"
        />
      )
    },
    cell({ getValue }) {
      const date = getValue<ClientCardCollection['updatedAt']>()

      return (
        <CustomDate
          date={date}
          Icon={CalendarCheck2}
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
    cell({ row, table }) {
      return (
        <CollectionActions
          collection={row.original}
          metadata={table.options.meta as CollectionListingMetadata}
        />
      )
    }
  }
]
