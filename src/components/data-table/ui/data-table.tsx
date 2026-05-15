import * as React from "react"
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import { Table, TableBody, TableHeader } from "@/base/ui/table"
import { cn } from "@/base/lib/utils"

import { createDataTableColumns } from "../lib/create-columns"
import type { DataTableProps } from "../model/types"
import { DataTableHeaderGroup } from "./data-table-header-group"
import { DataTableRow } from "./data-table-row"
import { DataTableSkeletonRows } from "./data-table-skeleton-rows"
import { EmptyData } from "@/base/ui/empty-data"
import { Button } from "@/base/ui/button"

/**
 * 데이터 목록을 공통 테이블 UI로 표시.
 */
export function DataTable<TData>({
  columns,
  data,

  loading = false,

  getRowId,

  className,
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
          {loading && data.length === 0 ? (
            <DataTableSkeletonRows columns={columns} />
          ) : (
            rows.map((row) => <DataTableRow key={row.id} row={row} />)
          )}
        </TableBody>
      </Table>

      {!loading && rows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <EmptyData />
        </div>
      )}
    </div>
  )
}
