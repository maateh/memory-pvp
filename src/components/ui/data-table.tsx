// types
import type { Table as RTable } from "@tanstack/react-table"

// react-table
import { flexRender } from "@tanstack/react-table"

// shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

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

export { DataTable }
