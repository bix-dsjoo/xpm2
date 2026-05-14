import { CircleCheckIcon, CircleX } from "lucide-react"
import type { DataTableAlign, DataTableColumnType } from "../model/types"

export const DATA_TABLE_DEFAULT_EMPTY_TEXT = "데이터가 없습니다."
export const DATA_TABLE_DEFAULT_LOADING_TEXT = "로딩 중..."

export const DATA_TABLE_DEFAULT_EMPTY_CELL_TEXT = "-"

export const DATA_TABLE_DEFAULT_LOCALE = "ko-KR"

export const DATA_TABLE_DEFAULT_TRUE_TEXT = (
  <>
    <CircleCheckIcon className="size-4 text-green-600" />
    <span className="sr-only">true</span>
  </>
)
export const DATA_TABLE_DEFAULT_FALSE_TEXT = (
  <>
    <CircleX className="size-4 text-red-600" />
    <span className="sr-only">false</span>
  </>
)

export const DATA_TABLE_DEFAULT_DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
} satisfies Intl.DateTimeFormatOptions

export const DATA_TABLE_DEFAULT_DATE_TIME_FORMAT_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
} satisfies Intl.DateTimeFormatOptions

export const DATA_TABLE_DEFAULT_ALIGN_BY_TYPE = {
  text: "left",
  number: "right",
  date: "center",
  "date-time": "center",
  boolean: "center",
  option: "center",
  array: "left",
} satisfies Record<DataTableColumnType, DataTableAlign>

export const DATA_TABLE_TEXT_ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} satisfies Record<DataTableAlign, string>

export const DATA_TABLE_CONTENT_JUSTIFY_CLASS = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
} satisfies Record<DataTableAlign, string>
