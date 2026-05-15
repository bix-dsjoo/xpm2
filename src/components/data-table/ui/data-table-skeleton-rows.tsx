import { Skeleton } from "@/base/ui/skeleton"
import { TableCell, TableRow } from "@/base/ui/table"

import type { DataTableColumn } from "../model/types"

const DATA_TABLE_SKELETON_ROW_COUNT = 8

type DataTableSkeletonRowsProps<TData> = {
  columns: DataTableColumn<TData>[]
}

export function DataTableSkeletonRows<TData>({
  columns,
}: DataTableSkeletonRowsProps<TData>) {
  return Array.from(
    { length: DATA_TABLE_SKELETON_ROW_COUNT },
    (_, rowIndex) => (
      <TableRow key={rowIndex} className="hover:bg-transparent">
        {columns.map((column) => {
          return (
            <TableCell key={column.key} className={column.cellClassName}>
              <Skeleton className="h-5 w-full" />
            </TableCell>
          )
        })}
      </TableRow>
    )
  )
}
