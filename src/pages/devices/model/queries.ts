import { queryOptions, useQuery } from "@tanstack/react-query"

import { fetchDevices } from "../api/api"

export const devicesQueryKeys = {
  all: ["devices"] as const,
  list: () => [...devicesQueryKeys.all, "list"] as const,
}

export const devicesQueries = {
  list: () =>
    queryOptions({
      queryKey: devicesQueryKeys.list(),
      queryFn: ({ signal }) => fetchDevices({ signal }),
      staleTime: 30_000,
    }),
}

export function useDevicesQuery() {
  return useQuery(devicesQueries.list())
}
