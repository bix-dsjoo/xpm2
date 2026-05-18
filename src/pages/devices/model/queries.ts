import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"

import {
  fetchDeviceChartPreferences,
  fetchDeviceCharts,
  fetchDevices,
} from "../api/api"
import type { DeviceChartsQueryRequest } from "../api/dto"

type DevicesListParams = {
  page: number
  pageSize: number
}

export const devicesQueryKeys = {
  all: ["devices"] as const,
  list: (params: DevicesListParams) =>
    [...devicesQueryKeys.all, "list", params] as const,
  chartPreferences: () =>
    [...devicesQueryKeys.all, "chart-preferences"] as const,
  charts: (request: DeviceChartsQueryRequest) =>
    [...devicesQueryKeys.all, "charts", request] as const,
}

export const devicesQueries = {
  list: (params: DevicesListParams) =>
    queryOptions({
      queryKey: devicesQueryKeys.list(params),
      queryFn: ({ signal }) => fetchDevices({ ...params, signal }),
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    }),
  chartPreferences: () =>
    queryOptions({
      queryKey: devicesQueryKeys.chartPreferences(),
      queryFn: ({ signal }) => fetchDeviceChartPreferences(signal),
      staleTime: 60_000,
    }),
  charts: (request: DeviceChartsQueryRequest) =>
    queryOptions({
      queryKey: devicesQueryKeys.charts(request),
      queryFn: ({ signal }) => fetchDeviceCharts(request, signal),
      enabled: request.charts.length > 0,
      staleTime: 30_000,
    }),
}

export function useDevicesQuery(params: DevicesListParams) {
  return useQuery(devicesQueries.list(params))
}

export function useDeviceChartPreferencesQuery() {
  return useQuery(devicesQueries.chartPreferences())
}

export function useDeviceChartsQuery(request: DeviceChartsQueryRequest) {
  return useQuery(devicesQueries.charts(request))
}
