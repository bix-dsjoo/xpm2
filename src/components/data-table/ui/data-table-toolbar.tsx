import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/base/ui/button"

import { DataTableTitle } from "./data-table-title"
import { DataTablePageSizeSelect } from "./data-table-page-size-select"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableActions } from "./data-table-actions"
import type { DataTablePaginationState } from "../model/types"
import { getDataTableRangeDescription } from "../lib/get-range-description"

type DataTableToolbarProps = {
  pagination?: DataTablePaginationState
  loading: boolean
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onRefresh?: () => void
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
          description={getDataTableRangeDescription(pagination)}
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
