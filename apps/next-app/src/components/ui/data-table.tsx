// types
import type { z } from "zod"
import type { LucideProps } from "lucide-react"
import type { RowData, Table as RTable } from "@tanstack/react-table"
import type { SortPattern } from "@/lib/types/search"

// react-table
import { flexRender } from "@tanstack/react-table"

// utils
import { cn } from "@/lib/util"

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

function DataTable<D extends RowData>({ table, ...props }: React.ComponentProps<typeof Table> & {
  table: RTable<D>
}) {
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

function DataTableColumnSortingHeader<S extends SortPattern>({
  sortSchema,
  header,
  sortValueKey,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  sortSchema: z.ZodSchema<S>
  header: string
  sortValueKey: string
}) {
  return (
    <div className={cn("flex justify-between items-center", className)} {...props}>
      <span className="mt-1">
        {header}
      </span>
      
      <SortButton className="max-sm:break-all"
        sortSchema={sortSchema}
        iconProps={{ className: "size-3 sm:size-3.5" }}
        sortValueKey={sortValueKey}
      />
    </div>
  )
}

function DataTableColumnToggle<D>({
  table,
  iconProps,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button> & {
  table: RTable<D>
  iconProps?: LucideProps
}) {
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
        {table.getAllColumns()
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
