import type { ReactNode } from "react"

import type { Option } from "@/base/model/types"
import { Badge } from "@/base/ui/badge"

import {
  DATA_TABLE_DEFAULT_DATE_FORMAT_OPTIONS,
  DATA_TABLE_DEFAULT_DATE_TIME_FORMAT_OPTIONS,
  DATA_TABLE_DEFAULT_EMPTY_CELL_TEXT,
  DATA_TABLE_DEFAULT_FALSE_TEXT,
  DATA_TABLE_DEFAULT_LOCALE,
  DATA_TABLE_DEFAULT_TRUE_TEXT,
} from "../config/constants"
import type { AccessorColumn, KeyColumn } from "../model/types"

export function formatDataTableCellValue<TData>({
  value,
  column,
}: {
  value: unknown
  column: KeyColumn<TData> | AccessorColumn<TData>
}): ReactNode {
  if (isEmptyCellValue(value)) {
    return DATA_TABLE_DEFAULT_EMPTY_CELL_TEXT
  }

  const columnType = column.type

  switch (columnType) {
    case "number":
      return formatNumber(value)

    case "date":
      return formatDate(value, DATA_TABLE_DEFAULT_DATE_FORMAT_OPTIONS)

    case "date-time":
      return formatDate(value, DATA_TABLE_DEFAULT_DATE_TIME_FORMAT_OPTIONS)

    case "boolean":
      return formatBoolean(value)

    case "option":
      return formatOptionValue(value, column.options)

    case "array":
      return formatArray(value)

    case "text":
    case undefined:
      return String(value)
  }

  return assertNever(columnType)
}

export function isEmptyCellValue(value: unknown) {
  return value === null || value === undefined || value === ""
}

function formatNumber(value: unknown) {
  const numberValue = typeof value === "number" ? value : Number(value)

  if (!Number.isFinite(numberValue)) {
    return String(value)
  }

  return numberValue.toLocaleString(DATA_TABLE_DEFAULT_LOCALE)
}

function formatDate(value: unknown, formatOptions: Intl.DateTimeFormatOptions) {
  const dateValue = parseDateValue(value)

  if (Number.isNaN(dateValue.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(
    DATA_TABLE_DEFAULT_LOCALE,
    formatOptions
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

function formatBoolean(value: unknown) {
  if (typeof value !== "boolean") {
    return String(value)
  }

  return value ? DATA_TABLE_DEFAULT_TRUE_TEXT : DATA_TABLE_DEFAULT_FALSE_TEXT
}

function formatOptionValue(value: unknown, options?: Option[]) {
  const stringValue = String(value)

  if (!options?.length) return stringValue

  const option = options.find((option) => option.value === stringValue)

  return (
    <Badge variant={option?.variant ?? "secondary"}>
      {option?.label ?? stringValue}
    </Badge>
  )
}

function formatArray(value: unknown) {
  if (!Array.isArray(value)) {
    return String(value)
  }

  if (value.length === 0) {
    return DATA_TABLE_DEFAULT_EMPTY_CELL_TEXT
  }

  return value.map(String).join(", ")
}

function assertNever(value: never): never {
  throw new Error(`Unsupported data table column type: ${String(value)}`)
}
