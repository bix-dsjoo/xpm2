import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"

import { fetchDeviceChartPreferences, fetchDevices } from "../api/api"

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
}

export function useDevicesQuery(params: DevicesListParams) {
  return useQuery(devicesQueries.list(params))
}

export function useDeviceChartPreferencesQuery() {
  return useQuery(devicesQueries.chartPreferences())
}
