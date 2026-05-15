import type { ColumnDef } from "@tanstack/react-table"

import type { DataTableColumn, DataTableColumnMeta } from "../model/types"
import { getDefaultColumnAlign } from "./column-meta"
import { formatDataTableCellValue } from "./format-cell-value"

export function createDataTableColumns<TData>(
  columns: DataTableColumn<TData>[]
): ColumnDef<TData>[] {
  return columns.map((column): ColumnDef<TData> => {
    const meta: DataTableColumnMeta = {
      align: column.align ?? getDefaultColumnAlign(column.type),
      headerClassName: column.headerClassName,
      cellClassName: column.cellClassName,
      contentClassName: column.contentClassName,
    }

    return {
      id: column.key,
      accessorKey: column.key,
      header: () => column.header,
      enableSorting: false,
      meta,
      cell: ({ getValue }) =>
        formatDataTableCellValue({
          value: getValue(),
          column,
        }),
    }
  })
}
