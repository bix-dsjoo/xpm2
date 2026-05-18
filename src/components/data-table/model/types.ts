import type { ReactNode } from "react"
import type {
  CellContext,
  OnChangeFn,
  Row,
  RowSelectionState,
} from "@tanstack/react-table"

import type { Option } from "@/base/model/types"
import type { PaginationMeta } from "@/base/model/pagination"
import type { LucideIcon } from "lucide-react"

/**
 * 셀 값을 표시하는 기본 형식.
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
 * 컬럼 콘텐츠 정렬 방향.
 */
export type DataTableAlign = "left" | "center" | "right"

type BaseColumn<TData> = {
  header: ReactNode

  align?: DataTableAlign

  headerClassName?: string
  cellClassName?: string
  contentClassName?: string

  /**
   * 셀 값 표시 형식.
   *
   * 기본값은 `"text"`.
   */
  type?: DataTableColumnType

  /**
   * 옵션 컬럼에서 값에 대응되는 표시 정보.
   *
   * `type: "option"`일 때 사용.
   */
  options?: Option[]

  /**
   * 기본 포맷 대신 사용할 셀 렌더러.
   */
  cell?: (ctx: CellContext<TData, unknown>) => ReactNode
}

/**
 * row 필드를 그대로 읽는 컬럼.
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
   * 계산 컬럼을 식별하는 안정적인 ID.
   */
  id: string

  /**
   * row에서 표시할 값을 계산.
   */
  accessorFn: (row: TData, index: number) => unknown
}

/**
 * 값을 읽지 않고 직접 렌더링하는 컬럼.
 */
type DisplayColumn<TData> = BaseColumn<TData> & {
  /**
   * 직접 렌더링 컬럼을 식별하는 안정적인 ID.
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

export type DataTablePagination = PaginationMeta & {
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

/**
 * 행 선택 방식.
 *
 * 기본값은 `"multiple"`.
 */
export type DataTableSelectionMode = "single" | "multiple"

/**
 * 행 선택 설정.
 */
export type DataTableSelection<TData> = {
  mode?: DataTableSelectionMode
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
}

export type DataTableProps<TData> = {
  title?: string

  columns: DataTableColumn<TData>[]
  data?: TData[]

  loading?: boolean

  getRowId?: (row: TData, index: number) => string

  selection?: DataTableSelection<TData>

  className?: string

  EmptyIcon?: LucideIcon
  emptyTitle?: string
  emptyDescription?: string

  pagination?: DataTablePagination
  onRefresh?: () => void
}
