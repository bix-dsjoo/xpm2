import type { ReactNode } from "react"

import type { Option } from "@/base/model/types"

export type DataTableColumnType =
  | "text"
  | "number"
  | "date"
  | "date-time"
  | "boolean"
  | "option"
  | "array"

export type DataTableAlign = "left" | "center" | "right"

export type DataTableColumn<TData> = {
  key: keyof TData & string
  header: ReactNode
  type?: DataTableColumnType

  align?: DataTableAlign

  emptyText?: ReactNode

  headerClassName?: string
  cellClassName?: string
  contentClassName?: string

  /**
   * number/date/date-time 전용
   */
  locale?: string

  /**
   * boolean 전용
   */
  trueText?: ReactNode
  falseText?: ReactNode

  options?: Option[]
}

export type DataTableColumnMeta = {
  align: DataTableAlign
  headerClassName?: string
  cellClassName?: string
  contentClassName?: string
}

export type DataTableProps<TData> = {
  columns: DataTableColumn<TData>[]
  data: TData[]

  loading?: boolean
  loadingText?: ReactNode
  emptyText?: ReactNode

  getRowId?: (row: TData, index: number) => string

  className?: string
}
