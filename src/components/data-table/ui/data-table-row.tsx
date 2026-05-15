import { flexRender, type Row } from "@tanstack/react-table"

import { cn } from "@/base/lib/utils"
import { TableCell, TableRow } from "@/base/ui/table"

import {
  DATA_TABLE_CONTENT_JUSTIFY_CLASS,
  DATA_TABLE_TEXT_ALIGN_CLASS,
} from "../config/constants"
import { getColumnMeta } from "../lib/column-meta"

type DataTableRowProps<TData> = {
  row: Row<TData>
}

export function DataTableRow<TData>({ row }: DataTableRowProps<TData>) {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell) => {
        const meta = getColumnMeta(cell.column.columnDef)
        const align = meta?.align ?? "left"
        const content = flexRender(
          cell.column.columnDef.cell,
          cell.getContext()
        )

        return (
          <TableCell
            key={cell.id}
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
              {content}
            </div>
          </TableCell>
        )
      })}
    </TableRow>
  )
}
