import { formatDistance } from "date-fns"

// types
import type { ColumnDef } from "@tanstack/react-table"

// icons
import { EllipsisVertical } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import { DataTableColumnSortingHeader, DataTableColumnToggle } from "@/components/ui/data-table"

// components
import { CollectionPreviewDenseItem, CollectionPreviewDenseList } from "@/components/collection"
import CollectionActionsDropdown from "./collection-actions-dropdown"

export const columns: ColumnDef<ClientCardCollection>[] = [
  {
    id: "Name",
    accessorKey: "name",
    enableHiding: false,
    header() {
      return (
        <DataTableColumnSortingHeader
          header="Name"
          sortValueKey="name"
        />
      )
    },
    cell({ getValue }) {
      const name = getValue() as ClientCardCollection['name']

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
      const description = getValue() as ClientCardCollection['description']

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
      const cards = getValue() as ClientCardCollection['cards']

      return (
        <CollectionPreviewDenseList className="pl-1.5 justify-start">
          {cards.map((card) => (
            <CollectionPreviewDenseItem className="first:-ml-1.5 -ml-1.5"
              imageUrl={card.imageUrl}
              imageSize={20}
              key={card.id}
            />
          ))}
        </CollectionPreviewDenseList>
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
      const date = getValue() as ClientCardCollection['createdAt']
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
    cell({ row }) {
      const collection = row.original

      return (
        <CollectionActionsDropdown collection={collection}>
          <Button className="p-1.5"
            variant="ghost"
            size="icon"
          >
            <EllipsisVertical className="size-4 sm:size-5" />
          </Button>
        </CollectionActionsDropdown>
      )
    },
  }
]
