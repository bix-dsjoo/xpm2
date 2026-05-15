import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/base/ui/button"

import { DataTableTitle } from "./data-table-title"
import { DataTablePageSizeSelect } from "./data-table-page-size-select"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableActions } from "./data-table-actions"
import type { DataTablePaginationState } from "../model/types"

type DataTableToolbarProps = {
  pagination?: DataTablePaginationState
  loading: boolean
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onRefresh?: () => void
}

function getRangeDescription(pagination?: DataTablePaginationState) {
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

export function DataTableToolbar({
  pagination,
  loading,
  onPageChange,
  onPageSizeChange,
  onRefresh,
}: DataTableToolbarProps) {
  return (
    <header className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <DataTableTitle
          title="Devices"
          description={getRangeDescription(pagination)}
        />

        {pagination && onPageSizeChange && (
          <DataTablePageSizeSelect
            pageSize={pagination.pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        )}

        {pagination && onPageChange && (
          <DataTablePagination
            pagination={pagination}
            onPageChange={onPageChange}
          />
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={onRefresh}
          disabled={!onRefresh || loading}
          aria-label="Refresh"
        >
          <RefreshCwIcon />
        </Button>
      </div>

      <DataTableActions />
    </header>
  )
}
