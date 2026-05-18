import type { PaginationMeta } from "@/base/model/pagination"
import type { ChartPreference } from "@/base/model/chart"

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

export type DeviceChartPreference = ChartPreference<DeviceChartField>

export type DeviceChartPreferencesResult = {
  charts: DeviceChartPreference[]
}
