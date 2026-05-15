import * as React from "react"

import { useDevicesQuery } from "../model/queries"
import { ChartPieDonut } from "./devices-page-chart-pie-donut"
import { ChartBarDefault } from "./devices-page-chart-bar-default"
import { DevicesPageTable } from "./devices-page-table"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 25

export const DevicesPage = () => {
  const [page, setPage] = React.useState(DEFAULT_PAGE)
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)

  const { data, isFetching, refetch } = useDevicesQuery({
    page,
    pageSize,
  })

  const handlePageSizeChange = React.useCallback((nextPageSize: number) => {
    setPage(DEFAULT_PAGE)
    setPageSize(nextPageSize)
  }, [])

  return (
    <main className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        <ChartPieDonut />
        <ChartBarDefault />
      </div>

      <DevicesPageTable
        data={data?.data}
        pagination={data?.pagination}
        loading={isFetching}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onRefresh={() => {
          void refetch()
        }}
      />
    </main>
  )
}
