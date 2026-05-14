import type { ReactNode } from "react"
import type { ColumnDef } from "@tanstack/react-table"

import {
  DATA_TABLE_DEFAULT_ALIGN_BY_TYPE,
  DATA_TABLE_DEFAULT_DATE_FORMAT_OPTIONS,
  DATA_TABLE_DEFAULT_EMPTY_CELL_TEXT,
  DATA_TABLE_DEFAULT_FALSE_TEXT,
  DATA_TABLE_DEFAULT_LOCALE,
  DATA_TABLE_DEFAULT_TRUE_TEXT,
} from "../config/constants"
import type {
  DataTableAlign,
  DataTableColumn,
  DataTableColumnMeta,
  DataTableColumnType,
} from "../model/types"

export function isEmptyValue(value: unknown) {
  return value === null || value === undefined || value === ""
}

export function getDefaultAlign(
  type: DataTableColumnType = "text"
): DataTableAlign {
  return DATA_TABLE_DEFAULT_ALIGN_BY_TYPE[type]
}

export function getColumnMeta<TData>(
  columnDef: ColumnDef<TData>
): DataTableColumnMeta | undefined {
  return columnDef.meta as DataTableColumnMeta | undefined
}

export function formatDataTableValue<TData>({
  value,
  column,
}: {
  value: unknown
  column: DataTableColumn<TData>
}): ReactNode {
  if (isEmptyValue(value)) {
    return column.emptyText ?? DATA_TABLE_DEFAULT_EMPTY_CELL_TEXT
  }

  const type = column.type ?? "text"

  switch (type) {
    case "number":
      return formatNumber(value, column.locale)

    case "date":
      return formatDate(value, {
        locale: column.locale,
        dateFormatOptions: column.dateFormatOptions,
      })

    case "boolean":
      return formatBoolean(value, {
        trueText: column.trueText,
        falseText: column.falseText,
      })

    case "array":
      return formatArray(value, column.emptyText)

    case "text":
    default:
      return String(value)
  }
}

function formatNumber(value: unknown, locale?: string) {
  const numberValue = typeof value === "number" ? value : Number(value)

  if (!Number.isFinite(numberValue)) {
    return String(value)
  }

  return numberValue.toLocaleString(locale ?? DATA_TABLE_DEFAULT_LOCALE)
}

function formatDate(
  value: unknown,
  options: {
    locale?: string
    dateFormatOptions?: Intl.DateTimeFormatOptions
  }
) {
  const dateValue = parseDateValue(value)

  if (Number.isNaN(dateValue.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(
    options.locale ?? DATA_TABLE_DEFAULT_LOCALE,
    options.dateFormatOptions ?? DATA_TABLE_DEFAULT_DATE_FORMAT_OPTIONS
  ).format(dateValue)
}

function parseDateValue(value: unknown) {
  if (value instanceof Date) return value

  const stringValue = String(value)
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(stringValue)

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch

    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  return new Date(stringValue)
}

function formatBoolean(
  value: unknown,
  options: {
    trueText?: ReactNode
    falseText?: ReactNode
  }
) {
  if (typeof value !== "boolean") {
    return String(value)
  }

  return value
    ? (options.trueText ?? DATA_TABLE_DEFAULT_TRUE_TEXT)
    : (options.falseText ?? DATA_TABLE_DEFAULT_FALSE_TEXT)
}

function formatArray(value: unknown, emptyText?: ReactNode) {
  if (!Array.isArray(value)) {
    return String(value)
  }

  if (value.length === 0) {
    return emptyText ?? DATA_TABLE_DEFAULT_EMPTY_CELL_TEXT
  }

  return value.map(String).join(", ")
}
