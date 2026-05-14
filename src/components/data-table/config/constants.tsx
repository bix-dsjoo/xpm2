import { CircleCheckIcon, CircleX } from "lucide-react"
import type { OptionColor } from "@/base/model/types"
import type {
  DataTableAlign,
  DataTableColumnType,
} from "../model/types"

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

export const DATA_TABLE_DEFAULT_ALIGN_BY_TYPE = {
  text: "left",
  number: "right",
  date: "center",
  boolean: "center",
  option: "center",
  array: "left",
} satisfies Record<DataTableColumnType, DataTableAlign>

export const DATA_TABLE_OPTION_BADGE_CLASS = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  zinc: "bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
} satisfies Record<OptionColor, string>

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
