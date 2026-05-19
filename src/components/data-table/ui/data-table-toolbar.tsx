import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/base/ui/button"

import { DataTableTitle } from "./data-table-title"
import { DataTablePageSizeSelect } from "./data-table-page-size-select"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableActions } from "./data-table-actions"
import type { DataTablePagination as DataTablePaginationConfig } from "../model/types"
import { getDataTableRangeDescription } from "../lib/get-range-description"

type Props = {
  title?: string
  pagination?: DataTablePaginationConfig
  loading: boolean
  onRefresh?: () => void
}

export function DataTableToolbar({
  title,
  pagination,
  loading,
  onRefresh,
}: Props) {
  return (
    <header className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <DataTableTitle
          title={title}
          description={getDataTableRangeDescription(pagination)}
        />

        {pagination?.onPageSizeChange && (
          <DataTablePageSizeSelect
            pageSize={pagination.pageSize}
            onPageSizeChange={pagination.onPageSizeChange}
            disabled={loading}
          />
        )}

        {pagination?.onPageChange && (
          <DataTablePagination
            pagination={pagination}
            onPageChange={pagination.onPageChange}
            disabled={loading}
          />
        )}

        <Button
          size="icon"
          variant="ghost"
          onClick={onRefresh}
          disabled={!onRefresh || loading}
          aria-label="Refresh"
        >
          <RefreshCwIcon className={loading ? "animate-spin" : undefined} />
        </Button>
      </div>

      <DataTableActions />
    </header>
  )
}
