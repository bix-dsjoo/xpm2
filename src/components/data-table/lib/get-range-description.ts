import type { DataTablePaginationState } from "../model/types"

export function getDataTableRangeDescription(
  pagination?: DataTablePaginationState
) {
  if (!pagination || pagination.totalItems === 0) {
    return "(0 of 0)"
  }

  const start = (pagination.page - 1) * pagination.pageSize + 1
  const end = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalItems
  )

  return `(${start}-${end} of ${pagination.totalItems})`
}
