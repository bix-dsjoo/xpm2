export const buildChartData = <TData extends Record<string, unknown>>(
  data: TData[],
  categoryKey: Extract<keyof TData, string>
) => {
  return data.map((item) => {
    return {
      ...item,
      fill: `var(--color-${item[categoryKey]})`,
    }
  })
}
