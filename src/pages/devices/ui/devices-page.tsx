import { useDataTablePagination } from "@/components/data-table"

import { useDevicesQuery } from "../model/queries"
import { ChartPieDonut } from "./devices-page-chart-pie-donut"
import { ChartBarDefault } from "./devices-page-chart-bar-default"
import { DevicesPageTable } from "./devices-page-table"

export const DevicesPage = () => {
  const pagination = useDataTablePagination()

  const { data, isFetching, refetch } = useDevicesQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
  })

  return (
    <main className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        <ChartPieDonut />
        <ChartBarDefault />
      </div>

      <DevicesPageTable
        data={data?.data}
        pagination={{ ...pagination, ...data?.pagination }}
        loading={isFetching}
        onRefresh={() => {
          void refetch()
        }}
      />
    </main>
  )
}
