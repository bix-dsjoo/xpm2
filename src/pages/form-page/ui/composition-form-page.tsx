import { monthOptions, yearOptions } from "../model/use-form-config"

import { useAppForm } from "@/components/form"
import {
  PAYMENT_FORM_DEFAULT_VALUES,
  paymentFormSchema,
} from "../model/payment-schema"

export function CompositionFormPage() {
  const form = useAppForm({
    defaultValues: PAYMENT_FORM_DEFAULT_VALUES,

    validators: {
      onSubmit: paymentFormSchema,
    },

    onSubmit: ({ value }) => {
      console.log(value)
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
            <form.FormFieldSet
              legend="Payment Method"
              description="All transactions are secure and encrypted"
            >
              <form.AppField name="enabled">
                {(field) => <field.SwitchField label="Enabled" />}
              </form.AppField>

              <form.Subscribe selector={(state) => state.values.enabled}>
                {(enabled) =>
                  enabled && (
                    <>
                      <form.AppField name="cardName">
                        {(field) => (
                          <field.TextField
                            label="Name on Card"
                            placeholder="Evil Rabbit"
                            required
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="cardNumber">
                        {(field) => (
                          <field.TextField
                            label="Card Number"
                            placeholder="1234 5678 9012 3456"
                            description="Enter your 16-digit card number"
                            required
                          />
                        )}
                      </form.AppField>

                      <div className="grid grid-cols-3 gap-4">
                        <form.AppField name="expMonth">
                          {(field) => (
                            <field.SelectField
                              label="Month"
                              placeholder="MM"
                              options={monthOptions}
                            />
                          )}
                        </form.AppField>

                        <form.AppField name="expYear">
                          {(field) => (
                            <field.SelectField
                              label="Year"
                              placeholder="YYYY"
                              options={yearOptions}
                            />
                          )}
                        </form.AppField>

                        <form.AppField name="cvv">
                          {(field) => (
                            <field.TextField
                              label="CVV"
                              placeholder="123"
                              required
                            />
                          )}
                        </form.AppField>
                      </div>
                    </>
                  )
                }
              </form.Subscribe>
            </form.FormFieldSet>

            <form.FormFieldSeparator />

            <form.FormFieldSet
              legend="Billing Address"
              description="The billing address associated with your payment method"
            >
              <form.AppField name="sameAsShipping">
                {(field) => (
                  <field.CheckboxField label="Same as shipping address" />
                )}
              </form.AppField>
            </form.FormFieldSet>

            <form.FormFieldSet>
              <form.AppField name="comments">
                {(field) => (
                  <field.TextareaField
                    label="Comments"
                    placeholder="Add any additional comments"
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
