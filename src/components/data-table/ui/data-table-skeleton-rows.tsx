import { TableCell, TableRow } from "@/base/ui/table"
import { cn } from "@/base/lib/utils"
import { Skeleton } from "@/base/ui/skeleton"

import { getDataTableColumnId } from "../lib/get-column-id"
import type { DataTableColumn } from "../model/types"

type DataTableLoadingRowsProps<TData> = {
  columns: DataTableColumn<TData>[]
}

export function DataTableSkeletonRows<TData>({
  columns,
}: DataTableLoadingRowsProps<TData>) {
  return Array.from({ length: 10 }, (_, rowIndex) => (
    <TableRow key={rowIndex} className="hover:bg-transparent">
      {columns.map((column) => {
        const columnId = getDataTableColumnId(column)

        return (
          <TableCell
            key={columnId}
            className={cn("border-b", column.cellClassName)}
          >
            <Skeleton className="h-5 w-full" />
          </TableCell>
        )
      })}
    </TableRow>
  ))
}
