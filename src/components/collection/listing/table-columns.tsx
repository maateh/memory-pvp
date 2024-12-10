import { formatDistance } from "date-fns"

// types
import type { ColumnDef } from "@tanstack/react-table"
import type { CollectionListingMetadata } from "./collection-listing"

// shadcn
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"

// components
import { UserAvatar } from "@/components/user"
import { CollectionPreviewItem, CollectionPreviewList } from "@/components/collection"
import CollectionActions from "./collection-actions"

export const columns: ColumnDef<ClientCardCollection>[] = [
  {
    id: "Uploader",
    accessorKey: "user",
    header: "Uploader",
    enableHiding: true,
    cell({ getValue }) {
      const user = getValue<ClientCardCollection['user']>()

      return <UserAvatar user={user} />
    },
  },
  {
    id: "Collection",
    accessorKey: "name",
    enableHiding: false,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Collection"
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
        <span className="break-all">
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
      const formattedDate = formatDistance(date, Date.now(), { addSuffix: true })

      return <div>{formattedDate}</div>
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
      const formattedDate = formatDistance(date, Date.now(), { addSuffix: true })

      return <div>{formattedDate}</div>
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
