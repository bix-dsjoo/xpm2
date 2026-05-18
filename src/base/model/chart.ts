export type ChartKind = "category" | "time"

export type ChartField = {
  kind: ChartKind
}

export type ChartType = "bar" | "donut"
export type ChartInterval =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year"

export type ChartQuery<TField extends string = string> = {
  field: TField
  limit: number
  interval?: ChartInterval
  timeZone?: string
}

export type ChartPreference<TField extends string = string> = {
  id: string
  chartType: ChartType
  query: ChartQuery<TField>
}

export type ChartData<TField extends string = string> =
  | CategoryChartData<TField>
  | TimeChartData<TField>

export type CategoryChartData<TField extends string = string> = {
  id: string
  field: TField
  kind: "category"
  buckets: CategoryChartBucket[]
}

export type TimeChartData<TField extends string = string> = {
  id: string
  field: TField
  kind: "time"
  interval: ChartInterval
  buckets: TimeChartBucket[]
}

export type CategoryChartBucket = {
  label: string
  count: number
  isOther?: boolean
}

export type TimeChartBucket = {
  startTime: string
  endTime: string
  label: string
  count: number
}
