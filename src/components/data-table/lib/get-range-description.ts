import type { DataTablePaginationMeta } from "../model/types"

export function getDataTableRangeDescription(
  pagination?: DataTablePaginationMeta
) {
  const totalItems = pagination?.totalItems ?? 0

  if (!pagination || totalItems === 0) {
    return "(0 of 0)"
  }

  const start = (pagination.page - 1) * pagination.pageSize + 1
  const end = Math.min(pagination.page * pagination.pageSize, totalItems)

  return `(${start}-${end} of ${totalItems})`
}
