import type { ColumnDef } from "@tanstack/react-table"

import type {
  DataTableColumn,
  DataTableColumnMeta,
} from "../model/data-table-types"
import { formatDataTableValue, getDefaultAlign } from "./data-table-utils"

export function createDataTableColumns<TData>(
  columns: DataTableColumn<TData>[]
): ColumnDef<TData>[] {
  return columns.map((column): ColumnDef<TData> => {
    const type = column.type ?? "text"

    const meta: DataTableColumnMeta = {
      align: column.align ?? getDefaultAlign(type),
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
