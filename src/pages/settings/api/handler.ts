import { delay, http, HttpResponse } from "msw"

import { SETTINGS_API_PATH } from "./api"
import { settingsSchema, type Settings } from "../model/settings-schema"

let settings: Settings = {
  systemOfMeasurement: "metric",
  transactionTimeout: 2,
  connectionPingInterval: 5,
  externalPermissionCacheLifetime: 2,
  defaultPermission: "global-user",
  uniqueGroupNames: true,
  enableAuditLogs: false,
}

export const settingsHandlers = [
  http.get(SETTINGS_API_PATH, async () => {
    await delay(500)

    return HttpResponse.json({ ...settings })
  }),

  http.put(SETTINGS_API_PATH, async ({ request }) => {
    await delay(1000)

    const result = settingsSchema.safeParse(await request.json())

    if (!result.success) {
      return HttpResponse.json(
        {
          message: "Invalid settings",
          issues: result.error.issues,
        },
        { status: 400 }
      )
    }

    settings = result.data
    return HttpResponse.json({ ...result.data })
  }),
]
