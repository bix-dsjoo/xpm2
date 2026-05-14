"use client"

import * as React from "react"
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/base/ui/table"
import { cn } from "@/base/lib/utils"

import {
  DATA_TABLE_DEFAULT_EMPTY_TEXT,
  DATA_TABLE_DEFAULT_LOADING_TEXT,
} from "../config/data-table-constants"
import { createDataTableColumns } from "../lib/create-data-table-columns"
import type { DataTableProps } from "../model/data-table-types"
import { DataTableHeaderGroup } from "./data-table-header-group"
import { DataTableRow } from "./data-table-row"

export function DataTable<TData>({
  columns,
  data,

  loading = false,
  loadingText = DATA_TABLE_DEFAULT_LOADING_TEXT,
  emptyText = DATA_TABLE_DEFAULT_EMPTY_TEXT,

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

  const columnCount = Math.max(table.getAllLeafColumns().length, 1)

  return (
    <div
      className={cn("w-full overflow-auto rounded-md border", className)}
      aria-busy={loading || undefined}
    >
      <Table>
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
            <DataTableStateRow colSpan={columnCount} content={loadingText} />
          ) : rows.length === 0 ? (
            <DataTableStateRow colSpan={columnCount} content={emptyText} />
          ) : (
            rows.map((row) => (
              <DataTableRow key={row.id} row={row} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function DataTableStateRow({
  colSpan,
  content,
}: {
  colSpan: number
  content: React.ReactNode
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center text-muted-foreground"
      >
        {content}
      </TableCell>
    </TableRow>
  )
}
