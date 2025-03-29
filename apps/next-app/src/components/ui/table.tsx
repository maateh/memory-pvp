import * as React from "react"

import { cn } from "@/lib/util"
import { Skeleton } from "@/components/ui/skeleton"

const Table = ({ className, ...props }: React.ComponentProps<"table">) => (
  <div className="relative w-full overflow-auto border border-border/15 rounded-xl">
    <table className={cn("w-full caption-bottom text-sm", className)}
      data-slot="table"
      {...props}
    />
  </div>
)

const TableHeader = ({ className, ...props }: React.ComponentProps<"thead">) => (
  <thead className={cn("bg-muted/25 [&_tr]:border-b", className)}
    data-slot="table-header"
    {...props}
  />
)

const TableBody = ({ className, ...props }: React.ComponentProps<"tbody">) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)}
    data-slot="table-body"
    {...props}
  />
)

const TableFooter = ({ className, ...props }: React.ComponentProps<"tfoot">) => (
  <tfoot className={cn("border-t bg-muted/50 font-medium last:[&>tr]:border-b-0", className)}
    data-slot="table-footer"
    {...props}
  />
)

const TableRow = ({ className, ...props }: React.ComponentProps<"tr">) => (
  <tr className={cn("border-b border-border/20 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
    data-slot="table-row"
    {...props}
  />
)

const TableHead = ({ className, ...props }: React.ComponentProps<"th">) => (
  <th className={cn("h-12 pt-1.5 px-4 border-l border-l-border/5 text-left align-middle text-muted-foreground sm:text-base font-heading font-semibold small-caps tracking-wide [&:has([role=checkbox])]:pr-0", className)}
    data-slot="table-head"
    {...props}
  />
)

const TableCell = ({ className, ...props }: React.ComponentProps<"td">) => (
  <td className={cn("p-4 align-middle font-light [&:has([role=checkbox])]:pr-0", className)}
    data-slot="table-cell"
    {...props}
  />
)

const TableCaption = ({ className, ...props }: React.ComponentProps<"caption">) => (
  <caption className={cn("mt-4 text-sm text-muted-foreground", className)}
    data-slot="table-caption"
    {...props}
  />
)

const TableSkeleton = ({ rows = 5, columns = 4, showFooter = false }: {
  rows?: number
  columns?: number
  showFooter?: boolean
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        {Array.from({ length: columns }).map((_, index) => (
          <TableHead className={cn({ "hidden sm:table-cell": index > 1 })} key={index}>
            <Skeleton className="w-full h-6 bg-muted-foreground/10" />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>

    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell className={cn({ "hidden sm:table-cell": colIndex > 1 })} key={colIndex}>
              <Skeleton className="w-full h-6 bg-muted-foreground/10" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>

    {showFooter && (
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="sm:hidden">
            <Skeleton className="w-full h-6 bg-muted-foreground/10" />
          </TableCell>
          <TableCell colSpan={columns} className="hidden sm:table-cell">
            <Skeleton className="w-full h-6 bg-muted-foreground/10" />
          </TableCell>
        </TableRow>
      </TableFooter>
    )}
  </Table>
)

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSkeleton
}
