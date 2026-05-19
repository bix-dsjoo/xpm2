export const buildChartData = <TData extends Record<string, unknown>>(
  data: TData[],
  variant: "donut" | "bar",
  categoryKey: Extract<keyof TData, string>
) => {
  return data.map((item) => {
    if (variant === "bar") return item

    return { ...item, fill: `var(--color-${item[categoryKey]})` }
  })
}
