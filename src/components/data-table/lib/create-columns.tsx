import type { ColumnDef } from "@tanstack/react-table"

import type { DataTableColumn, DataTableColumnMeta } from "../model/types"
import { formatDataTableValue, getDefaultAlign } from "./utils"

export function createDataTableColumns<TData>(
  columns: DataTableColumn<TData>[]
): ColumnDef<TData>[] {
  return columns.map((column): ColumnDef<TData> => {
    const meta: DataTableColumnMeta = {
      align: column.align ?? getDefaultAlign(column.type),
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
        formatDataTableValue({
          value: getValue(),
          column,
        }),
    }
  })
}
