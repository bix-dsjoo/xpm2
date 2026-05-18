import type { Column } from "@tanstack/react-table"

import { cn } from "@/base/lib/utils"
import { TableCell, TableRow } from "@/base/ui/table"
import { Skeleton } from "@/base/ui/skeleton"

import {
  DATA_TABLE_CONTENT_JUSTIFY_CLASS,
  DATA_TABLE_TEXT_ALIGN_CLASS,
} from "../config/constants"
import { getColumnMeta } from "../lib/column-meta"

type DataTableSkeletonRowsProps<TData> = {
  columns: Column<TData>[]
}

const DATA_TABLE_SKELETON_ROW_COUNT = 10

export function DataTableSkeletonRows<TData>({
  columns,
}: DataTableSkeletonRowsProps<TData>) {
  return Array.from({ length: DATA_TABLE_SKELETON_ROW_COUNT }, (_, rowIndex) => (
    <TableRow key={rowIndex} className="hover:bg-transparent">
      {columns.map((column) => {
        const meta = getColumnMeta(column.columnDef)
        const align = meta?.align ?? "left"

        return (
          <TableCell
            key={column.id}
            className={cn("border-b", meta?.cellClassName)}
          >
            <div
              className={cn(
                "flex w-full items-center gap-1",
                DATA_TABLE_TEXT_ALIGN_CLASS[align],
                DATA_TABLE_CONTENT_JUSTIFY_CLASS[align],
                meta?.contentClassName
              )}
            >
              <Skeleton className="h-5 w-full" />
            </div>
          </TableCell>
        )
      })}
    </TableRow>
  ))
}
