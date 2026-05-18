import type { ReactNode } from "react"
import type {
  CellContext,
  OnChangeFn,
  Row,
  RowSelectionState,
} from "@tanstack/react-table"

import type { Option } from "@/base/model/types"
import type { LucideIcon } from "lucide-react"

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

type BaseColumn<TData> = {
  header: ReactNode

  align?: DataTableAlign

  headerClassName?: string
  cellClassName?: string
  contentClassName?: string

  /**
   * 셀 표시 방식.
   *
   * 기본값: `"text"`
   */
  type?: DataTableColumnType

  /**
   * 옵션 컬럼의 표시 목록.
   *
   * `type: "option"`일 때 사용.
   */
  options?: Option[]

  /**
   * 기본 포맷 대신 셀 렌더링을 직접 지정.
   */
  cell?: (ctx: CellContext<TData, unknown>) => ReactNode
}

/**
 * row의 필드를 그대로 읽는 컬럼.
 */
export type KeyColumn<TData> = BaseColumn<TData> & {
  /**
   * `TData`에 존재하는 문자열 필드.
   */
  key: keyof TData & string
}

/**
 * row에서 계산한 값을 표시하는 컬럼.
 */
export type AccessorColumn<TData> = BaseColumn<TData> & {
  /**
   * 계산 컬럼의 안정적인 ID.
   */
  id: string

  /**
   * row에서 셀 값을 계산.
   */
  accessorFn: (row: TData, index: number) => unknown
}

/**
 * 값을 읽지 않고 셀을 직접 렌더링하는 컬럼.
 */
type DisplayColumn<TData> = BaseColumn<TData> & {
  /**
   * 직접 렌더링 컬럼의 안정적인 ID.
   */
  id: string

  cell: (ctx: CellContext<TData, unknown>) => ReactNode
  type?: never
  options?: never
}

/**
 * 테이블 컬럼 정의.
 *
 * `key`, `accessorFn`, 직접 렌더링 컬럼 중 하나.
 */
export type DataTableColumn<TData> =
  | KeyColumn<TData>
  | AccessorColumn<TData>
  | DisplayColumn<TData>

export type DataTableColumnMeta = {
  align: DataTableAlign
  headerClassName?: string
  cellClassName?: string
  contentClassName?: string
}

export type DataTablePaginationState = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

/**
 * 행 선택 방식.
 *
 * 기본값은 `"multiple"`이다.
 * `"single"`을 사용하면 한 번에 하나의 행만 선택하고, 헤더의 전체 선택 체크박스는 표시하지 않는다.
 */
export type DataTableSelectionMode = "single" | "multiple"

/**
 * 행 선택 설정.
 *
 * `mode` 기본값은 `"multiple"`이다.
 */
export type DataTableSelection<TData> = {
  mode?: DataTableSelectionMode
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
}

export type DataTableProps<TData> = {
  columns: DataTableColumn<TData>[]
  data?: TData[]

  loading?: boolean

  getRowId?: (row: TData, index: number) => string

  selection?: DataTableSelection<TData>

  className?: string

  EmptyIcon?: LucideIcon
  emptyTitle?: string
  emptyDescription?: string

  pagination?: DataTablePaginationState
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onRefresh?: () => void
}
