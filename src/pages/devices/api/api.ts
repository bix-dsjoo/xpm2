import type { FetchDevicesRequest, FetchDevicesResponse } from "./dto"

export const DEVICES_API_PATH = "/api/devices"

export async function fetchDevices({
  page,
  pageSize,
  signal,
}: FetchDevicesRequest): Promise<FetchDevicesResponse> {
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

  return (await response.json()) as FetchDevicesResponse
}
