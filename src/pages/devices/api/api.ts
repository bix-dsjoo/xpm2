import type { Device } from "../model/types"

export const DEVICES_API_PATH = "/api/devices"

type FetchDevicesParams = {
  signal?: AbortSignal
}

export async function fetchDevices({
  signal,
}: FetchDevicesParams = {}): Promise<Device[]> {
  const response = await fetch(DEVICES_API_PATH, { signal })

  if (!response.ok) {
    throw new Error("Failed to fetch devices")
  }

  return (await response.json()) as Device[]
}
