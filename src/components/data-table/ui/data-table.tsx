import * as React from "react"
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import { cn } from "@/base/lib/utils"
import { EmptyData } from "@/base/ui/empty-data"
import { Skeleton } from "@/base/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/base/ui/table"

import { createDataTableColumns } from "../lib/create-columns"
import { getDataTableColumnId } from "../lib/get-column-id"
import type { DataTableProps } from "../model/types"
import { DataTableHeaderGroup } from "./data-table-header-group"
import { DataTableRow } from "./data-table-row"
import { ButtonGroup } from "@/base/ui/button-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/base/ui/select"

import { Badge } from "@/base/ui/badge"
import { Button } from "@/base/ui/button"
import {
  DownloadIcon,
  MoveLeftIcon,
  MoveRightIcon,
  RefreshCwIcon,
  UploadIcon,
} from "lucide-react"

/**
 * 데이터 목록을 공통 테이블 UI로 표시.
 */
export function DataTable<TData>({
  columns,
  data,

  loading = false,

  getRowId,

  className,

  EmptyIcon,
  emptyTitle,
  emptyDescription,
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
      <header className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <h2 className="text-sm font-medium">Devices</h2>
            <p className="text-sm text-muted-foreground">(1-10 of 10)</p>
          </div>
          <ButtonGroup>
            <Select defaultValue={25}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={25}>25</SelectItem>
                  <SelectItem value={50}>50</SelectItem>
                  <SelectItem value={75}>75</SelectItem>
                  <SelectItem value={100}>100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Badge className="h-8 text-xs font-normal" variant="outline">
              Per Page
            </Badge>
          </ButtonGroup>
          <ButtonGroup>
            <Button className="text-muted-foreground" variant={"outline"}>
              <MoveLeftIcon />
            </Button>
            <Badge className="h-8 text-xs font-normal" variant="outline">
              1 of 1
            </Badge>
            <Button className="text-muted-foreground" variant={"outline"}>
              <MoveRightIcon />
            </Button>
          </ButtonGroup>
          <Button size={"icon"} variant={"ghost"}>
            <RefreshCwIcon />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size={"icon"} variant={"outline"}>
            <DownloadIcon />
          </Button>
          <Button size={"icon"} variant={"outline"}>
            <UploadIcon />
          </Button>
        </div>
      </header>
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
              Array.from({ length: 8 }, (_, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-transparent">
                  {columns.map((column) => {
                    const columnId = getDataTableColumnId(column)

                    return (
                      <TableCell
                        key={columnId}
                        className={column.cellClassName}
                      >
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} />
              </TableRow>
            ) : (
              rows.map((row) => <DataTableRow key={row.id} row={row} />)
            )}
          </TableBody>
        </Table>

        {!loading && rows.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyData
              Icon={EmptyIcon}
              title={emptyTitle}
              description={emptyDescription}
            />
          </div>
        )}
      </div>
    </div>
  )
}
