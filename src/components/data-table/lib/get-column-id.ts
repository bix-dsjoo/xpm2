import type { DataTableColumn } from "../model/types"

export function getDataTableColumnId<TData>(
  column: DataTableColumn<TData>
): string {
  return "key" in column ? column.key : column.id
}
