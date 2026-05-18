import type {
  DeviceChartPreferencesResult,
  DeviceChartsQueryRequest,
  DeviceChartsQueryResult,
  FetchDevicesParams,
  FetchDevicesResult,
} from "./dto"

export const DEVICES_API_PATH = "/api/devices"
export const DEVICE_CHART_PREFERENCES_API_PATH = `${DEVICES_API_PATH}/chart-preferences`
export const DEVICE_CHARTS_QUERY_API_PATH = `${DEVICES_API_PATH}/charts/query`

export async function fetchDevices({
  page,
  pageSize,
  signal,
}: FetchDevicesParams): Promise<FetchDevicesResult> {
  const searchParams = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  })

  const response = await fetch(`${DEVICES_API_PATH}?${searchParams}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch devices")
  }

  return (await response.json()) as FetchDevicesResult
}

export async function fetchDeviceChartPreferences(
  signal?: AbortSignal
): Promise<DeviceChartPreferencesResult> {
  const response = await fetch(DEVICE_CHART_PREFERENCES_API_PATH, {
    signal,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch device chart preferences")
  }

  return (await response.json()) as DeviceChartPreferencesResult
}

export async function fetchDeviceCharts(
  request: DeviceChartsQueryRequest,
  signal?: AbortSignal
): Promise<DeviceChartsQueryResult> {
  const response = await fetch(DEVICE_CHARTS_QUERY_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch device charts")
  }

  return (await response.json()) as DeviceChartsQueryResult
}
