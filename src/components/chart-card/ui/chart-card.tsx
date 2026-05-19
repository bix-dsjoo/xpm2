import { Button } from "@/base/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/base/ui/card"
import { ChartContainer } from "@/base/ui/chart"
import { buildChartConfig } from "../lib/build-chart-config"
import {
  AreaChartRenderer,
  BarChartRenderer,
  DonutChartRenderer,
  RadarChartRenderer,
} from "./chart-renderers"
import { SettingsIcon } from "lucide-react"
import { useMemo } from "react"
import type { ChartVariant } from "../model/types"
import type { ChartRenderer } from "./chart-renderers"

const chartRenderers = {
  donut: DonutChartRenderer,
  bar: BarChartRenderer,
  area: AreaChartRenderer,
  radar: RadarChartRenderer,
} satisfies Record<ChartVariant, ChartRenderer>

export type ChartCardProps<TData extends Record<string, unknown>> = {
  title: string
  variant?: ChartVariant
  data: TData[]
  valueKey: Extract<keyof TData, string>
  categoryKey: Extract<keyof TData, string>
}

export function ChartCard<TData extends Record<string, unknown>>({
  title,
  variant = "bar",
  data,
  valueKey,
  categoryKey,
}: ChartCardProps<TData>) {
  const ChartRenderer = chartRenderers[variant]

  const chartConfig = useMemo(
    () => buildChartConfig(data, valueKey, categoryKey),
    [data, valueKey, categoryKey]
  )

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>

        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-80"
        >
          <ChartRenderer
            data={data}
            valueKey={valueKey}
            categoryKey={categoryKey}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
