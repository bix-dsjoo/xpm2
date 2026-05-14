import { devicesHandlers } from "@/pages/devices/api/handler"
import { settingsHandlers } from "@/pages/settings/api/handler"

export const handlers = [...devicesHandlers, ...settingsHandlers]
