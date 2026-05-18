import { useMemo } from "react"

import { ChartPieDonut } from "./devices-page-chart-pie-donut"
import { ChartBarDefault } from "./devices-page-chart-bar-default"
import { DevicesPageTable } from "./devices-page-table"

import {
  useDeviceChartPreferencesQuery,
  useDeviceChartsQuery,
} from "../model/queries"

function formatChartTitle(field: string) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (firstLetter) => firstLetter.toUpperCase())
}

export const DevicesPage = () => {
  const { data: chartPreferences } = useDeviceChartPreferencesQuery()
  const { data: charts } = useDeviceChartsQuery({
    charts: chartPreferences ? chartPreferences.charts : [],
  })
  const chartDataById = useMemo(
    () => new Map(charts?.charts.map((chart) => [chart.id, chart])),
    [charts]
  )

  return (
    <main className="flex h-svh flex-col gap-6 p-6">
      <h1 className="font-medium">Devices</h1>

      <div className="flex gap-4">
        {chartPreferences?.charts.map((preference) => {
          const chartData = chartDataById.get(preference.id)
          const title = formatChartTitle(preference.query.field)

          if (preference.chartType === "donut") {
            return (
              <ChartPieDonut
                key={preference.id}
                title={title}
                data={chartData?.kind === "category" ? chartData : undefined}
              />
            )
          }

          return (
            <ChartBarDefault
              key={preference.id}
              title={title}
              data={chartData}
            />
          )
        })}
      </div>

      <DevicesPageTable />
    </main>
  )
}
