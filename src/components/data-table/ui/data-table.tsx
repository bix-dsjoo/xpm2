import * as React from "react"
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import { cn } from "@/base/lib/utils"
import { Table, TableBody, TableHeader } from "@/base/ui/table"

import { createDataTableColumns } from "../lib/create-columns"
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

  className,

  EmptyIcon,
  emptyTitle,
  emptyDescription,

  onPageChange,
  onPageSizeChange,
  onRefresh,
}: DataTableProps<TData>) {
  const columnDefs = React.useMemo<ColumnDef<TData>[]>(
    () => createDataTableColumns(columns),
    [columns]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: columnDefs,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DataTableToolbar
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
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
              <DataTableSkeletonRows columns={columns} />
            ) : rows.length === 0 ? (
              <DataTableEmptyRow colSpan={columns.length} />
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
