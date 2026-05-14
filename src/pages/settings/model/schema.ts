import { z } from "zod"

export const systemOfMeasurementOptions = [
  { label: "Metric", value: "metric" },
  { label: "Imperial", value: "imperial" },
]

export const defaultPermissionOptions = [
  { label: "None", value: "none" },
  { label: "Administrator", value: "administrator" },
  { label: "GlobalUser", value: "global-user" },
]

export const settingsSchema = z.object({
  systemOfMeasurement: z.enum(["metric", "imperial"]),
  transactionTimeout: z
    .number()
    .int("Enter a whole number.")
    .min(1, "Enter at least 1 minute.")
    .max(5, "Enter 5 minutes or less."),
  connectionPingInterval: z
    .number()
    .int("Enter a whole number.")
    .min(1, "Enter at least 1 hour.")
    .max(48, "Enter 48 hours or less."),
  externalPermissionCacheLifetime: z
    .number()
    .int("Enter a whole number.")
    .min(1, "Enter at least 1 minute.")
    .max(600, "Enter 600 minutes or less."),
  defaultPermission: z.enum(["none", "administrator", "global-user"]),
  uniqueGroupNames: z.boolean(),
  enableAuditLogs: z.boolean(),
})

export type Settings = z.infer<typeof settingsSchema>

export const SETTINGS_DEFAULT_VALUES: Settings = {
  systemOfMeasurement: "metric",
  transactionTimeout: 0,
  connectionPingInterval: 0,
  externalPermissionCacheLifetime: 0,
  defaultPermission: "global-user",
  uniqueGroupNames: false,
  enableAuditLogs: false,
}
