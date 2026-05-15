import type { ReactNode } from "react"

import type { Option } from "@/base/model/types"

/**
 * 셀 표시 방식.
 */
export type DataTableColumnType =
  | "text"
  | "number"
  | "date"
  | "date-time"
  | "boolean"
  | "option"
  | "array"

/**
 * 컬럼 정렬 방향.
 */
export type DataTableAlign = "left" | "center" | "right"

type DataTableColumnBase<TData> = {
  key: keyof TData & string
  header: ReactNode

  align?: DataTableAlign

  headerClassName?: string
  cellClassName?: string
  contentClassName?: string
}

type DataTableOptionColumn<TData> = DataTableColumnBase<TData> & {
  type: "option"

  /**
   * 옵션 컬럼의 표시 목록.
   *
   * `type: "option"`일 때 필수.
   */
  options: Option[]
}

type DataTableValueColumn<TData> = DataTableColumnBase<TData> & {
  /**
   * 셀 표시 방식.
   *
   * 기본값: `"text"`
   */
  type?: Exclude<DataTableColumnType, "option">
  options?: never
}

/**
 * 테이블 컬럼 정의.
 */
export type DataTableColumn<TData> =
  | DataTableOptionColumn<TData>
  | DataTableValueColumn<TData>

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

  getRowId?: (row: TData, index: number) => string

  className?: string
}
