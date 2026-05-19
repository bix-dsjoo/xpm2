import type { ChartVariant } from "../model/types"

export const buildChartData = <TData extends Record<string, unknown>>(
  data: TData[],
  variant: ChartVariant,
  categoryKey: Extract<keyof TData, string>
) => {
  return data.map((item) => {
    if (variant === "bar" || variant === "area" || variant === "radar")
      return item

    return { ...item, fill: `var(--color-${item[categoryKey]})` }
  })
}
