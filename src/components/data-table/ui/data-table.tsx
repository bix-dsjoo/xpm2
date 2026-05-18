import * as React from "react"
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import { cn } from "@/base/lib/utils"
import { Table, TableBody, TableHeader } from "@/base/ui/table"

import { createDataTableColumns } from "../lib/create-columns"
import { createDataTableSelectionColumn } from "../lib/create-selection-column"
import type { DataTableProps } from "../model/types"
import { DataTableHeaderGroup } from "./data-table-header-group"
import { DataTableRow } from "./data-table-row"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTableSkeletonRows } from "./data-table-skeleton-rows"
import { DataTableEmptyRow } from "./data-table-empty-row"
import { DataTableEmptyOverlay } from "./data-table-empty-overlay"

/**
 * 데이터 목록을 공통 테이블 UI로 표시.
 */
export function DataTable<TData>({
  columns,
  data = [],
  pagination,

  loading = false,

  getRowId,
  selection,

  className,

  EmptyIcon,
  emptyTitle,
  emptyDescription,

  onRefresh,
}: DataTableProps<TData>) {
  const hasSelection = Boolean(selection)
  const selectionMode = selection?.mode ?? "multiple"

  const columnDefs = React.useMemo<ColumnDef<TData>[]>(() => {
    const dataColumns = createDataTableColumns(columns)

    if (!hasSelection) {
      return dataColumns
    }

    return [
      createDataTableSelectionColumn({ mode: selectionMode }),
      ...dataColumns,
    ]
  }, [columns, hasSelection, selectionMode])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: columnDefs,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: selection?.rowSelection,
    },
    onRowSelectionChange: selection?.onRowSelectionChange,
    enableRowSelection: selection?.enableRowSelection,
    enableMultiRowSelection: selectionMode === "multiple",
  })

  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const visibleColumnCount = visibleColumns.length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DataTableToolbar
        pagination={pagination}
        onRefresh={onRefresh}
        loading={loading}
      />
      <div
        className={cn(
          "relative flex-1 overflow-hidden rounded-md border",
          className
        )}
        aria-busy={loading || undefined}
      >
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <DataTableHeaderGroup
                key={headerGroup.id}
                headerGroup={headerGroup}
              />
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <DataTableSkeletonRows columns={visibleColumns} />
            ) : rows.length === 0 ? (
              <DataTableEmptyRow colSpan={visibleColumnCount} />
            ) : (
              rows.map((row) => <DataTableRow key={row.id} row={row} />)
            )}
          </TableBody>
        </Table>

        {!loading && rows.length === 0 && (
          <DataTableEmptyOverlay
            Icon={EmptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        )}
      </div>
    </div>
  )
}
