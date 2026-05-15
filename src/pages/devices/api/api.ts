import type { DevicesResponse } from "../model/types"

export const DEVICES_API_PATH = "/api/devices"

type FetchDevicesParams = {
  page: number
  pageSize: number
  signal?: AbortSignal
}

export async function fetchDevices({
  page,
  pageSize,
  signal,
}: FetchDevicesParams): Promise<DevicesResponse> {
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

  return (await response.json()) as DevicesResponse
}
