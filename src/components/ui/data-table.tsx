// types
import type { Table as RTable } from "@tanstack/react-table"
import type { LucideProps } from "lucide-react"

// react-table
import { flexRender } from "@tanstack/react-table"

// utils
import { cn } from "@/lib/utils"

// icons
import { TableProperties } from "lucide-react"

// shadcn
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

// components
import { SortButton } from "@/components/shared"

type DataTableProps<D> = {
  table: RTable<D>
} & React.ComponentProps<typeof Table>

function DataTable<D>({ table, ...props }: DataTableProps<D>) {
  return (
    <Table {...props}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {!header.isPlaceholder && flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}
            data-state={row.getIsSelected() && "selected"}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        )) : (
          <TableRow>
            <TableCell className="h-20 text-center"
              colSpan={table.getAllColumns().length}
            >
              <span className="text-lg text-muted-foreground font-heading tracking-wide">
                No data to display.
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

type DataTableColumnSortingHeaderProps = {
  header: string
  sortValueKey: string
} & React.ComponentProps<"div">

function DataTableColumnSortingHeader({ header, sortValueKey, className, ...props }: DataTableColumnSortingHeaderProps) {
  return (
    <div className={cn("flex justify-between items-center", className)} {...props}>
      <span className="mt-1">
        {header}
      </span>
      
      <SortButton className="max-sm:break-all"
        iconProps={{ className: "size-3 sm:size-3.5" }}
        sortValueKey={sortValueKey}
      />
    </div>
  )
}

type DataTableColumnToggleProps<D> = {
  table: RTable<D>
  iconProps?: LucideProps
} & React.ComponentProps<typeof Button>

function DataTableColumnToggle<D>({
  table,
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: DataTableColumnToggleProps<D>) {
  const { getAllColumns } = table

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("gap-x-2 font-light border border-border/15", className)}
          variant={variant}
          size={size}
          {...props}
        >
          <TableProperties {...iconProps} className={cn("size-3.5 sm:size-4", iconProps?.className)}
            strokeWidth={iconProps?.strokeWidth || 1.75}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem className="font-light capitalize"
              variant="muted"
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.columnDef.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export {
  DataTable,
  DataTableColumnSortingHeader,
  DataTableColumnToggle
}
