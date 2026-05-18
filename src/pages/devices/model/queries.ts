import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query"

import type { PaginationParams } from "@/base/model/pagination"

import { fetchDevices } from "../api/api"

export const devicesQueryKeys = {
  all: ["devices"] as const,
  list: (params: PaginationParams) =>
    [...devicesQueryKeys.all, "list", params] as const,
}

export const devicesQueries = {
  list: (params: PaginationParams) =>
    queryOptions({
      queryKey: devicesQueryKeys.list(params),
      queryFn: ({ signal }) => fetchDevices({ ...params, signal }),
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    }),
}

export function useDevicesQuery(params: PaginationParams) {
  return useQuery(devicesQueries.list(params))
}
