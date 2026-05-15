import type { ColumnDef } from "@tanstack/react-table"

import type { DataTableColumn, DataTableColumnMeta } from "../model/types"
import { getDefaultColumnAlign } from "./column-meta"
import { formatDataTableCellValue } from "./format-cell-value"
import { getDataTableColumnId } from "./get-column-id"

export function createDataTableColumns<TData>(
  columns: DataTableColumn<TData>[]
): ColumnDef<TData>[] {
  return columns.map((column): ColumnDef<TData> => {
    const columnId = getDataTableColumnId(column)
    const meta: DataTableColumnMeta = {
      align: column.align ?? getDefaultColumnAlign(column.type),
      headerClassName: column.headerClassName,
      cellClassName: column.cellClassName,
      contentClassName: column.contentClassName,
    }

    if ("key" in column) {
      return {
        id: columnId,
        accessorKey: column.key,
        header: () => column.header,
        cell:
          column.cell ??
          (({ getValue }) =>
            formatDataTableCellValue({
              value: getValue(),
              column,
            })),
        meta,
      }
    }

    if ("accessorFn" in column) {
      return {
        id: columnId,
        accessorFn: column.accessorFn,
        header: () => column.header,
        cell:
          column.cell ??
          (({ getValue }) =>
            formatDataTableCellValue({
              value: getValue(),
              column,
            })),
        meta,
      }
    }

    return {
      id: columnId,
      header: () => column.header,
      cell: column.cell,
      meta,
    }
  })
}
