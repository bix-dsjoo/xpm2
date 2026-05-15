import { flexRender, type HeaderGroup } from "@tanstack/react-table"

import { cn } from "@/base/lib/utils"
import { TableHead, TableRow } from "@/base/ui/table"

import { DATA_TABLE_TEXT_ALIGN_CLASS } from "../config/constants"
import { getColumnMeta } from "../lib/column-meta"

type DataTableHeaderGroupProps<TData> = {
  headerGroup: HeaderGroup<TData>
}

export function DataTableHeaderGroup<TData>({
  headerGroup,
}: DataTableHeaderGroupProps<TData>) {
  return (
    <TableRow>
      {headerGroup.headers.map((header) => {
        const meta = getColumnMeta(header.column.columnDef)
        const align = meta?.align ?? "left"

        return (
          <TableHead
            key={header.id}
            colSpan={header.colSpan}
            className={cn(
              "sticky top-0 z-10 border-b bg-background",
              DATA_TABLE_TEXT_ALIGN_CLASS[align],
              meta?.headerClassName
            )}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        )
      })}
    </TableRow>
  )
}
