import type { Settings } from "../model/schema"

export const SETTINGS_API_PATH = "/api/settings"

type FetchSettingsParams = {
  signal?: AbortSignal
}

export async function fetchSettings({
  signal,
}: FetchSettingsParams = {}): Promise<Settings> {
  const response = await fetch(SETTINGS_API_PATH, { signal })

  if (!response.ok) {
    throw new Error("Failed to fetch settings")
  }

  return (await response.json()) as Settings
}

export async function saveSettings(settings: Settings): Promise<Settings> {
  const response = await fetch(SETTINGS_API_PATH, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  })

  if (!response.ok) {
    throw new Error("Failed to save settings")
  }

  return (await response.json()) as Settings
}
