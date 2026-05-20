import { ChartContainer } from "@/base/ui/chart"
import { buildChartConfig } from "../lib/build-chart-config"
import {
  AreaChartRenderer,
  BarChartRenderer,
  DonutChartRenderer,
  RadarChartRenderer,
} from "./chart-renderers"

import { useMemo } from "react"
import type { ChartVariant } from "../model/types"
import type { ChartRenderer } from "./chart-renderers"

const chartRenderers = {
  donut: DonutChartRenderer,
  bar: BarChartRenderer,
  area: AreaChartRenderer,
  radar: RadarChartRenderer,
} satisfies Record<ChartVariant, ChartRenderer>

export type DataChartProps<TData extends Record<string, unknown>> = {
  variant?: ChartVariant
  data: TData[]
  valueKey: Extract<keyof TData, string>
  categoryKey: Extract<keyof TData, string>
}

export function DataChart<TData extends Record<string, unknown>>({
  variant = "bar",
  data,
  valueKey,
  categoryKey,
}: DataChartProps<TData>) {
  const ChartRenderer = chartRenderers[variant]

  const chartConfig = useMemo(
    () => buildChartConfig(data, valueKey, categoryKey),
    [data, valueKey, categoryKey]
  )

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-80">
      <ChartRenderer
        data={data}
        valueKey={valueKey}
        categoryKey={categoryKey}
      />
    </ChartContainer>
  )
}
