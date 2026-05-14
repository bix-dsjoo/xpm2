import { useAppForm } from "@/components/form"

import {
  defaultPermissionOptions,
  SETTINGS_DEFAULT_VALUES,
  settingsSchema,
  systemOfMeasurementOptions,
} from "../model/settings-schema"
import { useSaveSettingsMutation, useSettingsQuery } from "../model/queries"

export function SettingsPage() {
  const { data } = useSettingsQuery()
  const { mutateAsync } = useSaveSettingsMutation()

  const form = useAppForm({
    defaultValues: data ?? SETTINGS_DEFAULT_VALUES,

    validators: {
      onSubmit: settingsSchema,
    },

    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return (
    <div className="flex min-h-svh p-6">
      <form.AppForm>
        <form
          className="w-full sm:max-w-lg"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.FormFieldGroup>
            <form.FormFieldSet legend="General Configuration">
              <form.AppField name="systemOfMeasurement">
                {(field) => (
                  <field.SelectField
                    options={systemOfMeasurementOptions}
                    label="System of Measurement"
                    description="Change the system of measurement used in SOTI Connect (this does not affect the device)"
                  />
                )}
              </form.AppField>
              <form.AppField name="transactionTimeout">
                {(field) => (
                  <field.TextField
                    type="number"
                    label="Transaction Timeout"
                    description="Set the amount of time that SOTI Connect should continue to wait for a response from a device before canceling the attempt to connect with it."
                  />
                )}
              </form.AppField>
              <form.AppField name="connectionPingInterval">
                {(field) => (
                  <field.TextField
                    type="number"
                    label="Connection Ping Interval"
                    description="Set the interval of time that SOTI Connect monitors device connection status."
                  />
                )}
              </form.AppField>
              <form.AppField name="externalPermissionCacheLifetime">
                {(field) => (
                  <field.TextField
                    type="number"
                    label="External Permission Cache Lifetime"
                    description="Set the caching duration for the user permissions retrieved from external services, such as Microsoft Graph."
                  />
                )}
              </form.AppField>
              <form.AppField name="defaultPermission">
                {(field) => (
                  <field.SelectField
                    options={defaultPermissionOptions}
                    label="Default Permission"
                    description="Set a role which will be used for users who do not have a predefined role, such as users coming from a third-party identity provider."
                  />
                )}
              </form.AppField>
              <form.AppField name="uniqueGroupNames">
                {(field) => (
                  <field.SwitchField
                    label="Unique Group Names"
                    description="Enforce unique group names within a parent group."
                  />
                )}
              </form.AppField>
              <form.AppField name="enableAuditLogs">
                {(field) => (
                  <field.SwitchField
                    label="Enable Audit Logs"
                    description="Allow Connect to create historical logs of user activity."
                  />
                )}
              </form.AppField>
            </form.FormFieldSet>

            <form.FormActions>
              <form.SubmitButton>Submit</form.SubmitButton>
              <form.ResetButton>Cancel</form.ResetButton>
            </form.FormActions>
          </form.FormFieldGroup>
        </form>
      </form.AppForm>
    </div>
  )
}
