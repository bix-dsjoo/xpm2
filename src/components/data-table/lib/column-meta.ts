import type { ColumnDef } from "@tanstack/react-table"

import { DATA_TABLE_DEFAULT_ALIGN_BY_TYPE } from "../config/constants"
import type {
  DataTableAlign,
  DataTableColumnMeta,
  DataTableColumnType,
} from "../model/types"

export function getDefaultColumnAlign(
  type: DataTableColumnType = "text"
): DataTableAlign {
  return DATA_TABLE_DEFAULT_ALIGN_BY_TYPE[type]
}

export function getColumnMeta<TData>(
  columnDef: ColumnDef<TData>
): DataTableColumnMeta | undefined {
  return columnDef.meta as DataTableColumnMeta | undefined
}
