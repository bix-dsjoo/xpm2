import type { PaginationMeta } from "@/base/model/pagination"
import type { ChartData, ChartPreference, ChartQuery } from "@/base/model/chart"

import type { Device } from "../model/types"
import type { DeviceChartField } from "../config/chart"

export type FetchDevicesResult = {
  items: Device[]
  pagination: PaginationMeta
}

type FetchDevicesQuery = {
  page: number
  pageSize: number
}

export type FetchDevicesParams = FetchDevicesQuery & {
  signal?: AbortSignal
}

export type DeviceChartPreferencesResult = {
  charts: ChartPreference<DeviceChartField>[]
}

export type DeviceChartsQueryRequest = {
  charts: {
    id: string
    query: ChartQuery<DeviceChartField>
  }[]
}

export type DeviceChartsQueryResult = {
  charts: ChartData<DeviceChartField>[]
}
